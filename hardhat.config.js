require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-truffle5");

const PRIVATE_KEY = `0xYOUR_PRIVATE_KEY`

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.23",
  networks: {
    local: {
      url: `http://127.0.0.1:7545`,
      accounts: [PRIVATE_KEY]
    },
    haqq_test: {
      url: `https://rpc.eth.testedge2.haqq.network`,
      accounts: [PRIVATE_KEY]
    }
  }
};