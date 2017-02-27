  pragma solidity ^0.4.2;

contract People{
    Person[] public people;

    struct Person{
        bytes32 FirstName;
        bytes32 LastName;
        uint Age;
    }

    function addPerson(bytes32 _firstName, bytes32 _lastName, uint _age) returns (bool success){
        Person memory newPerson;
        newPerson.FirstName = _firstName;
        newPerson.LastName = _lastName;
        newPerson.Age = _age;

        people.push(newPerson);
        return true;
    }

    function getPeople() constant returns (bytes32[],bytes32[],uint[]) {
        uint length = people.length;

        bytes32[] memory firstNames = new bytes32[](length);
        bytes32[] memory lastNames = new bytes32[](length);
        uint[] memory ages = new uint[](length);

        for (uint i = 0; i<length; i++){
            Person memory currentPerson;
            currentPerson = people[i];

            firstNames[i] = currentPerson.FirstName;
            lastNames[i] = currentPerson.LastName;
            ages[i] = currentPerson.Age; 

        }
        return(firstNames,lastNames,ages); 

        
    }

}