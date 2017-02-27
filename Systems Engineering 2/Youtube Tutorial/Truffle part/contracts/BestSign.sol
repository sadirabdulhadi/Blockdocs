pragma solidity ^0.4.2;

contract BestSign {

	mapping (bytes32 => Document) public documents;

    event Print(bytes32 out);

    struct Document {
        address organizer;
        address[] signs;
    }

	function createDocument(string doc) payable returns (bytes32 docId) {
	        docId = generateId(doc);
	        if (documents[docId].organizer != 0) throw;
	        documents[docId].organizer = msg.sender;
	}

	function getDocumentOrganizer(bytes32 docId) returns (address organizer, uint count) {
        Document doc = documents[docId];
        organizer = doc.organizer;
    }

    function getDocumentSign(bytes32 docId) returns (uint count) {
        Document doc = documents[docId];
        count = doc.signs.length;
    }

    function generateId(string doc) payable areturns (bytes32 docID) {
        return sha3("habibi");
    }

}

ascent.atos.net/journey2020
risks
problems
colors
