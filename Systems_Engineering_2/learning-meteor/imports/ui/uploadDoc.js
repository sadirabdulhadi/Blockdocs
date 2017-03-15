import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';

import '../startup/accounts-config.js'; 
import './body.html';
import './task.js';

Template.uploadDoc.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});