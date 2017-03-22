import { Template } from 'meteor/templating';
import { documentsdb } from '../api/database.js';
 
import './documentListElem.html';
 
Template.documentListElem.events({
  'click .delete'() {
    Tasks.remove(this._id);
  },
});