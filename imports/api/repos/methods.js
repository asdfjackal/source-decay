/* eslint-disable object-shorthand */
/* eslint-disable no-param-reassign */
/* Disable object shorthand error as the suggested naming scheme for meteor methods
violates the rule*/

import { Meteor } from 'meteor/meteor';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import 'isomorphic-fetch';

const coreNetworkInterface = createNetworkInterface({
  uri: 'https://api.github.com/graphql',
});

coreNetworkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }

    // get the authentication token from local storage if it exists
    const token = process.env.SD_TOKEN;
    req.options.headers.authorization = token ? `Bearer ${token}` : null;
    next();
  },
}]);

const coreClient = new ApolloClient({
  coreNetworkInterface,
});

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
  query{
    viewer{
      repositories(first:10){
        nodes{
          name,
          description
        }
      }
    }
  }
`;

const repoSummaryQuery = gql`
  query repoQuery($username: String!, $repo: String!){
    repository(owner: $username, name: $repo) {
      createdAt,
      pushedAt,
      description,
      hasIssuesEnabled,
      url,
      owner{
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
    const data = coreClient.query({
      query: repoSummaryQuery,
      variables: { username, repo } }).then(
    result =>
      result.data,
    reason =>
      reason
    );

    return data;
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
});
