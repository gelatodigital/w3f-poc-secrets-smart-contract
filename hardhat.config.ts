import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
// import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PK!;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc.testnet.fluence.dev", // Fluence testnet RPC URL
        // blockNumber: 1234567, // Optional: the block number you want to fork from
      },
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/apiKey",
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    arbitrumSepolia: {
      url: "https://arb-sepolia.g.alchemy.com/v2/apiKey",
      accounts: [PRIVATE_KEY],
      chainId: 421614,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: "XXX",
      arbitrumSepolia: "XXX",
    },
    customChains: [
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
    ],
  },
};

export default config;
