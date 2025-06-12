require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.28',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // sepolia: {
    //   url: "",
    //   accounts: [""],
    // },
    fantomTestnet: {
      url: 'https://rpc.testnet.fantom.network',
      accounts: [
        'f97c3f01c94c4a13f3aac632594dd6ad71ef93e406b6dab06179281f56a833f2',
      ], //otc
    },
    baseSepolia: {
      url: 'https://sepolia.base.org',
      accounts: [
        'acde21ef2b8611b0f0cdc8e6f4d7d855e74f614caa3795e4777b80df06176b2b',
      ], //gemHunter1
    },
  },
};
