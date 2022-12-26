import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import asyncHandler from "express-async-handler";

dotenv.config();

/**
 * 1) Import required libraries:
 *
 *  - "ethers" helps us create a Wallet object based on a private key, which helps us sign transactions.
 *  - "flair-sdk" provides a contract object with ability to submit meta transactions.
 */
import { Wallet } from "ethers";

import { StandardError } from "@flair-sdk/common";
import {
  ERC721MintableRoleBasedERC2771__factory,
  ContractsManifests,
} from "@flair-sdk/contracts";
import { IpfsClient } from "@flair-sdk/ipfs";
import { augmentContractWithMetaTransactions } from "@flair-sdk/metatx";

/**
 * 2) Load configurations from environment variables (or any config management you use):
 *
 *  - "chainId" is the numeric ID of the chain where your NFT contract is deployed (1 for Ethereum, 4 for Rinkeby Testnet, 137 for Polygon).
 *  - "flairClientId" unique client ID of your Flair account, used for billing purposes.
 *  - "signer" is created based on private key of the minter wallet, used to sign NFT minting meta transactions.
 *  - "nftCollectionAddress" contract address for your deployed NFT collection on the blockchain.
 */
const chainId = Number(process.env.CONTRACT_CHAIN_ID);
const flairClientId = process.env.FLAIR_CLIENT_ID as string;
const signer = new Wallet(process.env.MINTER_PRIVATE_KEY as string);
const forwarderAddress =
  process.env.FORWARDER_ADDRESS ||
  ContractsManifests["flair-sdk:common/UnorderedForwarder"].address[
    chainId.toString()
  ];
const contractAddress = process.env.CONTRACT_ADDRESS as string;

/**
 * 3) Create client instance for the ethers.js-compatible contract augmented with meta transactions.
 */
const mintableContract = augmentContractWithMetaTransactions({
  chainId,
  flairClientId,
  contract: ERC721MintableRoleBasedERC2771__factory.connect(
    contractAddress,
    signer
  ),
  forwarder: forwarderAddress,
});

const ipfsClient = new IpfsClient({
  flairClientId: flairClientId,
});

/**
 * 4) Example endpoints:
 *
 *  - "GET /mint" endpoint simply uploads a new metadata to IPFS and mints a new 1-of-1 NFT based on that metadata.
 */
const app: Express = express();

app.get(
  "/mint",
  asyncHandler(async (req: Request, res: Response) => {
    //
    // A) "to" is the wallet address that receives the new NFT
    //
    const to = "0x8016f96b5cCC4663324E8D117c337BB7aA68d909";

    //
    // B) "count" is the number of NFTs to send to this wallet
    //
    const count = 1;

    //
    // C) Uploading a new metadata to IPFS
    //
    const someRandomId = Math.floor(Math.random() * 10000000000);
    /** @type {import("flair-sdk").NftCollectionMetadata} */
    const nftMetadata = {
      name: `Angel #${someRandomId}`,
      image: `https://my-awesome-site.com/nft/${someRandomId}.png`,
      description: "This is the first NFT in the collection",
      external_link: `https://my-awesome-site.com/nft/${someRandomId}`,
    };
    const tokenOneIpfsHash = await ipfsClient.uploadJson(nftMetadata);

    //
    // D) "tokenURIs" an array with exact size of "count" of metadata URLs for the newly minted NFTs
    //
    const tokenURIs = [`ipfs://${tokenOneIpfsHash}`];

    console.log(``);
    console.log(`Minting ${count} NFTs to ${to}:`);
    console.log(` - TokenURI: ${tokenURIs[0]}`);

    try {
      //
      // E) Sign a meta transaction and submit it to the Flair backend relayer for processing
      //
      const data = await mintableContract.metaTransaction[
        "mintByRole(address,uint256,string[])"
      ](to, count, tokenURIs);

      console.log(` - Signature: ${data.signature}`);
      console.log(
        ` - Transaction is being processed and mined check your contract on EtherScan to see the status...`
      );
      console.log(``);

      // The response is a successfully submitted (but not yet mined) meta transaction.
      // Note that depending on traffic on the blockchain it might take a few minutes to be mined and processed.
      res.send({
        tokenURIs: tokenURIs,
        nftMetadata: nftMetadata,
        response: data,
      });
    } catch (e) {
      // All errors sent from meta transaction methods follow StandardError structure:
      res.status(500).send(e as StandardError);
    }
  })
);

const port = 8080;

app.listen(port, () => {
  console.log(``);
  console.log(`Flair SDK Example - Mint 1-of-1 NFTs via Meta Transactions!`);
  console.log(``);
  console.log(`- Listening on port ${port}`);
  console.log(`- Sending tx via forwarder: ${forwarderAddress}`);
  console.log(`   (Make sure it's same as your contract trusted forwarder)`);
  console.log(``);
  console.log(
    `Now you can mint NFTs by opening: http://localhost:${port}/mint`
  );
});