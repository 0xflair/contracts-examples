# Example: ERC721 Custom Sales Page using React

This example React app renders a minting widget for an ERC721 (A) NFT collection deployed via [Flair's dashboard](https://app.flair.dev).

The main difference between this example and [custom-tiered-sales](../custom-tiered-sales/) is this: Since we know this sales is for an ERC721 collection we can render a "Supply Counter" for the total and max supply of the collection.

##### Dependencies

- `flair-sdk`: latest
- `react`: v17.x or v18.x

## :fire: Quick Start

1. Create a new NFT collection using [Flair's dashboard](https://app.flair.dev). Note that you will be the full owner of smart contract.
2. Clone the examples repo, install dependencies in the `erc721-custom-tiered-sales` directory:

   ```sh
   git clone https://github.com/flair-sdk/examples

   cd examples/react/erc721-custom-tiered-sales

   npm install
   ```

3. Grab your contract address and chain ID, and update [.env](./.env):
   - Set `REACT_APP_CONTRACT_ADDRESS` to your deployed contract address you get from Flair's dashboard > Collections > your-collection > Deploy tab.
   - Set `REACT_APP_CONTRACT_CHAIN_ID` depending on the contract chain. Use `1` for Eth mainnet, `5` for Goerli testnet, `137` for Polygon mainnet, etc.

4. Run the react app in the `erc721-custom-tiered-sales` directory:

   ```sh
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

![Screenshot](./custom-minting-website.png)

## 🔮 Tutorial

To use this example within your app:

1. Install `@flair-sdk/react` in your React app:

   ```sh
   npm install @flair-sdk/react
   ```

2. Configure FlairProvider around your root App:

   ```ts
   import { FlairProvider } from "@flair-sdk/react";

   // ...
   <FlairProvider>
     <App />
   </FlairProvider>;
   // ...
   ```

3. Implement the minting widget depending on your preferred customizability:

   - If you need control over each element you can copy and customize the code within [App.tsx](./src/App.tsx).
   - To use a ready-made component for basic minting functionality you can use [TieredSalesMintingSection.tsx](https://github.com/flair-sdk/typescript/blob/main/packages/react/src/modules/finance/tiered-sales/sections/TieredSalesMintingSection.tsx) component (it has Mint count, Mint button, Statuses, and loading bar)

4. _(optional)_ If you're using Webpack 5 (e.g. React v17+) you need to manually configure Buffer for Coinbase wallet to work:

   1. Install `npm install react-app-rewired buffer`
   2. Then create a [config-overrides.js](config-overrides.js) to inject the Buffer.

5. Profit :rocket:

## Customizations

### How to customize Tier Selector element?

Check out [MyCustomTierSelector.tsx](./src/MyCustomTierSelector.tsx) example for a complete set of props you can use to:
* Decide if you want to show non-active tiers, or non-allowlisted tiers, or sold-out tiers.
* Show or hide the selector title and it's className.
* A custom loading element to show while the tiers are loading.
* Fully control how each tier element is rendered.
