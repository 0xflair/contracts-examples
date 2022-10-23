# Example: Mint NFTs from your backend (Typescript)

This example uses Flair SDK to mint new ERC-721 NFTs from your backend using meta transactions. In this approach you will configure a private key that has the "MINTER_ROLE" on your NFT contract.

##### Dependencies

* Node.js
* Typescript
* Express
* `@flair-sdk/metatx`
* An Ethereum-compatible wallet private key (either [via Javascript](https://www.quicknode.com/guides/web3-sdks/how-to-generate-a-new-ethereum-address-in-javascript) using [MetaMask](https://metamask.io/))

## :fire: Step by Step Tutorial

1. Create a new wallet (address and private key) that is dedicated for minting from your backend.
   * The private key of this wallet must be stored securely in your backend.
   * Your Node.js server will use it to sign the meta-transactions in backend and send the relay requests to Flair. 
   * Note that Flair cannot tamper with the request in anyway, it only handles the nonce and gas management complexity.

3. Create and deploy an **ERC-721** contract via [Flair's Contracts](https://app.flair.dev/diamonds/create) dashboard.
   1. Choose a **ERC-721** contract solution.
   2. Make sure all required configs are set (the yellow warnings), such as max supply, etc.
   3. Go to "Access" section under "Grant roles" paste the address of your minter wallet to grant the "MINTER_ROLE" role.
   4. Go to "Relayer" section and configure the trusted forwarder address as described. Flair's trusted forwarder source code is open and it only handles the standard ERC-2771 meta transaction relaying.
   5. Finally deploy the ERC-721 NFT contract to get the contract address.

4. Create your first relayer API client if not already done via [Flair's Relayer API](https://app.flair.dev/clients) dashboard.

5. Clone this repo and navigate to the example directory:

    ```bash
    git clone https://github.com/flair-sdk/examples

    cd examples/express/mint-erc721-with-metadata

    npm install
    ```

6. Copy `.env.dist` and create a new `.env` file:

    ```bash
    cp .env.dist .env
    ```

7. Put the correct values in `.env` file:
   * *FLAIR_CLIENT_ID*: copy from Step 4 above.
   * *CONTRACT_CHAIN_ID*: based on the chain you used to deploy the contract. `1` for Eth mainnet, `5` for Goerli testnet, `137` for Polygon mainnet, etc.
   * *CONTRACT_ADDRESS*: find the address of the deployed contract under "Deploy" section.
   * *MINTER_PRIVATE_KEY*: the private key of the new wallet you created for minting.

8.  Build the project to get javascript files based on typescript code:

    ```bash
    npm run build
    ```

9.  Start the test server:

    ```bash
    npm start
    ```

10. Open the test endpoint in your browser to mint the first NFT:

    * [http://localhost:8080/mint](http://localhost:8080/mint)

## Need help?

Our developers are happy to help you debug issues and problems, join our [Discord](https://discord.gg/flair) and drop a message.
