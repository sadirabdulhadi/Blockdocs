pragma solidity ^0.4.6;

 contract HelloWorld{
    
     mapping (address=> uint) balances;
     address public owner;

     function HelloWorld(){
         owner = msg.sender; //takes the address of the person who's sending the transaction
         balances[owner] = 1000;
     }

     function transfer(address _to, uint _value) returns (bool success){
         if (balances[msg.sender]<_value){
             return false;
         }
         balances[msg.sender] -= _value;
         balances[_to] += _value;   
         return true;

     }

     function getBalance(address _user) constant returns (uint _balance){  //constant ya3ni the function doesnt change state of blockchain
         return balances[_user];
         //we cannot loop through a mapping
         //HOW DO ITERATE THROUGH VALUES?? SEE ACCOUNTS...

     }
 }

