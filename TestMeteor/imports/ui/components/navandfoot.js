import './navandfoot.html'

Template.navstd.helpers({
  isInstitution: function() {
    if(Meteor.user()){
      console.log(Meteor.user());
      var isInsti = Meteor.user().profile.powerofsign;
      console.log(isInsti);
      if (isInsti==1){
        return true;
      }
      else {
        return false;
      }
    }
  }
});