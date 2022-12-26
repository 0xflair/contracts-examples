// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@flair-sdk/contracts/access/ownable/OwnableInternal.sol";
import "@flair-sdk/contracts/finance/sales/TieredSales.sol";
import "@flair-sdk/contracts/finance/sales/ITieredSalesRoleBased.sol";
import "@flair-sdk/contracts/metatx/ERC2771ContextInternal.sol";
import "@flair-sdk/contracts/access/roles/AccessControlInternal.sol";
import "@flair-sdk/contracts/token/ERC721/facets/minting/IERC721MintableRoleBased.sol";
import "@flair-sdk/contracts/token/ERC1155/facets/minting/IERC1155MintableRoleBased.sol";
import "@flair-sdk/contracts/token/ERC1155/facets/sales/ERC1155TieredSalesStorage.sol";
import "@flair-sdk/contracts/security/ReentrancyGuard.sol";

/**
 * @title My Custom Tiered Sales
 * @notice This is developed in-house to provide custom sales mechanism for our custom project.
 *
 * @custom:type eip-2535-facet
 * @custom:category NFTs
 * @custom:provides-interfaces ITieredSales, ITieredSalesRoleBased
 */
contract MyCustomTieredSales is
    ITieredSalesRoleBased,
    OwnableInternal,
    TieredSales,
    ERC2771ContextInternal,
    AccessControlInternal,
    ReentrancyGuard
{
    using TieredSalesStorage for TieredSalesStorage.Layout;
    using ERC1155TieredSalesStorage for ERC1155TieredSalesStorage.Layout;

    bytes32 public constant MERCHANT_ROLE = keccak256("MERCHANT_ROLE");
    bytes32 internal constant STORAGE_SLOT = keccak256("v1.my-amazing-team.contracts.storage.MyCustomTieredSales");

    function _msgSender() internal view virtual override(Context, ERC2771ContextInternal) returns (address) {
        return ERC2771ContextInternal._msgSender();
    }

    function _msgData() internal view virtual override(Context, ERC2771ContextInternal) returns (bytes calldata) {
        return ERC2771ContextInternal._msgData();
    }

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }

    /**
     * (1) Define state variables
     *
     * We must put all contract "state" variables in the Layout struct.
     * This storage pattern enables modularization using the EIP-2325 Diamond Standard.
     *
     *  To learn more about this pattern, see the following resources:
     *  - https://eips.ethereum.org/EIPS/eip-2325
     *  - https://eip2535diamonds.substack.com
     */
    struct Layout {
        address targetERC721ContractAddress;
        address targetERC1155ContractAddress;
    }

    /**
     * (2) Define custom functions
     *
     * You can put privileged functions (using Ownable or role-based AccessControl) here.
     */
    function setTargetTokens(address erc721ContractAddress, address erc1155ContractAddress) external onlyOwner {
        layout().targetERC721ContractAddress = erc721ContractAddress;
        layout().targetERC1155ContractAddress = erc1155ContractAddress;
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

        // This is the custom logic for our project, which in this case is to mint from ERC721 and ERC1155 contracts.
        IERC721MintableRoleBased(layout().targetERC721ContractAddress).mintByRole(_msgSender(), count);
        IERC1155MintableRoleBased(layout().targetERC1155ContractAddress).mintByRole(
            _msgSender(),
            ERC1155TieredSalesStorage.layout().tierToTokenId[tierId],
            count,
            ""
        );
    }

    /**
     * (4) Customize the "mintByTierByRole" method.
     *
     * This function mints tokens based on tier and role. We need this function when minting an NFT
     * with credit card or crypto payment.
     */
    function mintByTierByRole(
        address minter,
        uint256 tierId,
        uint256 count,
        uint256 maxAllowance,
        bytes32[] calldata proof
    ) external payable virtual nonReentrant onlyRole(MERCHANT_ROLE) {
        super._executeSalePrivileged(minter, tierId, count, maxAllowance, proof);

        IERC721MintableRoleBased(layout().targetERC721ContractAddress).mintByRole(_msgSender(), count);
        IERC1155MintableRoleBased(layout().targetERC1155ContractAddress).mintByRole(
            _msgSender(),
            ERC1155TieredSalesStorage.layout().tierToTokenId[tierId],
            count,
            ""
        );
    }
}
