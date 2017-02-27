import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var Web3 = require('web3');
var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[1];
var PCabi = [{"constant":true,"inputs":[],"name":"getPeople","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_firstName","type":"bytes32"},{"name":"_lastName","type":"bytes32"},{"name":"_age","type":"uint256"}],"name":"addPerson","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"people","outputs":[{"name":"FirstName","type":"bytes32"},{"name":"LastName","type":"bytes32"},{"name":"Age","type":"uint256"}],"payable":false,"type":"function"}];
var PCaddress = '0xb15803ded3f7cd5533ae073993115897aed122b5';

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
