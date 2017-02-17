/* eslint-disable object-shorthand */
import { Meteor } from 'meteor/meteor';
import gql from 'graphql-tag';
import 'isomorphic-fetch';
import { polyfill } from 'es6-promise';
import { clientFromToken } from '../common.js';

import UserData from './userData.js';

polyfill();

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

Meteor.methods({
  'userData.getRepoList'() {
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
