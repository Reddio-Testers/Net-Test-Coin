require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.26",
  },
  networks: [
    {
      chainId: process.env.NETWORK_CHAINID,
      url: process.env.NETWORK_RPC,
      accounts: [process.env.NETWORK_PRIVATE_KEY]
    }
  ]
};
