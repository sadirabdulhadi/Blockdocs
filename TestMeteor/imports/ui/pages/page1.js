import './page1.html'
import '../../api/common.js'
import { documentsdb } from '../../../lib/database.js';
import { toSign } from '../../../lib/database.js';
import { Meteor } from 'meteor/meteor';
//Defining the contract
var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[0];
var PCabi = [{"constant":false,"inputs":[{"name":"nonce","type":"string"}],"name":"generateId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"documents","outputs":[{"name":"organizer","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"SimpleSign","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"signId","type":"uint8"}],"name":"getSignDetails","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"addSignature","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentDetails","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentOrganizer","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"index","type":"uint256"}],"name":"getDocumentSignature","outputs":[{"name":"value","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"removeDocument","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"dochash","type":"bytes32"}],"name":"createDocument","outputs":[{"name":"docId","type":"bytes32"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getSignsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"id","type":"bytes32"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"docId","type":"bytes32"}],"name":"Signed","type":"event"}];
var PCaddress = '0x6a4fab84d9746194e08a69903d83dad44441b6b4';
var hash = undefined;
var category = undefined;
var currentDocumentId = undefined;

Template.page1.events({
  //upload document on click
  'change .upload': function(event, template) {
    ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[Meteor.user().profile.accounts];
    console.log("it is")
    console.log(Meteor.user().profile.accounts);
    hash=undefined;
    var files = event.target.files;
    console.log(files[0]);
    //console.log("the hash should be " + getBase64(files))
    event.preventDefault();
    calculateHash(files);
    insertDoc(files);
  },
  //sign up button
  'click #register':function(event,template){
     Accounts.createUser({
      email: email,
      password: password,
      profile: { homeAddress: homeAddress }
    });
 }
});

Template.page1.helpers({
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

Template.imageView.helpers({
  images: function () {
    var UserImages = documentsdb.find({owner:Meteor.userId()}).fetch();
    var imageIds = UserImages.map(function(a) {return a.id;});
    console.log(UserImages);
    return Images.find({_id: {$in: imageIds}}); // Where Images is an FS.Collection instance
  }
});


Template.imageView.events({
  'click #toSign': function () {
    console.log("yay called");
    toSign.insert({
        document_id: currentDocumentId,
        institution: category,
        signed: 0
        });
    category = undefined;
  },
    'click #button': function () {
      currentDocumentId = this._id;
      console.log("linke here isss" );
      //Blaze.renderWithData(Template.toBeRenderedTemplate, this.url , document.body );
      $('#yourModal').modal('show');
    },
      'click #deleteFileButton ': function (event) {
      console.log("deleteFile button ", this);
      Images.remove({_id: this._id});
    },
  });
  

Template.categories.helpers({
    categories: function(){
        return Meteor.users.find({"profile.powerofsign": {$eq: 1}}).fetch().map(function(a) {return a.profile.firstName;});
    }
});

Template.categories.events({
    "change #category-select": function (event, template) {
        category = $(event.currentTarget).val();
        console.log("category : " + category);
        // additional code to do what you want with the category
    }
});

function getBase64(files) {
        //Read File
        var selectedFile = files
        //Check File is not Empty
        if (selectedFile.length > 0) {
            // Select the very first file from list
            var fileToLoad = selectedFile[0];
            // FileReader function for read the file.
            var fileReader = new FileReader();
            var base64;
            var toreturn;
            fileReader.onload = function(fileLoadedEvent) {
                base64 = fileLoadedEvent.target.result;
                //console.log("base 64 is");
                //console.log(base64);
                isCalculated = true;
                toreturn = ETHEREUM_CLIENT.sha3(base64);
                //console.log("to return is " + toreturn);
                hash = toreturn;
                console.log("hash has been calculated, it's now" + hash)
            };
            // Convert data to base64
            fileReader.readAsDataURL(fileToLoad);
        }
    }

function insertDoc(files){
      console.log("files are"); 
      console.log(files);
      console.log("we're in insertdoc"); 
      console.log(hash); 
      if(hash == undefined){
        console.log("we're delaying, hash is" + hash); 
        setTimeout(insertDoc, 1000, files);
      }
      else{
        console.log("It's finally defined, it's " + hash);
        for (var i = 0, ln = files.length; i < ln; i++) {
          Images.insert(files[i], function (err, fileObj) {
            documentsdb.insert({
              id: fileObj._id,
              createdAt: new Date(), // current time
              owner: Meteor.userId(),
              username: Meteor.user().emails[0].address
            });
          });
        }
        // Insert a task into the collection
        var depdep = ETHEREUM_CLIENT.eth.contract(PCabi).at(PCaddress);
        console.log(depdep.createDocument(hash));
        console.log(documentsdb.find({}).fetch());
        hash = undefined;
        console.log(hash);
      }
}

function calculateHash(files){
  getBase64(files);
}

getUserId = function(){
  console.log("we're called indeed");
  console.log(Meteor.userId());
  return Meteor.userId();
}