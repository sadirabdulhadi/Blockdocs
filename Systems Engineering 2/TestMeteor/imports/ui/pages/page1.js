import './page1.html'
import '../../api/common.js'
import { documentsdb } from '../../../lib/documentsdb.js';
import { Meteor } from 'meteor/meteor';

//var Web3 = require('web3');
var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[1];
var PCabi = [{"constant":false,"inputs":[{"name":"nonce","type":"string"}],"name":"createDocument","outputs":[{"name":"docId","type":"bytes32"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"nonce","type":"string"}],"name":"generateId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"documents","outputs":[{"name":"organizer","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"SimpleSign","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"signId","type":"uint8"}],"name":"getSignDetails","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"addSignature","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentDetails","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentOrganizer","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"index","type":"uint256"}],"name":"getDocumentSignature","outputs":[{"name":"value","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"removeDocument","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getSignsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"id","type":"bytes32"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"docId","type":"bytes32"}],"name":"Signed","type":"event"}];
var PCaddress = '0xef26812cc1869200ce8a4bae44e816904e422a81';

Template.page1.events({
  'change .upload': function(event, template) {
    event.preventDefault();
    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      Images.insert(files[i], function (err, fileObj) {
        console.log("Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP")
      });
      console.log("aloha1")
    }
 
    console.log("aloha2")
    const text = "hallo";
    // Insert a task into the collection
    documentsdb.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().emails[0].address
    });
    var depdep = ETHEREUM_CLIENT.eth.contract(PCabi).at(PCaddress);
    console.log(depdep.createDocument("yolor"));
    console.log(documentsdb.find({}).fetch())
  }
});