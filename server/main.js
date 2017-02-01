import { Meteor } from 'meteor/meteor';
import 'meteor/service-configuration';
import '../imports/api/repos/methods.js';

Meteor.startup(() => {
  ServiceConfiguration.configurations.upsert(
  { service: 'github' },
    {
      $set: {
        clientId: process.env.GITHUB_ID,
        requestPermissions: ['user'],
        loginStyle: 'popup',
        secret: process.env.GITHUB_SECRET,
      },
    }
  );
});
