import './page2.html'
import './page1.js'
import '../../api/common.js'
import { documentsdb } from '../../../lib/database.js';
import { Meteor } from 'meteor/meteor';
import { toSign } from '../../../lib/database.js';

var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[1];
var PCabi = [{"constant":false,"inputs":[{"name":"nonce","type":"string"}],"name":"generateId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"documents","outputs":[{"name":"organizer","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"SimpleSign","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"signId","type":"uint8"}],"name":"getSignDetails","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"addSignature","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentDetails","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentOrganizer","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"index","type":"uint256"}],"name":"getDocumentSignature","outputs":[{"name":"value","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"removeDocument","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"dochash","type":"bytes32"}],"name":"createDocument","outputs":[{"name":"docId","type":"bytes32"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getSignsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"id","type":"bytes32"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"docId","type":"bytes32"}],"name":"Signed","type":"event"}];
var PCaddress = '0x1c91c6f63d0188effdd5c3a2906f54904443dc04';
var dochash = undefined;

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

Template.toSignView.events({
  'click #button': function () {
  },
  'click #notSign': function () {
   },
  'click #sign': function (event) {
    console.log("this is");
    console.log(this);
    var dochash = calculateHash(this);
    signOnBlockchain(dochash);
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
        console.log("step 1");
        //Read File
        var selectedFile = new Blob(files.url, {type: 'file'})
        //var blobby = files.url;
        //if (selectedFile.length > 0) {
            console.log("step 2");
            // Select the very first file from list
            var fileToLoad = selectedFile;
            // FileReader function for read the file.
            var fileReader = new FileReader();
            var base64;
            console.log(fileToLoad);
            // Onload of file read the file content
            console.log("STEP 3");
            fileReader.onload = function(fileLoadedEvent) {
                console.log("STEP 4");
                base64 = fileLoadedEvent.target.result;
                console.log(ETHEREUM_CLIENT.sha3(base64));
                console.log("it has been calculated");
                isCalculated = true;
                dochash = ETHEREUM_CLIENT.sha3(base64);
            };
            // Convert data to base64
            fileReader.readAsDataURL(fileToLoad);
       // }
    }


function calculateHash(files){
  getBase64(files);
}
