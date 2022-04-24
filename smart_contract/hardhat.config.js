//https://eth-ropsten.alchemyapi.io/v2/aq-1yHfYN67GA5sR4M-voEbGpfs0zek5


require('@nomiclabs/hardhat-waffle'); // a plugin to build  test smart contract 

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/aq-1yHfYN67GA5sR4M-voEbGpfs0zek5",
      accounts:
        ["dffc058aac4bbca773e4b85fffb61d27f9a5ee6b89d0bd1631c3b7e78ca506bc"],
    },
  },
};
