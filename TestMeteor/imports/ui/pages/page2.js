import './page2.html'
import './page1.js'
import '../../api/common.js'
import { documentsdb } from '../../../lib/database.js';
import { Meteor } from 'meteor/meteor';
import { toSign } from '../../../lib/database.js';


var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[1];
var PCabi = [{"constant":false,"inputs":[{"name":"nonce","type":"string"}],"name":"generateId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"documents","outputs":[{"name":"organizer","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"SimpleSign","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"signId","type":"uint8"}],"name":"getSignDetails","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"addSignature","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentDetails","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentOrganizer","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"index","type":"uint256"}],"name":"getDocumentSignature","outputs":[{"name":"value","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"removeDocument","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"dochash","type":"bytes32"}],"name":"createDocument","outputs":[{"name":"docId","type":"bytes32"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getSignsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"id","type":"bytes32"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"docId","type":"bytes32"}],"name":"Signed","type":"event"}];
var PCaddress = '0x6a4fab84d9746194e08a69903d83dad44441b6b4';
var dochash = undefined;
var userFirstName;

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
    console.log("helloo");
    userFirstName = Meteor.users.find({_id : Meteor.userId()}).fetch()[0].profile.firstName;
    var UserImages = toSign.find({institution:userFirstName}).fetch();
    console.log(UserImages);
    var imageIds = UserImages.map(function(a) {return a.document_id;});
    console.log("yoyo");
    console.log(UserImages);
    console.log(Images.find({_id: {$in: imageIds}}).fetch()[0])
    return Images.find({_id: {$in: imageIds}}); // Where Images is an FS.Collection instance
  }
});

Template.toSignView.events({
  'click #button': function () {
  },
  'click #notSign': function () {
   },
  'click #sign': function (event) {
    ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[Meteor.user().profile.accounts];
    var dochash = calculateHash(this);
    signOnBlockchain(dochash);
    //make sure first name is calculated
    console.log(userFirstName);
    console.log(this._id);
    var doc = toSign.find({document_id:this._id, institution:userFirstName}).fetch().map(function(a) {return a._id});
    console.log(doc);
    for (var i in doc){
      console.log("i is" + doc[i]);
      toSign.update({_id : doc[i]}, {$set:{signed:1}});
    }
    },
  });

  function signOnBlockchain(){
     console.log("we're in signOnBlockchain"); 
     console.log(dochash); 
      if(dochash == undefined){
        setTimeout(signOnBlockchain, 1000);
      }
      else{
        var depdep = ETHEREUM_CLIENT.eth.contract(PCabi).at(PCaddress);
        console.log(depdep.addSignature(dochash));
      }
      dochash = undefined;

  }

function getBase64(files) {
        var base64;
        toDataUrl(files.url({store:"images"}), function(base64Img) {
          base64 = base64Img;
          console.log(base64);
          console.log("the hash is");
          console.log(ETHEREUM_CLIENT.sha3(base64));
          dochash = ETHEREUM_CLIENT.sha3(base64);
        });
    }


function calculateHash(files){
  getBase64(files);
}

function toDataUrl(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}
