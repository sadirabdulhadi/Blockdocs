import './page2.html'
import '../../api/common.js'
import { documentsdb } from '../../../lib/database.js';
import { Meteor } from 'meteor/meteor';
import { toSign } from '../../../lib/database.js';


Template.page2.helpers({
//user is institution
  isInstitution: function() {
    console.log(Meteor.user().profile.powerofsign);
    var isInsti = Meteor.user().profile.powerofsign;
    if (isInsti==1){
      return true;
    }
    else {
      return false;
    }
  }
});


Template.toSignView.helpers({
  images: function () {
    var UserImages = toSign.find({}).fetch();
    var imageIds = UserImages.map(function(a) {return a.id;});
    console.log("yoyo");
    console.log(UserImages);
    return Images.find({_id: {$in: imageIds}}); // Where Images is an FS.Collection instance
  }
});
