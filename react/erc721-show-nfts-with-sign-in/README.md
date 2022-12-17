# Example: Sign-in and Show ERC721 NFTs

This example React app renders a connect button, allows the user to sign-in (to prove actual ownership of a wallet) and then shows a list of their NFTs.

##### Dependencies

- `flair-sdk`: latest
- `react`: v17.x or v18.x

## :fire: Quick Start

1. Clone the examples repo, install dependencies in the `sign-in-and-show-nfts` directory:

   ```sh
   git clone https://github.com/flair-sdk/examples

   cd examples/react/sign-in-and-show-nfts

   npm install
   ```

2. Run the react app in the `sign-in-and-show-nfts` directory:

   ```sh
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

![Screenshot](./docs/screenshot.png)

## 🔮 Tutorial

To use this example within your app:

1.  Install `@flair-sdk/react` in your React app:

    ```sh
    npm install @flair-sdk/react
    ```

2.  Configure FlairProvider around your root App:

    ```ts
    import { FlairProvider } from "@flair-sdk/react";

    // ...
    <FlairProvider>
      <App />
    </FlairProvider>;
    // ...
    ```

3.  _(optional)_ If you're using Webpack 5 (e.g. React v17+) you might to manually configure Buffer for Coinbase wallet to work:

    1. Install `npm install react-app-rewired buffer`
    2. Then create a [config-overrides.js](config-overrides.js) to inject the Buffer.

4.  Add `<ConnectButton>` and `<SignInButton>` components in your dApp.

    ```ts
    import {
      ConnectButton,
      IfWalletConnected,
      SignInButton,
      WalletDropdown,
    } from "@flair-sdk/react";

    const App = () => {
      return (
        <div>
          {/* Render a simple connect button: */}
          Hi! You can connect here: <ConnectButton />
          
          {/* If user is connected render a dropdown: */}
          <IfWalletConnected>
            <WalletDropdown />
          </IfWalletConnected>
          
          {/* If user is connected show a sign button: */}
          <IfWalletConnected>
            <SignInButton />
          </IfWalletConnected>

          {/* If user is signed-in show list of their NFTs: */}
          <IfWalletSignedIn>
            <MyCustomNFTListComponent />
          </IfWalletSignedIn>
        </div>
      );
    };
    ```

5.  Get connected wallet NFTs from `useNftTokensByWallet()` hook:

    ```ts
    const account = useAccount();

    const {
      data: nftTokens,
      error: nftTokensError,
      isLoading: nftTokensLoading,
      sendRequest: refreshNftTokens,
    } = useNftTokensByWallet({
      env,
      chainId: 1, // Chain ID (1 for Ethereum Mainnet, 5 for Goerli, 137 for Polygon, etc.)
      contractAddress: "0x....NFT_CONTRACT_ADDRESS.....",
      walletAddress: account.address,
      enabled: Boolean(account.address),
    });
    ```

6.  Show metadata of a specific ERC721 NFT token using `ERC721Token` component:

    ```tsx
    <div>
      {nftTokens?.map((nftToken) => (
        <ERC721Token
          chainId={YOUR_CONTRACT_CHAIN_ID_HERE}
          contractAddress={nftToken.contractAddress}
          tokenId={nftToken.tokenId}
          tokenUri={nftToken.tokenUri}
          metadata={nftToken.metadata}
        />
      ))}
    </div>
    ```

7.  Send a selected `tokenId` along with `walletAddress`, `signatureHex` and `signatureMessage` to your backend to verify the signature and do any logic on your backend for that NFT and wallet:

    ```ts
    import { useAccount } from "wagmi";
    import { useSignInMessage } from "@flair-sdk/react";

    const account = useAccount();
    const { data: { signatureHex, signatureMessage } } = useSignInMessage();

    const [tokenId, setTokenId] = useState<string>();

    const payload = useMemo(() => {
      return {
        walletAddress: account.address,
        signatureHex,
        signatureMessage,
        tokenId,
    });

    // Send payload to your backend with useCallback or any other means...
    ```

8.  You can use [`/v1/util/siwe/verify` utility endpoint](https://api.flair.dev/swagger/#/Util/UtilController_siweVerify) to verify the signature on your backend:

    ```ts
    import axios from 'axios';

    const verifySignature = async (payload: any) => {
      const { data } = await axios.post('/v1/util/siwe/verify', {
        "signatureHex": "0xc5f30a1b7b9a036f8e92b8f4105129bdc29520c6d22f04a1c9e474b47a2c5ead35f2027143eb932cde364f9cc9259fe268afa94f947ce31e8082180a55120fe01b",
        "signatureMessage": "my-domain.com wants you to sign in with your Ethereum account....",
        "allowedAddress": "0x264D6BF791f6Be6F001A95e895AE0a904732d473",
        "allowedUris": [
          "https://my-domain.com"
        ]
      });
      
      // Any 2xx response means the signature is valid.
      return data;
    }
    ```

9.  Profit :rocket:
