module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.autolink();
  deployer.deploy(MetaCoin);
  //add this line
  deployer.deploy(ProofOfExistence1);
  deployer.deploy(ProofOfExistence2);
};
