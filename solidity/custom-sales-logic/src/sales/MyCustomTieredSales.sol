// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@flair-sdk/contracts/access/ownable/OwnableInternal.sol";
import "@flair-sdk/contracts/finance/sales/TieredSales.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // TODO replace with diamond version

import "../tokens/MyFirstToken.sol";
import "../tokens/MySecondToken.sol";

/**
 * @title My Custom Tiered Sales
 * @notice This is developed in-house to provide custom sales mechanism for our custom project.
 *
 * @custom:type eip-2535-facet
 * @custom:category NFTs
 * @custom:provides-interfaces ITieredSales
 */
contract MyCustomTieredSales is OwnableInternal, TieredSales, ReentrancyGuard {
    using TieredSalesStorage for TieredSalesStorage.Layout;

    /**
     * (1) Define state variables
     *
     * We must put all contract "state" variables in the Layout struct.
     * This storage pattern enables modularization using the EIP-2325 Diamond Standard.
     *
     * To learn more about this pattern, see the following resources:
     *  - https://eips.ethereum.org/EIPS/eip-2325
     *  - https://eip2535diamonds.substack.com
     */
    struct Layout {
        address targetTokenAddressFirst;
        address targetTokenAddressSecond;
    }

    bytes32 internal constant STORAGE_SLOT = keccak256("v1.my-amazing-team.contracts.storage.MyCustomTieredSales");

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }

    /**
     * (2) Define custom functions
     *
     * You can put privileged functions (using Ownable or role-based AccessControl) here.
     */
    function setTargetTokens(address firstToken, address secondToken) external onlyOwner {
        layout().targetTokenAddressFirst = firstToken;
        layout().targetTokenAddressSecond = secondToken;
    }

    /**
     * (3) Customize the "mintByTier" method.
     *
     * This custom facet contract extends TieredSales, which needs us to define what sales logic we want
     * when users are minting a specific tier.
     */
    function mintByTier(
        uint256 tierId,
        uint256 count,
        uint256 maxAllowance,
        bytes32[] calldata proof
    ) external payable override nonReentrant {
        // This call checks if user has enough allowance for the tier, checks the proof, records the minted amount,
        // and ensures the payment is correct.
        //
        // If this call is not reverted you can safely provide the _msgSender() with any assets you want for the sale.
        // For example you can mint "count" NFTs to the _msgSender(), or send "count" amount of an ERC20 tokens, etc.
        super._executeSale(tierId, count, maxAllowance, proof);

        // This is the custom logic for our project, which in this case is to mint from 2 separate ERC721 contracts.
        MyFirstToken(layout().targetTokenAddressFirst).mintForSale(_msgSender(), count);
        MySecondToken(layout().targetTokenAddressSecond).mintForSale(_msgSender(), count);
    }
}
