contract('BasicSign', function() {
it("should add a document", function() {
      var bs = BasicSign.deployed();
      return bs.createDocument("hihi").then(function() {
        var myEntry;
        return bs.getDocumentDetails.call("hihi").then(function(result) {
          console.log(result);
          assert.notEqual(result[0], 0x0000000000000000000000000000000000000000, result);
     });
    });
  });


it("should delete a document", function() {
      var bs = BasicSign.deployed();
      return bs.createDocument("aho").then(function() {
        bs.removeDocument("aho");
        var myEntry;
        return bs.getDocumentDetails.call("aho").then(function(result) {
          console.log(result);
          assert.equal(result[0], 0x0000000000000000000000000000000000000000, result);
     });
  });
});

it("same address when creating different documents", function() {
      var bs = BasicSign.deployed();
      return bs.createDocument("aho1").then(function() {
        return bs.createDocument("aho2").then(function() {
          return bs.getDocumentDetails.call("aho1").then(function(result1) {
            return bs.getDocumentDetails.call("aho2").then(function(result2) {;
            assert.equal(result1[0], result2[0], "yo");
          });
        });
      });
    });
});

it("document should be signed twice", function() {
  var bs = BasicSign.deployed();
  return bs.createDocument("hiho2").then(function() {
      return bs.getDocumentDetails.call("hiho2").then(function(result1) {
      bs.addSignature("hiho2");
      bs.addSignature("hiho2");
        return bs.getDocumentDetails.call("hiho2").then(function(result2) {
          assert.equal(result2[1].c - result1[1].c, 2 , "hey");
        });
      });
  });
});

it("document should be signed", function() {
  var bs = BasicSign.deployed();
  return bs.createDocument("hiho").then(function() {
      return bs.getDocumentDetails.call("hiho").then(function(result1) {
       bs.addSignature("hiho");
        return bs.getDocumentDetails.call("hiho").then(function(result2) {
          assert.equal(result2[1].c - result1[1].c, 1 , "hey");
        });
      });
  });
});

});
