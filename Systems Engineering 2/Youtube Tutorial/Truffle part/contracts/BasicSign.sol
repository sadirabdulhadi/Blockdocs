//understanding smart contracts

pragma solidity ^0.4.2;
//here we define a contract
contract BasicSign {

    event Created(
        address indexed from, //ethereum address
        bytes32 id
    );
    event Signed(
        address indexed from, 
//The indexed parameters for logged events will allow you to search for these events using the indexed parameters as filters.
        bytes32 docId
        //uint8 singId, //256 bit unsigned integer
        //bytes16 signType //up to 16 bytes signtype
        //bytes sign
    );

    address owner;
    mapping (bytes32 => Document) public documents;

    struct Document {
        address organizer;
        Sign[] signs;
    }

    struct Sign {
        address signer;
        //bytes16 signType;
        //bytes   sign;
    }

    function SimpleSign() {
        owner = msg.sender;
    }

    function createDocument(string nonce) payable returns (bytes32 docId) {
        docId = generateId(nonce);
        if (documents[docId].organizer != 0) throw;
        documents[docId].organizer = msg.sender;
        Created(msg.sender, docId);
    }

    function removeDocument(bytes32 docId) {
        Document doc = documents[docId];
        if (doc.organizer != msg.sender) throw;
        delete documents[docId];
    }

    function addSignature(bytes32 docId) payable{// bytes _sign
        Document doc = documents[docId];
        //if (doc.organizer != msg.sender) throw;
        //if (doc.signs.length >= 0xFF) throw;
        uint idx = doc.signs.push(Sign(msg.sender));
        Signed(msg.sender, docId);
    }

    function getDocumentDetails(bytes32 docId) returns (address organizer, uint count) {
        Document doc = documents[docId];
        organizer = doc.organizer;
        count = doc.signs.length;
    }

    function getDocumentSignature(bytes32 docId, uint256 index) returns (address value) {
        Document doc = documents[docId];
        value = doc.signs[index].signer;
    }

    function getDocumentOrganizer(bytes32 docId) returns (address organizer, uint count) {
        Document doc = documents[docId];
        organizer = doc.organizer;
    }

    function getSignsCount(bytes32 docId) returns (uint) {
        return documents[docId].signs.length;
    }

    function getSignDetails(bytes32 docId, uint8 signId) returns (address) {
        Document doc = documents[docId];
        Sign s = doc.signs[signId];
        return (s.signer)
    }

    // function getSignData(uint256 docId, uint8 signId) returns (bytes) {
    //     Document doc = documents[docId];
    //     Sign s = doc.signs[signId];
    //     return s.sign;
    // }

    function generateId(string nonce) returns (bytes32) {
        //return uint256(sha3(msg.sender, nonce));
        return sha3(nonce);
    }

    function () {
        throw;
    }

}


