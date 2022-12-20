import {
  Badge,
  Button,
  ConnectButton,
  ERC721Token,
  Errors,
  IfWalletConnected,
  IfWalletNotSignedIn,
  IfWalletSignedIn,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  SignInButton,
  SignOutButton,
  Spinner,
  useERC721Balance,
  useNftTokensByWallet,
  useSignInContext,
  useWalletContext,
  WalletDropdown,
} from '@flair-sdk/react';
import { useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';

import { MyCustomNFTView } from './components/MyCustomNFTView';

const chainId = Number(process.env.REACT_APP_CONTRACT_CHAIN_ID);
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS as `0x${string}`;

function App() {
  const { setPreferredChainId, setAllowedNetworks } = useWalletContext();

  useEffect(() => {
    setPreferredChainId(Number(chainId));
    setAllowedNetworks([Number(chainId)]);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const account = useAccount();
  const {
    data: { signatureHex, signatureMessage },
  } = useSignInContext();

  const {
    data: nftTokens,
    error: nftTokensError,
    isLoading: nftTokensLoading,
    sendRequest: refreshNftTokens,
  } = useNftTokensByWallet({
    chainId,
    contractAddress,
    walletAddress: account.address,
    enabled: Boolean(account.address),
  });

  const {
    data: nftBalance,
    error: nftBalanceError,
    isLoading: nftBalanceLoading,
    refetch: refreshNftBalance,
  } = useERC721Balance({
    chainId,
    contractAddress,
    walletAddress: account.address,
    enabled: Boolean(account.address),
  });

  const sendFirstNFTAndSignature = useCallback(async () => {
    if (!nftTokens || !nftTokens.length) {
      return;
    }

    const firstNftToken = nftTokens[0].tokenId;
    const requestPayload = {
      // Any payload related to your logic:
      nftTokenId: firstNftToken,

      // Wallet address, signature hash, and signature message used for verification:
      walletAddress: account.address,
      signatureHex,
      signatureMessage,
    };

    alert(
      `Sending request payload for example: ${JSON.stringify(
        requestPayload,
        null,
        2,
      )}`,
    );
  }, [account.address, nftTokens, signatureHex, signatureMessage]);

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
      <header className="flex flex-col gap-3 text-center">
        <p>Welcome! Sign-in to see your NFTs!</p>
        <div>
          {/* Render a simple connect button: */}
          <ConnectButton className={PRIMARY_BUTTON} />
          {/* If user is connected render a dropdown: */}
          <IfWalletConnected>
            <WalletDropdown />
          </IfWalletConnected>
        </div>
      </header>

      <IfWalletConnected>
        <main className="flex flex-col gap-4">
          <IfWalletNotSignedIn>
            <Badge
              color="yellow"
              text="Your wallet is connected, BUT you need to sign-in to prove
          ownership, then you will see your NFTs."
            />
          </IfWalletNotSignedIn>
          <div className="flex flex-col gap-2 items-center justify-center">
            <SignInButton
              className={PRIMARY_BUTTON}
              label="Sign-in to see your NFTs"
            >
              <span>OK, you're now signed in!</span>
              <SignOutButton
                className={SECONDARY_BUTTON}
                label="Sign-out now"
              />
            </SignInButton>
          </div>
          <IfWalletSignedIn>
            <div className="flex justify-between">
              <span>Here are your NFTs ({nftBalance?.toString()} total):</span>
              <Button
                className={SECONDARY_BUTTON}
                text={'Refresh'}
                onClick={() => refreshNftTokens()}
                disabled={nftTokensLoading}
              />
            </div>
            <div className="flex justify-between">
              {nftTokensLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner /> Loading...
                </div>
              ) : null}
              {nftTokensError ? <Errors error={nftTokensError} /> : null}
            </div>
            <div className="flex gap-4 flex-wrap">
              {nftTokens?.map((nftToken) => (
                <ERC721Token
                  chainId={chainId}
                  contractAddress={contractAddress}
                  tokenId={nftToken.tokenId}
                >
                  {({
                    tokenId,
                    tokenUri,
                    tokenUriError,
                    tokenUriLoading,
                    metadata,
                    metadataError,
                    metadataLoading,
                  }) => (
                    <MyCustomNFTView
                      tokenId={tokenId}
                      tokenUri={tokenUri}
                      tokenUriError={tokenUriError}
                      tokenUriLoading={tokenUriLoading}
                      metadata={metadata}
                      metadataError={metadataError}
                      metadataLoading={metadataLoading}
                    />
                  )}
                </ERC721Token>
              ))}
            </div>
          </IfWalletSignedIn>
        </main>
      </IfWalletConnected>

      <IfWalletSignedIn>
        <Button
          text={'Send to backend'}
          onClick={() => sendFirstNFTAndSignature()}
        />
      </IfWalletSignedIn>
    </div>
  );
}

export default App;
