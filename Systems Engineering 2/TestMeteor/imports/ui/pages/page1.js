import './page1.html'
import '../../api/common.js'

Template.page1.events({
  'change .upload': function(event, template) {
    event.preventDefault();
    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      Images.insert(files[i], function (err, fileObj) {
        console.log("Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP")
      });
    }
 
    const target = event.target;
    const text = "hallo";
    // Insert a task into the collection
    documentsdb.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
 
       // Clear form
    target.text.value = '';
  }
});