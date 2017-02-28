import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/app-body.js'
import '../../ui/pages/page1.js'
import '../../ui/pages/page2.js'


FlowRouter.route('/page1', {
  name: 'Lists.show',
  action() {
    console.log("we're here 1!")
    BlazeLayout.render('App_body', {main: 'page1'});
  }
});

FlowRouter.route('/page2', {
  name: 'Lists.show',
  action() {
    console.log("we're here!")
    BlazeLayout.render('App_body', {main: 'page2'});
  }
});