const CodetributeToken = artifacts.require("CodetributeToken");

module.exports = function(deployer) {
  deployer.deploy(CodetributeToken, 1000000);
};
