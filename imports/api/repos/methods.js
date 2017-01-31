import { Meteor } from 'meteor/meteor';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import 'isomorphic-fetch';

const networkInterface = createNetworkInterface({
  uri: 'https://api.github.com/graphql',
});

networkInterface.use([{
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

const client = new ApolloClient({
  networkInterface,
});

const repoQuery = gql`
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
    const data = client.query({ query: repoQuery, variables: { username, repo } }).then(result =>
      result.data,
    reason =>
      reason
    );

    return data;
  },
});
