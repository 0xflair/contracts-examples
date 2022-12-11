import {
  ConnectButton,
  WalletDropdown,
  IfWalletConnected,
  DiamondProvider,
  TieredSalesProvider,
  TieredSalesSelector,
  CryptoValue,
  CryptoUnits,
  IfWalletNotConnected,
  Media,
  TieredSalesTotalMinted,
  TieredSalesMaxAllocation,
  DisconnectButton,
  PRIMARY_BUTTON,
  Spinner,
} from "@flair-sdk/react";

const chainId = Number(process.env.REACT_APP_CONTRACT_CHAIN_ID);
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS as `0x${string}`;

/* 
  IMPORTANT!
  
  NOTE That this is only a demo for "Tier Selector" element,
  other elements (like mint button) are intentionally not included,
  check App.tsx for full example.
*/
function AppCustomTierSelector() {
  return (
    <div className="flex flex-col p-6 gap-6 items-center justify-center min-h-screen">
      <DiamondProvider
        chainId={Number(chainId)}
        contractAddress={contractAddress}
      >
        <TieredSalesProvider
          chainId={Number(chainId)}
          contractAddress={contractAddress}
        >
          <ConnectButton className={PRIMARY_BUTTON}>
            <WalletDropdown />
            <DisconnectButton />
          </ConnectButton>
          {/*
           This is an example of how to customize the tier selector to be fully controlled by you:
          */}
          <TieredSalesSelector
            // Even if there's 1 tier show this selector element:
            alwaysShowTierSelector={true}
            
            // Show all tiers no matter if they're active, sold out or wallet is not eligible:
            hideNotActiveTiers={false}
            hideNotEligibleTiers={false}
            hideSoldOutTiers={false}
            
            // Don't show a title element:
            title={false}
            
            // Don't wrap tier elements with a parent element:
            wrapper={true}
            wrapperClassName="grid grid-cols-3 gap-4"
            
            // Show a simple loading element:
            loadingElement={
              <div className="flex items-center gap-2">
                <Spinner className="w-4 h-4" />
                <span>Loading all the goodies...</span>
              </div>
            }

            // Customize each tier element:
            optionElement={({
              active,
              checked,
              currencySymbol,
              tierConfig,
              tierId,
              tokenMetadata,
              tokenMetadataLoading,
            }) => (
              <ul className="list-disc list-outside pl-6 w-full border border-indigo-300 rounded-lg">
                <li className="list-item">
                  Tier ID = <b>{tierId.toString()}</b>
                </li>

                <li className="list-item">
                  Is sale active for this tier ={" "}
                  <b>{tierConfig.isActive ? "Yes" : "No"}</b>
                </li>

                <li className="list-item">
                  Is this tier currently selected ={" "}
                  <b className={checked ? "text-indigo-500" : ""}>{checked ? "Yes" : "No"}</b>
                </li>

                <li className="list-item">
                  Tier price in formatted amount ={" "}
                  <b>
                    {tierConfig?.price?.toString() ? (
                      <CryptoValue
                        symbol={currencySymbol}
                        value={tierConfig.price?.toString()}
                        unit={CryptoUnits.WEI}
                        showPrice={false}
                        showSymbol={true}
                      />
                    ) : null}
                  </b>
                </li>

                <li className="list-item">
                  Currency symbol = <b>{currencySymbol?.toString()}</b>
                </li>

                <li className="list-item">
                  Is current wallet eligible for tier? ={" "}
                  <b>
                    <IfWalletConnected>
                      {tierConfig.isEligible === undefined
                        ? "..."
                        : tierConfig.isEligible
                        ? "Yes"
                        : "No"}
                    </IfWalletConnected>
                    <IfWalletNotConnected>
                      Please connect first!
                    </IfWalletNotConnected>
                  </b>
                </li>

                <li className="list-item">
                  Is current wallet eligible for tier? ={" "}
                  <b>
                    <IfWalletConnected>
                      {tierConfig.isEligible === undefined
                        ? "..."
                        : tierConfig.isEligible
                        ? "Yes"
                        : "No"}
                    </IfWalletConnected>
                    <IfWalletNotConnected>
                      Please connect first!
                    </IfWalletNotConnected>
                  </b>
                </li>

                <li className="list-item">
                  Is current wallet allowlisted for tier? ={" "}
                  <b>
                    <IfWalletConnected>
                      {tierConfig.isAllowlisted === undefined
                        ? "..."
                        : tierConfig.isAllowlisted
                        ? "Yes"
                        : "No"}
                    </IfWalletConnected>
                    <IfWalletNotConnected>
                      Please connect first!
                    </IfWalletNotConnected>
                  </b>
                </li>

                <li className="list-item">
                  Tier image ={" "}
                  <b>
                    {tokenMetadataLoading ? (
                      "Loading..."
                    ) : tokenMetadata?.image ? (
                      <Media uri={tokenMetadata.image} className="h-8 w-8" />
                    ) : (
                      <i>No image</i>
                    )}
                  </b>
                </li>

                <li className="list-item">
                  Tier name = <b>{tokenMetadata?.name || "No title set"}</b>
                </li>

                <li className="list-item">
                  Tier total max allocation ={" "}
                  <TieredSalesMaxAllocation tierId={Number(tierId)} />
                </li>

                <li className="list-item">
                  Tier total minted ={" "}
                  <TieredSalesTotalMinted tierId={Number(tierId)} />
                </li>
              </ul>
            )}
          />
        </TieredSalesProvider>
      </DiamondProvider>
    </div>
  );
}

export default AppCustomTierSelector;
