import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "@nomicfoundation/hardhat-ignition-ethers";
import 'hardhat-deploy';

const config: HardhatUserConfig = {
  solidity: "0.8.24",
};

export default config;
