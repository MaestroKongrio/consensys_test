import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import Moralis from 'moralis';
import cors from 'cors';
import { ethers } from "ethers";
import nftABI from './abi/DemoNFT1.json';
import tokenABI from './abi/DemoUSDC.json';
import lenderABI from './abi/DemoLender.json';
import axios from 'axios';

async function fetchTokenUriData(tokenUri: string) {
    try {
        const response = await axios.get(tokenUri);
        return response.data; // `data` contiene el cuerpo de la respuesta
    } catch (error) {
        console.error('Error fetching data: ', error);
        return null; // Maneja el error como prefieras
    }
}

dotenv.config();


const app: Express = express();
const port = process.env.PORT || 3000;
const sepolia_provider=  new ethers.InfuraProvider("sepolia",process.env.INFURA_KEY)
const lender_contract_address=process.env.LENDER_CONTRACT_ADDRESS
app.use(cors({
  origin: '*', // Permite solo solicitudes de este origen
  methods: ['GET', 'POST'] // Permite solo estos métodos
}));

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY // Usa una variable de entorno para la API Key
});

app.get("/get_nfts/:wallet", async (req: Request, res: Response) => {
  const {wallet} = req.params;
  try {  
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      "chain": "0xaa36a7",
      "format": "decimal",
      "excludeSpam": true,
      "mediaItems": false,
      "address": wallet
    });

    const nfts = response.raw.result;
    const detailsPromises = nfts.map(nft => 
      getNFTDetails(nft.token_address, nft.token_id, sepolia_provider, nftABI)
    );
    const details = await Promise.all(detailsPromises);
    res.json(details);
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"Error getting NFTs"})
  }
});

async function getNFTDetails(address: string, tokenId: string, provider: ethers.Provider, abi: any) {
  const nftContract = new ethers.Contract(address, abi, provider);
  const tokenUri = await nftContract.tokenURI(tokenId);
  const tokenOwner = await nftContract.ownerOf(tokenId);
  const approved = await nftContract.getApproved(tokenId);
  const getApproved= (approved==lender_contract_address);
  const metadata = await fetchTokenUriData(tokenUri);
  const name= metadata.name
  const image= metadata.image
  const description= metadata.description
  return {
    tokenUri,
    tokenOwner,
    getApproved,
    name,
    image,
    description  
  };
}

app.get("/nft/:address/:token_id", async (req: Request, res: Response) => {
  const { address, token_id } = req.params;

  try {
    const nftDetails = await getNFTDetails(address, token_id, sepolia_provider, nftABI);
    res.json({
      "tokenUri": nftDetails.tokenUri,
      "tokenOwner": nftDetails.tokenOwner,
      "getApproved": nftDetails.getApproved,
      "image": nftDetails.image,
      "name": nftDetails.name,
      "description": nftDetails.description
    });
  } catch (error) {
    console.error('Error fetching NFT details: ', error);
    res.status(500).json({ error: "Error getting NFT details" });
  }
});

app.get("/lender/balance", async (req: Request, res: Response) => {

  const tokenContract = new ethers.Contract("0x69467b5C79AC1786197de8311Aa94b92a6fe192e", tokenABI, sepolia_provider);

  const balance= await tokenContract.balanceOf(lender_contract_address);
  const parsedBalance= ethers.formatEther(balance)
  res.json({"lender_balance": parsedBalance})
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});



