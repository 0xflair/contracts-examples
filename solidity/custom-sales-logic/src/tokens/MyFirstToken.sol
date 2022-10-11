// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@flair-sdk/contracts/token/ERC721/ERC721A.sol";
import "@flair-sdk/contracts/access/ownable/OwnableInternal.sol";
import "@flair-sdk/contracts/access/roles/AccessControlInternal.sol";
import "@flair-sdk/contracts/token/ERC721/facets/supply/ERC721SupplyOwnable.sol";

/**
 * We're using Flair contracts and extension facets but creating a static immutable contract (instead of using Diamonds pattern),
 * to use as an example of using a custom-made contract in a tiered sales.
 */
contract MyFirstToken is ERC721A, OwnableInternal, AccessControlInternal, ERC721SupplyOwnable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);

        _transferOwnership(msg.sender);

        _setMaxSupply(10000);
    }

    function grantMinterRole(address account) public onlyOwner {
        _grantRole(MINTER_ROLE, account);
    }

    function revokeMinterRole(address account) public onlyOwner {
        _revokeRole(MINTER_ROLE, account);
    }

    function mintForSale(address to, uint256 count) public {
        require(_hasRole(MINTER_ROLE, msg.sender), "MinterRole: caller does not have the Minter role");
        _mint(to, count);
    }
}
