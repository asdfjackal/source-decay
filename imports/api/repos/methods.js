/* eslint-disable object-shorthand */
/* eslint-disable no-param-reassign */
/* Disable object shorthand error as the suggested naming scheme for meteor methods
violates the rule*/

import { Meteor } from 'meteor/meteor';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import 'isomorphic-fetch';
import { polyfill } from 'es6-promise';

import Repos from './repos.js';

polyfill();

const githubToken = process.env.SD_TOKEN;

function clientFromToken(token) {
  const networkInterface = createNetworkInterface({
    uri: 'https://api.github.com/graphql',
  });

  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }

      // get the authentication token from local storage if it exists
      req.options.headers.authorization = token ? `Bearer ${token}` : null;
      next();
    },
  }]);

  return new ApolloClient({
    networkInterface,
  });
}

const repoListQuery = gql`
  query repoListQuery {
    viewer {
      repositories(first: 25) {
        nodes {
          name
          description,
          url,
          isPrivate,
          id,
          owner{
            login
          }
        }
      }
    }
  }
`;

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
  'repos.getList'() {
    const data = clientFromToken(Meteor.user().services.github.accessToken).query({
      query: repoListQuery,
    }).then(
    result =>
      result.data,
    reason =>
      reason
    );

    return data;
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
