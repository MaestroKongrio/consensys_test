import React, { useState } from 'react';
import { ethers } from 'ethers'; 
import NFTCard from './components/nft';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface NFT {
  name: string;
  getApproved: string;
  tokenId: number;
  image: string;
  description: string;
}

function App() {

  const[wallet,setWallet]=useState("none")
  const[nftList,setNftList]=useState<NFT[]| null>(null);

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address= await signer.getAddress()
    console.log("Account:", address);
    setWallet(address)
    alert("Wallet connected")
  };

  const checkNFT = async()=>{
    try{
      const api_url="http://localhost:7001/get_nfts/"+wallet;
      console.log(api_url)
      const response = await fetch(api_url);
      const data = await response.json();
      console.log(data);
      setNftList(data); 
      console.log(nftList);
    } catch (error) {
      console.log("Error:",error)
    }
  }

  return (
    <div>
      <header className="App-header">NFT Lender Demo</header>
      <div>
        <button onClick={connectWallet}>Connect your Wallet</button> 
      </div>
      <div>
        Connected Wallet: {wallet}
      </div>
      <div>
        <button onClick={checkNFT}>Check for NFTs</button>
      </div>
      <div>
        <h3>NFTs Available for Lending</h3>
        {nftList === null ? (
          <p>No NFT available</p>
        ) : (
          nftList.map((nft) => (
            <NFTCard name={nft.name}
                    getApproved={nft.getApproved} tokenId={nft.tokenId} 
                    image={nft.image} description={nft.description}/>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
