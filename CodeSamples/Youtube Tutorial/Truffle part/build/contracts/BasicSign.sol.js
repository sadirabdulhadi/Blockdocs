var Web3 = require("web3");
var SolidityEvent = require("web3/lib/web3/event.js");

(function() {
  // Planned for future features, logging, etc.
  function Provider(provider) {
    this.provider = provider;
  }

  Provider.prototype.send = function() {
    this.provider.send.apply(this.provider, arguments);
  };

  Provider.prototype.sendAsync = function() {
    this.provider.sendAsync.apply(this.provider, arguments);
  };

  var BigNumber = (new Web3()).toBigNumber(0).constructor;

  var Utils = {
    is_object: function(val) {
      return typeof val == "object" && !Array.isArray(val);
    },
    is_big_number: function(val) {
      if (typeof val != "object") return false;

      // Instanceof won't work because we have multiple versions of Web3.
      try {
        new BigNumber(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    merge: function() {
      var merged = {};
      var args = Array.prototype.slice.call(arguments);

      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        var keys = Object.keys(object);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var value = object[key];
          merged[key] = value;
        }
      }

      return merged;
    },
    promisifyFunction: function(fn, C) {
      var self = this;
      return function() {
        var instance = this;

        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {
          var callback = function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              accept(result);
            }
          };
          args.push(tx_params, callback);
          fn.apply(instance.contract, args);
        });
      };
    },
    synchronizeFunction: function(fn, instance, C) {
      var self = this;
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {

          var decodeLogs = function(logs) {
            return logs.map(function(log) {
              var logABI = C.events[log.topics[0]];

              if (logABI == null) {
                return null;
              }

              var decoder = new SolidityEvent(null, logABI, instance.address);
              return decoder.decode(log);
            }).filter(function(log) {
              return log != null;
            });
          };

          var callback = function(error, tx) {
            if (error != null) {
              reject(error);
              return;
            }

            var timeout = C.synchronization_timeout || 240000;
            var start = new Date().getTime();

            var make_attempt = function() {
              C.web3.eth.getTransactionReceipt(tx, function(err, receipt) {
                if (err) return reject(err);

                if (receipt != null) {
                  // If they've opted into next gen, return more information.
                  if (C.next_gen == true) {
                    return accept({
                      tx: tx,
                      receipt: receipt,
                      logs: decodeLogs(receipt.logs)
                    });
                  } else {
                    return accept(tx);
                  }
                }

                if (timeout > 0 && new Date().getTime() - start > timeout) {
                  return reject(new Error("Transaction " + tx + " wasn't processed in " + (timeout / 1000) + " seconds!"));
                }

                setTimeout(make_attempt, 1000);
              });
            };

            make_attempt();
          };

          args.push(tx_params, callback);
          fn.apply(self, args);
        });
      };
    }
  };

  function instantiate(instance, contract) {
    instance.contract = contract;
    var constructor = instance.constructor;

    // Provision our functions.
    for (var i = 0; i < instance.abi.length; i++) {
      var item = instance.abi[i];
      if (item.type == "function") {
        if (item.constant == true) {
          instance[item.name] = Utils.promisifyFunction(contract[item.name], constructor);
        } else {
          instance[item.name] = Utils.synchronizeFunction(contract[item.name], instance, constructor);
        }

        instance[item.name].call = Utils.promisifyFunction(contract[item.name].call, constructor);
        instance[item.name].sendTransaction = Utils.promisifyFunction(contract[item.name].sendTransaction, constructor);
        instance[item.name].request = contract[item.name].request;
        instance[item.name].estimateGas = Utils.promisifyFunction(contract[item.name].estimateGas, constructor);
      }

      if (item.type == "event") {
        instance[item.name] = contract[item.name];
      }
    }

    instance.allEvents = contract.allEvents;
    instance.address = contract.address;
    instance.transactionHash = contract.transactionHash;
  };

  // Use inheritance to create a clone of this contract,
  // and copy over contract's static functions.
  function mutate(fn) {
    var temp = function Clone() { return fn.apply(this, arguments); };

    Object.keys(fn).forEach(function(key) {
      temp[key] = fn[key];
    });

    temp.prototype = Object.create(fn.prototype);
    bootstrap(temp);
    return temp;
  };

  function bootstrap(fn) {
    fn.web3 = new Web3();
    fn.class_defaults  = fn.prototype.defaults || {};

    // Set the network iniitally to make default data available and re-use code.
    // Then remove the saved network id so the network will be auto-detected on first use.
    fn.setNetwork("default");
    fn.network_id = null;
    return fn;
  };

  // Accepts a contract object created with web3.eth.contract.
  // Optionally, if called without `new`, accepts a network_id and will
  // create a new version of the contract abstraction with that network_id set.
  function Contract() {
    if (this instanceof Contract) {
      instantiate(this, arguments[0]);
    } else {
      var C = mutate(Contract);
      var network_id = arguments.length > 0 ? arguments[0] : "default";
      C.setNetwork(network_id);
      return C;
    }
  };

  Contract.currentProvider = null;

  Contract.setProvider = function(provider) {
    var wrapped = new Provider(provider);
    this.web3.setProvider(wrapped);
    this.currentProvider = provider;
  };

  Contract.new = function() {
    if (this.currentProvider == null) {
      throw new Error("BasicSign error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("BasicSign error: contract binary not set. Can't deploy new instance.");
    }

    var regex = /__[^_]+_+/g;
    var unlinked_libraries = this.binary.match(regex);

    if (unlinked_libraries != null) {
      unlinked_libraries = unlinked_libraries.map(function(name) {
        // Remove underscores
        return name.replace(/_/g, "");
      }).sort().filter(function(name, index, arr) {
        // Remove duplicates
        if (index + 1 >= arr.length) {
          return true;
        }

        return name != arr[index + 1];
      }).join(", ");

      throw new Error("BasicSign contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of BasicSign: " + unlinked_libraries);
    }

    var self = this;

    return new Promise(function(accept, reject) {
      var contract_class = self.web3.eth.contract(self.abi);
      var tx_params = {};
      var last_arg = args[args.length - 1];

      // It's only tx_params if it's an object and not a BigNumber.
      if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
        tx_params = args.pop();
      }

      tx_params = Utils.merge(self.class_defaults, tx_params);

      if (tx_params.data == null) {
        tx_params.data = self.binary;
      }

      // web3 0.9.0 and above calls new twice this callback twice.
      // Why, I have no idea...
      var intermediary = function(err, web3_instance) {
        if (err != null) {
          reject(err);
          return;
        }

        if (err == null && web3_instance != null && web3_instance.address != null) {
          accept(new self(web3_instance));
        }
      };

      args.push(tx_params, intermediary);
      contract_class.new.apply(contract_class, args);
    });
  };

  Contract.at = function(address) {
    if (address == null || typeof address != "string" || address.length != 42) {
      throw new Error("Invalid address passed to BasicSign.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: BasicSign not deployed or address not set.");
    }

    return this.at(this.address);
  };

  Contract.defaults = function(class_defaults) {
    if (this.class_defaults == null) {
      this.class_defaults = {};
    }

    if (class_defaults == null) {
      class_defaults = {};
    }

    var self = this;
    Object.keys(class_defaults).forEach(function(key) {
      var value = class_defaults[key];
      self.class_defaults[key] = value;
    });

    return this.class_defaults;
  };

  Contract.extend = function() {
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0; i < arguments.length; i++) {
      var object = arguments[i];
      var keys = Object.keys(object);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = object[key];
        this.prototype[key] = value;
      }
    }
  };

  Contract.all_networks = {
  "default": {
    "abi": [
      {
        "constant": false,
        "inputs": [
          {
            "name": "nonce",
            "type": "string"
          }
        ],
        "name": "generateId",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "documents",
        "outputs": [
          {
            "name": "organizer",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "SimpleSign",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "docId",
            "type": "bytes32"
          },
          {
            "name": "signId",
            "type": "uint8"
          }
        ],
        "name": "getSignDetails",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "docId",
            "type": "bytes32"
          }
        ],
        "name": "addSignature",
        "outputs": [],
        "payable": true,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "docId",
            "type": "bytes32"
          }
        ],
        "name": "getDocumentDetails",
        "outputs": [
          {
            "name": "organizer",
            "type": "address"
          },
          {
            "name": "count",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "docId",
            "type": "bytes32"
          }
        ],
        "name": "getDocumentOrganizer",
        "outputs": [
          {
            "name": "organizer",
            "type": "address"
          },
          {
            "name": "count",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "docId",
            "type": "bytes32"
          },
          {
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "getDocumentSignature",
        "outputs": [
          {
            "name": "value",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "docId",
            "type": "bytes32"
          }
        ],
        "name": "removeDocument",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "dochash",
            "type": "bytes32"
          }
        ],
        "name": "createDocument",
        "outputs": [
          {
            "name": "docId",
            "type": "bytes32"
          }
        ],
        "payable": true,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "docId",
            "type": "bytes32"
          }
        ],
        "name": "getSignsCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "payable": false,
        "type": "fallback"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "id",
            "type": "bytes32"
          }
        ],
        "name": "Created",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "docId",
            "type": "bytes32"
          }
        ],
        "name": "Signed",
        "type": "event"
      }
    ],
    "unlinked_binary": "0x606060405234610000575b6105cc806100186000396000f36060604052361561008d5760e060020a600035046319a9c2f1811461009f5780632b2805db146101045780634ac7becf146101305780635598e5761461013f5780636dba48071461016e5780638e4d0f401461017b57806393d6e7de146101ae578063be96d7b3146101e1578063c350184814610210578063d7d5f5aa14610222578063f4ae17f51461023f575b346100005761009d5b610000565b565b005b34610000576100f2600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375094965061026195505050505050565b60408051918252519081900360200190f35b346100005761011460043561029e565b60408051600160a060020a039092168252519081900360200190f35b346100005761009d6102b9565b005b34610000576101146004356024356102d6565b60408051600160a060020a039092168252519081900360200190f35b61009d600435610321565b005b346100005761018b600435610403565b60408051600160a060020a03909316835260208301919091528051918290030190f35b346100005761018b60043561042e565b60408051600160a060020a03909316835260208301919091528051918290030190f35b3461000057610114600435602435610450565b60408051600160a060020a039092168252519081900360200190f35b346100005761009d600435610491565b005b6100f260043561051b565b60408051918252519081900360200190f35b34610000576100f26004356105b3565b60408051918252519081900360200190f35b600081604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050604051809103902090505b919050565b600160205260009081526040902054600160a060020a031681565b60008054600160a060020a031916606060020a338102041790555b565b60008281526001602081905260408220908101805483919060ff86169081101561000057906000526020600020900160005b508054600160a060020a0316935090505b505092915050565b60008181526001602081905260408220808201805492830180825591939290918281838015829011610382576000838152602090206103829181019083015b8082111561037e578054600160a060020a0319168155600101610360565b5090565b5b505050916000526020600020900160005b50604080516020808201835233918290528354600160a060020a031916606060020a808402041790935581518781529151939450600160a060020a0316927f6ce43e3def6c459ff915b7e85f0988330a741ef8b79e90dee95a8a976918672a929181900390910190a25b505050565b6000818152600160208190526040909120805491810154600160a060020a0390921691905b50915091565b60008181526001602052604081208054600160a060020a031691905b50915091565b600082815260016020819052604082209081018054849081101561000057906000526020600020900160005b5054600160a060020a031691505b5092915050565b6000818152600160205260409020805433600160a060020a039081169116146104b957610000565b600082815260016020818152604083208054600160a060020a03191681559182018054848255908452908320919291610512918101905b8082111561037e578054600160a060020a0319168155600101610360565b5090565b5b5050505b5050565b6000818152600160205260409020548190600160a060020a03161561053f57610000565b6000818152600160209081526040918290208054600160a060020a031916606060020a33808202919091049190911790915582518481529251600160a060020a03909116927fd24d824860e7f36c08df207d22094623f901c3a69631edd487e915e1fac5d41a92908290030190a25b919050565b600081815260016020819052604090912001545b91905056",
    "events": {
      "0x0ce3610e89a4bb9ec9359763f99110ed52a4abaea0b62028a1637e242ca2768b": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "Created",
        "type": "event"
      },
      "0x006409c471c01f75fa2c8509f25aae87aa4e1d13b3eda6dcf9cabd084c053265": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "docId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "singId",
            "type": "uint8"
          },
          {
            "indexed": false,
            "name": "signType",
            "type": "bytes16"
          },
          {
            "indexed": false,
            "name": "sign",
            "type": "bytes"
          }
        ],
        "name": "Signed",
        "type": "event"
      },
      "0x9c28008789aa17fb944ae340e80ac3294bbc82fa236c00737b67b32c8ccee213": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "docId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "singId",
            "type": "uint8"
          },
          {
            "indexed": false,
            "name": "signType",
            "type": "bytes16"
          }
        ],
        "name": "Signed",
        "type": "event"
      },
      "0xf4b7ab5b8fc49d6d35d323cae6a96e1441b461f862dfc5aff92e806e2839b5b0": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "docId",
            "type": "uint256"
          }
        ],
        "name": "Signed",
        "type": "event"
      },
      "0xd24d824860e7f36c08df207d22094623f901c3a69631edd487e915e1fac5d41a": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "id",
            "type": "bytes32"
          }
        ],
        "name": "Created",
        "type": "event"
      },
      "0x6ce43e3def6c459ff915b7e85f0988330a741ef8b79e90dee95a8a976918672a": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "docId",
            "type": "bytes32"
          }
        ],
        "name": "Signed",
        "type": "event"
      }
    },
    "updated_at": 1490326060794,
    "links": {},
    "address": "0x7aeddbf80b9f45e541cbf5085b86f4ab7e20246b"
  }
};

  Contract.checkNetwork = function(callback) {
    var self = this;

    if (this.network_id != null) {
      return callback();
    }

    this.web3.version.network(function(err, result) {
      if (err) return callback(err);

      var network_id = result.toString();

      // If we have the main network,
      if (network_id == "1") {
        var possible_ids = ["1", "live", "default"];

        for (var i = 0; i < possible_ids.length; i++) {
          var id = possible_ids[i];
          if (Contract.all_networks[id] != null) {
            network_id = id;
            break;
          }
        }
      }

      if (self.all_networks[network_id] == null) {
        return callback(new Error(self.name + " error: Can't find artifacts for network id '" + network_id + "'"));
      }

      self.setNetwork(network_id);
      callback();
    })
  };

  Contract.setNetwork = function(network_id) {
    var network = this.all_networks[network_id] || {};

    this.abi             = this.prototype.abi             = network.abi;
    this.unlinked_binary = this.prototype.unlinked_binary = network.unlinked_binary;
    this.address         = this.prototype.address         = network.address;
    this.updated_at      = this.prototype.updated_at      = network.updated_at;
    this.links           = this.prototype.links           = network.links || {};
    this.events          = this.prototype.events          = network.events || {};

    this.network_id = network_id;
  };

  Contract.networks = function() {
    return Object.keys(this.all_networks);
  };

  Contract.link = function(name, address) {
    if (typeof name == "function") {
      var contract = name;

      if (contract.address == null) {
        throw new Error("Cannot link contract without an address.");
      }

      Contract.link(contract.contract_name, contract.address);

      // Merge events so this contract knows about library's events
      Object.keys(contract.events).forEach(function(topic) {
        Contract.events[topic] = contract.events[topic];
      });

      return;
    }

    if (typeof name == "object") {
      var obj = name;
      Object.keys(obj).forEach(function(name) {
        var a = obj[name];
        Contract.link(name, a);
      });
      return;
    }

    Contract.links[name] = address;
  };

  Contract.contract_name   = Contract.prototype.contract_name   = "BasicSign";
  Contract.generated_with  = Contract.prototype.generated_with  = "3.2.0";

  // Allow people to opt-in to breaking changes now.
  Contract.next_gen = false;

  var properties = {
    binary: function() {
      var binary = Contract.unlinked_binary;

      Object.keys(Contract.links).forEach(function(library_name) {
        var library_address = Contract.links[library_name];
        var regex = new RegExp("__" + library_name + "_*", "g");

        binary = binary.replace(regex, library_address.replace("0x", ""));
      });

      return binary;
    }
  };

  Object.keys(properties).forEach(function(key) {
    var getter = properties[key];

    var definition = {};
    definition.enumerable = true;
    definition.configurable = false;
    definition.get = getter;

    Object.defineProperty(Contract, key, definition);
    Object.defineProperty(Contract.prototype, key, definition);
  });

  bootstrap(Contract);

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of this contract in the browser,
    // and we can use that.
    window.BasicSign = Contract;
  }
})();
