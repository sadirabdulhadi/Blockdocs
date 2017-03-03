import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
//import "../startup/client/user.js"

Images = new FS.Collection("images", {
   stores: [new FS.Store.FileSystem("images", {path: Meteor.absolutePath + '/resources/' })]
 });

// var imageStore = new FS.Store.GridFS(“images”);

// Images = new FS.Collection(“images”, {
//  stores: [imageStore]
// });

