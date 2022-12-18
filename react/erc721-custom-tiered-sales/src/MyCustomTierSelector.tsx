import {
  IfWalletConnected,
  TieredSalesSelector,
  CryptoValue,
  CryptoUnits,
  IfWalletNotConnected,
  Media,
  TieredSalesTotalMinted,
  TieredSalesMaxAllocation,
  Spinner,
} from "@flair-sdk/react";

function MyCustomTierSelector() {
  return (
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
      wrapper={false}
      wrapperClassName=""
      
      // Show a simple loading element:
      loadingElement={
        <div className="flex items-center gap-2">
          <Spinner className="w-4 h-4" />
          <span>Loading all the goodies...</span>
        </div>
      }
      
      // Customize each tier element:
      optionClassName=""
      optionElement={({
        active,
        checked,
        currencySymbol,
        tierConfig,
        tierId,
        tierMetadata,
        tierMetadataLoading,
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
            <b className={checked ? "text-indigo-500" : ""}>
              {checked ? "Yes" : "No"}
            </b>
          </li>

          <li className="list-item">
            Tier price in formatted amount ={" "}
            <b>
              {tierConfig?.price?.toString() ? (
                <CryptoValue
                  symbol={currencySymbol}
                  value={tierConfig.price?.toString()}
                  formatted={false}
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
              <IfWalletNotConnected>Please connect first!</IfWalletNotConnected>
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
              <IfWalletNotConnected>Please connect first!</IfWalletNotConnected>
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
              <IfWalletNotConnected>Please connect first!</IfWalletNotConnected>
            </b>
          </li>

          <li className="list-item">
            Tier image ={" "}
            <b>
              {tierMetadataLoading ? (
                "Loading..."
              ) : tierMetadata?.image ? (
                <Media uri={tierMetadata.image} className="h-8 w-8" preferManagedGateway={true} />
              ) : (
                <i>No image</i>
              )}
            </b>
          </li>

          <li className="list-item">
            Tier name = <b>{tierMetadata?.name || "No title set"}</b>
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
  );
}

export default MyCustomTierSelector;
