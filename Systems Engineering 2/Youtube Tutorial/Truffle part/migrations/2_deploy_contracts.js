module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.autolink();
  deployer.deploy(MetaCoin);
  deployer.deploy(People);
  deployer.deploy(BasicSign);
  deployer.deploy(BestSign);
};
