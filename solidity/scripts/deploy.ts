import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
const { ethers } = require("hardhat");

const amount = 10000000;
const [owner, test_wallet_1,test_wallet_2] = await hre.ethers.getSigners();
      // deploy a lock contract where funds can be withdrawn
      // one year in the future
      const token = await hre.ethers.deployContract("DemoUSDC", [owner]);

      const balance = await token.balanceOf(owner);
      expect(Number(hre.ethers.formatEther(balance))).to.equal(amount);

      //deploy and mint nft
      const nft= await hre.ethers.deployContract("DemoNFT1",[owner]);
      await nft.safeMint(test_wallet_1,1);
      await nft.safeMint(test_wallet_1,2);

      //deploy and send money to lender contract 
      const lender= await hre.ethers.deployContract("DemoLender",[token.getAddress()]);
      await token.transfer(lender.getAddress(),amount);
      
      const lender_balance = await token.balanceOf(lender.getAddress());
      const quote = await lender.getQuote(nft.getAddress(),1);

      //Contract setup to test the operation
      await nft.connect(test_wallet_1).approve(lender.getAddress(),1);
      await lender.connect(test_wallet_1).LendMoney(nft.getAddress(),1);

      //NFT must be owned by lender
      const token_owner= await(nft.ownerOf(1));
      expect(await lender.getAddress()).to.equal(token_owner);

      //check for operation status
      const opHash= await lender.computeOperationHash(nft.getAddress(),1);

      const ops= await lender.operations(await test_wallet_1.getAddress(),opHash);
      const loan_balance = await token.balanceOf(test_wallet_1);
      //current nft owner balance must be equal to the quote
    
      expect(loan_balance).to.equals(10);
      expect(await token.balanceOf(lender.getAddress())).to.equals(10000000-10);

      //return the lended money
      await token.connect(test_wallet_1).approve(lender.getAddress(),loan_balance);
      await lender.connect(test_wallet_1).retrieveMoney(await nft.getAddress(),1);

      //we check that the money is back to the lender contract, and the nft is back to the original owner
      expect(await token.balanceOf(lender.getAddress())).to.equals(10000000);
      expect(await nft.ownerOf(1)).to.equals(test_wallet_1)