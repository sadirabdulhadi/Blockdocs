import { Meteor } from 'meteor/meteor';
import '../imports/api/common.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Images.allow({
  'insert': function () {
    // add custom authentication code here
    return true;
  }
});