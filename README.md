## Installation
To make the project functional, 3 components need to be installed:

a.	Truffle
Installation instructions:
https://truffle.readthedocs.io/en/latest/getting_started/installation/

b.	TestRPC
Installation instructions:
https://github.com/ethereumjs/testrpc

c.	Meteor
Installation instructions:
https://www.meteor.com/install

## Running

1. After installing testRPC, run the testrpc command on terminal.

```
testrpc
```

2.On another terminal, go to the “Truffle Part” directory.
Write the following on terminal:

```
truffle compile
truffle build
truffle migrate
truffle console
x = BasicSign.deployed()
JSON.stringify(x.abi)(Copy and paste the value somewhere. It’s the smart contract’s abi)
x.address(Copy and paste the value somewhere. It’s the smart contract’s address)
```

3. To run the code, open the code saved in BlockdocsApp directory, and modify all the occurrences of PCabi and PCaddress to the abit and the address you got earlier. (The occurrences are in the files located at  BlockdocsApp/imports/ui/pages)

4. Now, on a new terminal, go to the BlockdocsApp directory, and write
```
meteor
```


## Notes

To create an institutions account, make sure you change the powerofsign field in the signup.js code (BlockdocsApp/imports/ui/pages) to 1, then signup as an institution. This later needs to be changed to 0 to allow normal users to sign up.

Please note this is only a turnaround to manually adding institutions
