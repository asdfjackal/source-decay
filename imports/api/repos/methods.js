/* eslint-disable object-shorthand */
/* Disable object shorthand error as the suggested naming scheme for meteor methods
violates the rule*/

import { Meteor } from 'meteor/meteor';
import gql from 'graphql-tag';
import 'isomorphic-fetch';
import { polyfill } from 'es6-promise';
import { clientFromToken, githubToken } from '../common.js';

import Repos from './repos.js';

polyfill();

const repoSummaryQuery = gql`
  query repoSummaryQuery($username: String!, $repo: String!){
    repository(owner: $username, name: $repo) {
      createdAt,
      pushedAt,
      description,
      hasIssuesEnabled,
      url,
      id,
      name,
      owner{
        login,
        url
      },
      ref(qualifiedName: "master") {
        name
        prefix
        target {
          ...commitFragment
        }
      },
      issues(first:1,states:OPEN){
        nodes{
          title,
          createdAt,
          url
        },
        totalCount
      }
    }
  }

  fragment commitFragment on Commit {
    message
    tree {
      entries {
        name
        object {
          ...blobIdFragment
        }
      }
    }
    history(first: 5) {
      nodes {
        id,
        url,
        message,
        committer{
          date,
          user{
            url,
            name
          }
        }
      }
    }
  }

  fragment blobIdFragment on Blob {
    id
    oid
  }
`;

Meteor.methods({
  'repos.getInfo'({ username, repo }) {
    const repoData = Repos.findOne({ 'repository.owner.login': username, 'repository.name': repo });

    if (repoData) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (repoData.datetime > yesterday) {
        return repoData;
      }
    }

    return clientFromToken(githubToken).query({
      query: repoSummaryQuery,
      variables: { username, repo } }).then(
    (result) => {
      const data = result.data;
      data.datetime = new Date();
      Repos.rawCollection().update(data.repository.id, data, { upsert: true });
      return data;
    },
    reason =>
      reason
    );
  },
  'repos.forceUpdate'({ username, repo }) {
    return clientFromToken(githubToken).query({
      query: repoSummaryQuery,
      variables: { username, repo } }).then(
    (result) => {
      const data = result.data;
      data.datetime = new Date();
      Repos.rawCollection().update(data.repository.id, data, { upsert: true });
      return data;
    },
    reason =>
      reason
    );
  },
});
