import './signin.html'
var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[1];
var PCabi = '[{"constant":false,"inputs":[{"name":"nonce","type":"string"}],"name":"generateId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"documents","outputs":[{"name":"organizer","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"SimpleSign","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"signId","type":"uint8"}],"name":"getSignDetails","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"addSignature","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentDetails","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentOrganizer","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"index","type":"uint256"}],"name":"getDocumentSignature","outputs":[{"name":"value","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"removeDocument","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"dochash","type":"bytes32"}],"name":"createDocument","outputs":[{"name":"docId","type":"bytes32"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getSignsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"id","type":"bytes32"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"docId","type":"bytes32"}],"name":"Signed","type":"event"}]'
var PCaddress = '0x30650f8af76fdced6c19c94cbaa466b6e0d01939';

if (Meteor.isClient) {
  Template.signin.events({
    'submit form': function(event, template) {
        event.preventDefault();
            var passwordVar = template.find('#password').value;
            Meteor.loginWithPassword(template.find('#email').value, passwordVar);
            console.log(Meteor.users.find({"emails.address":"sido"}).fetch());
            // FlowRouter.go('/page1');
        }
  });

  Template.signin.helpers({
  isInstitution: function() {
    if(Meteor.user()){
      console.log(Meteor.user());
      var isInsti = Meteor.user().profile.powerofsign;
      console.log(isInsti);
      if (isInsti==1){
        FlowRouter.go('/sign');
        return true;
      }
      else {
         FlowRouter.go('/documents');
        return false;
      }
    }
  }
});
}