const ArticleNFT = artifacts.require("ArticleNFT");

module.exports = function (deployer) {
  deployer.deploy(ArticleNFT);
};
