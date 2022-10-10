import {
  ConnectButton,
  SwitchChainButton,
  IfWalletConnected,
  WalletDropdown,
  TieredSalesProvider,
  TieredSalesStatus,
  TieredSalesAllowlistStatus,
  TieredSalesPrice,
  TieredSalesMintInput,
  TieredSalesMintButton,
  TieredSalesIfWalletCanMint,
  TieredSalesEligibleAmount,
  TieredSalesWalletMints,
  TieredSalesMintStatusBar,
  TieredSalesSelector,
} from "@flair-sdk/react";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useState } from "react";
import { BigNumberish } from "ethers";

const chainId = Number(process.env.NEXT_PUBLIC_CONTRACT_CHAIN_ID);
const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string;

const Home: NextPage = () => {
  const { isConnected } = useAccount();

  const [mintCount, setMintCount] = useState<BigNumberish>("1");

  const mintButtonClass =
    "w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-center min-h-screen">
      <TieredSalesProvider
        chainId={Number(chainId)}
        contractAddress={contractAddress}
      >
        <main className="h-fit max-w-2xl min-w-xl mx-auto lg:max-w-5xl flex flex-col gap-8 items-center p-4">
          {/* Sales Title */}
          <div className="flex flex-col gap-4 items-center justify-between">
            <h2 className="font-bold text-2xl">My Amazing NFT</h2>
            <IfWalletConnected>
              <WalletDropdown />
            </IfWalletConnected>
          </div>

          <main className="flex flex-col gap-y-8">
            {/* Tier Selector */}
            {/* TODO Find a way to cleanly avoid hydration issue on Next.js SSR */}
            {/* <div className="flex gap-2 items-center justify-center">
              <TieredSalesSelector />
            </div> */}

            <div>
              {/* Sale Status and Price */}
              <div className="mt-4 flex gap-4 justify-between">
                <div className="flex flex-col flex-wrap sm:flex-row sm:items-center gap-4">
                  <TieredSalesStatus />

                  {isConnected && <TieredSalesAllowlistStatus />}
                </div>

                <TieredSalesPrice className="text-xl font-medium text-gray-900 whitespace-nowrap" />
              </div>
            </div>

            <div>
              <div>
                {/* Mint Count */}
                <div className="mt-8 mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-900">
                      How many to mint?
                    </h2>
                  </div>

                  <fieldset className="mt-4">
                    <legend className="sr-only">Choose number of mints</legend>
                    <div className="flex">
                      <TieredSalesMintInput
                        mintCount={mintCount}
                        setMintCount={setMintCount}
                        className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-75"
                      />
                    </div>
                  </fieldset>
                </div>

                {/* Mint Button */}
                <ConnectButton className={mintButtonClass}>
                  <div className="flex gap-3 items-center">
                    <SwitchChainButton
                      requiredChainId={Number(chainId)}
                      className={mintButtonClass}
                    >
                      <TieredSalesMintButton
                        mintCount={mintCount}
                        className={mintButtonClass}
                      />
                    </SwitchChainButton>
                  </div>
                </ConnectButton>

                {/* Maximum Eligible Amount */}
                <IfWalletConnected>
                  <small className="block font-light mt-2 text-xs">
                    <TieredSalesIfWalletCanMint>
                      You can mint up to{" "}
                      <TieredSalesEligibleAmount as="div" className="inline" />.{" "}
                    </TieredSalesIfWalletCanMint>
                    {isConnected ? (
                      <>
                        You have minted <TieredSalesWalletMints /> NFTs in this
                        tier.
                      </>
                    ) : null}
                  </small>
                </IfWalletConnected>
              </div>

              {/* Transaction Status Bar */}
              <TieredSalesMintStatusBar className="mt-4 flex flex-col gap-2" />
            </div>
          </main>
        </main>
      </TieredSalesProvider>

      {/* OR, import the whole prebuilt minting component:
      
      <TieredSalesProvider
        chainId={Number(chainId)}
        contractAddress={contractAddress}
      >
        <TieredSalesMintingSection />
      </TieredSalesProvider>

      */}
    </div>
  );
};

export default Home;
