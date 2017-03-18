import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var Web3 = require('web3');
var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[1];
var PCabi = [{"constant":false,"inputs":[{"name":"nonce","type":"string"}],"name":"createDocument","outputs":[{"name":"docId","type":"bytes32"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"nonce","type":"string"}],"name":"generateId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"documents","outputs":[{"name":"organizer","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"SimpleSign","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"signId","type":"uint8"}],"name":"getSignDetails","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"addSignature","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentDetails","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getDocumentOrganizer","outputs":[{"name":"organizer","type":"address"},{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"},{"name":"index","type":"uint256"}],"name":"getDocumentSignature","outputs":[{"name":"value","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"removeDocument","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"docId","type":"bytes32"}],"name":"getSignsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"id","type":"bytes32"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"docId","type":"bytes32"}],"name":"Signed","type":"event"}];
var PCaddress = '0xef26812cc1869200ce8a4bae44e816904e422a81';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    console.log("hello");
    console.log(ETHEREUM_CLIENT)
    var depdep = ETHEREUM_CLIENT.eth.contract(PCabi).at(PCaddress);
    console.log(depdep.addPerson("Habib", "Amani", 33));
    console.log(depdep.getPeople());
    instance.counter.set(instance.counter.get() + 1);
  },
});
