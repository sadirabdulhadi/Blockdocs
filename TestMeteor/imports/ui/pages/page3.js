import './page3.html'
import './page1.js'
import '../../api/common.js'
import { documentsdb } from '../../../lib/database.js';
import { Meteor } from 'meteor/meteor';
import { toSign } from '../../../lib/database.js';


var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[1];
var PCabi = [{"constant":false,"inputs":[{"name":"nonce","type":"string"}],"name":"generateId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"documents","outputs":[{"name":"organizer","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"SimpleSign","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"signId","type":"uint8"}],"name":"getSignDetails","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"addSignature","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentDetails","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentOrganizer","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"index","type":"uint256"}],"name":"getDocumentSignature","outputs":[{"name":"value","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"removeDocument","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"dochash","type":"bytes32"}],"name":"createDocument","outputs":[{"name":"docId","type":"bytes32"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getSignsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"id","type":"bytes32"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"docId","type":"bytes32"}],"name":"Signed","type":"event"}];
var PCaddress = '0x7aeddbf80b9f45e541cbf5085b86f4ab7e20246b';
var dochash = undefined;
var userFirstName;
var hash;
var list = [];

Template.page3.events({
  //upload document on click
  'change .upload': function(event, template) {

    var files = event.target.files;
    console.log(files[0]);
    event.preventDefault();
    calculateHash(files);
    getSign();
    // all the l (one at every iteration) = the name of the person that signed

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

function calculateHash(files){
  getBase64(files);
}

function getSign(){
  console.log(hash); 
    if(hash == undefined){
      setTimeout(getSign, 1000);
    }
    else{
      console.log(hash);
      var depdep = ETHEREUM_CLIENT.eth.contract(PCabi).at(PCaddress);
      var x = depdep.getSignsCount.call(hash).c[0];
      console.log(x);
      for (var i =0;i<x;i++){
      console.log("hi");
      var z = depdep.getSignDetails.call(hash,i);
      console.log(z);
      var l = ETHEREUM_CLIENT.eth.accounts.indexOf(z);
      var signer = Meteor.users.find({"profile.accounts":l}).fetch()[0].profile.firstName;
      list.push(signer);
    }
    console.log(list);
    hash = undefined;
    var myh1 = document.getElementById('Sadir');
    myh1.textContent = "Signed by " + list
    return list;
    }
}