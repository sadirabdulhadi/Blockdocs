import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './app-body.html';
import './app-body.css';

Template.App_body.events({
    'click #logout': function(event, template) {
      Meteor.logout();
    }
  });

Meteor.autorun(function(){
  $('body').css('background','url(images/back.jpg)');
});
