/// This file is auto-generated by Scribble and shouldn't be edited directly.
/// Use --disarm prior to make any changes.
/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract DemoLender is IERC721Receiver {
    struct Operation {
        address nftAddress;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    ERC20 public paymentToken;
    mapping(address => mapping(bytes32 => Operation)) public operations;

    constructor(address _paymentToken) {
        paymentToken = ERC20(_paymentToken);
    }

    function LendMoney(address nft, uint256 tokenId) public {
        ERC721 nftContract = ERC721(nft);
        require(nftContract.getApproved(tokenId) == address(this), "NFT not approved for transaction");
        uint256 priceToPay = getQuote(nft, tokenId);
        require(paymentToken.balanceOf(address(this)) >= priceToPay, "Insufficient Liquidity to Pay");
        address payTo = nftContract.ownerOf(tokenId);
        Operation memory newOp = Operation(nft, tokenId, priceToPay, true);
        operations[payTo][computeOperationHash(nft, tokenId)] = newOp;
        nftContract.safeTransferFrom(payTo, address(this), tokenId);
        paymentToken.transfer(payTo, priceToPay);
    }

    function retrieveMoney(address nft, uint256 tokenId) public {
        _original_DemoLender_retrieveMoney(nft, tokenId);
        unchecked {
            if (!(operations[msg.sender][computeOperationHash(nft, tokenId)].active)) {
                emit __ScribbleUtilsLib__301.AssertionFailedData(0, abi.encode(nft, tokenId));
                emit __ScribbleUtilsLib__301.AssertionFailed("001763:0094:000 0: Must create a new operation");
            }
        }
    }

    function _original_DemoLender_retrieveMoney(address nft, uint256 tokenId) internal {
        bytes32 opHash = computeOperationHash(nft, tokenId);
        Operation memory op = operations[msg.sender][opHash];
        require(op.active, "No active operation found");
        ERC721 nftContract = ERC721(nft);
        require(nftContract.ownerOf(tokenId) == address(this), "Contract does not own the NFT");
        require(paymentToken.allowance(msg.sender, address(this)) >= op.price, "No allowance to pay for lend");
        op.active = false;
        paymentToken.transferFrom(msg.sender, address(this), op.price);
        nftContract.safeTransferFrom(address(this), msg.sender, op.tokenId);
    }

    function getQuote(address nft, uint tokenId) public view returns (uint256) {
        ERC721 nftContract = ERC721(nft);
        require(nftContract.ownerOf(tokenId) != address(0), "NFT not minted");
        return 10;
    }

    function computeOperationHash(address nft, uint256 tokenId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(nft, tokenId));
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}

library __ScribbleUtilsLib__301 {
    event AssertionFailed(string message);

    event AssertionFailedData(int eventId, bytes encodingData);

    function assertionFailed(string memory arg_0) internal {
        emit AssertionFailed(arg_0);
    }

    function assertionFailedData(int arg_0, bytes memory arg_1) internal {
        emit AssertionFailedData(arg_0, arg_1);
    }

    function isInContract() internal returns (bool res) {
        assembly {
            res := sload(0x5f0b92cf9616afdee4f4136f66393f1343b027f01be893fa569eb2e2b667a40c)
        }
    }

    function setInContract(bool v) internal {
        assembly {
            sstore(0x5f0b92cf9616afdee4f4136f66393f1343b027f01be893fa569eb2e2b667a40c, v)
        }
    }
}