const { Web3 } = require("web3");

async function main() {
  const web3 = new Web3(
    "wss://sepolia.infura.io/ws/v3/2Cs6ZZhxNa7SacQUwSV38of3XUE"
  );

  let options721 = {
    topics: [web3.utils.sha3("Transfer(address,address,uint256)")],
  };


  let subscription721 = await web3.eth.subscribe("logs", options721);

  subscription721.on("data", (event) => {
    if (event.topics.length == 4) {
      let transaction = web3.eth.abi.decodeLog(
        [
          {
            type: "address",
            name: "from",
            indexed: true,
          },
          {
            type: "address",
            name: "to",
            indexed: true,
          },
          {
            type: "uint256",
            name: "tokenId",
            indexed: true,
          },
        ],
        event.data,
        [event.topics[1], event.topics[2], event.topics[3]]
      );

      if (transaction.from == "0x45d4ec5c687A7fe1cE035353e0CBF086640f373E") {
        console.log("Specified address sent an NFT!");
      }
      if (transaction.to == "0x45d4ec5c687A7fe1cE035353e0CBF086640f373E") {
        console.log("Specified address received an NFT!");
      }
  

      console.log(
        `\n` +
          `New ERC-712 transaction found in block ${event.blockNumber} with hash ${event.transactionHash}\n` +
          `From: ${
            transaction.from === "0x0000000000000000000000000000000000000000"
              ? "New mint!"
              : transaction.from
          }\n` +
          `To: ${transaction.to}\n` +
          `Token contract: ${event.address}\n` +
          `Token ID: ${transaction.tokenId}`
      );
    }
  });


  subscription721.on("error", (err) => {
    throw err;
  });
  subscription1155.on("error", (err) => {
    throw err;
  });

  subscription721.on("connected", (nr) =>
    console.log("Subscription on ERC-721 started with ID %s", nr)
  );
  subscription1155.on("connected", (nr) =>
    console.log("Subscription on ERC-1155 started with ID %s", nr)
  );
}

main();