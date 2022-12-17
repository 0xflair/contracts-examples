import {
  Button,
  ConnectButton,
  ERC721Token,
  Errors,
  IfWalletConnected,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  Spinner,
  useERC721Balance,
  useNftTokensByWallet,
  useWalletContext,
  WalletDropdown,
} from '@flair-sdk/react';
import { useEffect, useState } from 'react';
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

  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);

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

      <main className="flex flex-col gap-4">
        <IfWalletConnected>
          <div className="flex justify-between">
            <span>Here are your NFTs:</span>
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
                tokenUri={nftToken.tokenUri}
                metadata={nftToken.metadata}
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
        </IfWalletConnected>
      </main>
    </div>
  );
}

export default App;
