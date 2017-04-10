import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/app-body.js'
import '../../ui/pages/page1.js'
import '../../ui/pages/page2.js'
import '../../ui/pages/page3.js'
import '../../ui/pages/signin.js'
import '../../ui/pages/signup.js'
import '../../ui/components/navandfoot.js'


FlowRouter.route('/page1', {
  name: 'Lists.show',
  action() {
    console.log("we're here 1!")
    BlazeLayout.render('App_body', {nav: 'navstd', main: 'page1', footer: 'footstd'});
  }
});

FlowRouter.route('/', {
  name: 'Lists.show',
  action() {
    console.log("we're here 1!")
    BlazeLayout.render('App_body', {nav: 'navstd', main: 'page1', footer: 'footstd'});
  }
});

FlowRouter.route('/page2', {
  name: 'Lists.show',
  action() {
    console.log("we're here!")
    BlazeLayout.render('App_body', {nav: 'navstd', main: 'page2', footer: 'footstd'});
  }
});

FlowRouter.route('/page3', {
  name: 'Lists.show',
  action() {
    console.log("we're here!")
    BlazeLayout.render('App_body', {nav: 'navstd', main: 'page3', footer: 'footstd'});
  }
});

FlowRouter.route('/signin', {
  name: 'Lists.show',
  action() {
    console.log("we're here!")
    BlazeLayout.render('App_body', {nav: 'navstd', main: 'signin', footer: 'footstd'});
  }
});

FlowRouter.route('/signup', {
  name: 'Lists.show',
  action() {
    console.log("we're here!")
    BlazeLayout.render('App_body', {nav: 'navstd', main: 'signup', footer: 'footstd'});
  }
});

