import { Meteor } from 'meteor/meteor';
import 'meteor/service-configuration';
import '../imports/api/repos/methods.js';
import '../imports/api/repos/repos.js';
import '../imports/api/userData/methods.js';
import '../imports/api/userData/userData.js';

Meteor.startup(() => {
  ServiceConfiguration.configurations.upsert(
  { service: 'github' },
    {
      $set: {
        clientId: process.env.GITHUB_ID,
        loginStyle: 'popup',
        secret: process.env.GITHUB_SECRET,
      },
    }
  );
});
