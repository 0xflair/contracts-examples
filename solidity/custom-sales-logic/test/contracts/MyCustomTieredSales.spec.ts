// import 'hardhat-deploy';
// import '@nomiclabs/hardhat-ethers';
// import '@nomiclabs/hardhat-waffle';

// import { DiamondLoupe } from '@flair-sdk/contracts';
// import { expect } from 'chai';
// import { utils } from 'ethers';
// import hre from 'hardhat';

// import { MyCustomTieredSales } from '../../src/typechain';
// import { setupTest } from '../setup';
// import { generateAllowlistLeaf, generateAllowlistMerkleTree } from '../utils/allowlists';
// import { ZERO_ADDRESS, ZERO_BYTES32 } from '../utils/common';
// import { deployDiamond, getFacetContract, Initialization } from '../utils/diamond';
// import { Tier } from '../utils/tiered-sales';

// const DEFAULT_TIERS: Tier[] = [
//   {
//     start: 0,
//     end: Math.floor(+new Date() / 1000) + 10 * 24 * 60 * 60, // +10 days
//     price: utils.parseEther('0.06'),
//     currency: ZERO_ADDRESS,
//     maxPerWallet: 5,
//     merkleRoot: ZERO_BYTES32,
//     reserved: 0,
//     maxAllocation: 5000,
//   },
//   {
//     start: 0,
//     end: Math.floor(+new Date() / 1000) + 10 * 24 * 60 * 60, // +10 days
//     price: utils.parseEther('0.2'),
//     currency: ZERO_ADDRESS,
//     maxPerWallet: 5,
//     merkleRoot: ZERO_BYTES32,
//     reserved: 0,
//     maxAllocation: 5000,
//   },
// ];

// const deployERC721WithSales = async ({
//   tiers = DEFAULT_TIERS,
//   initializations = [],
// }: {
//   tiers?: Tier[];
//   initializations?: Initialization[];
// } = {}) => {
//   return deployDiamond({
//     facets: [
//       // Our custom facet developed locally
//       'MyCustomTieredSales',

//       // Re-usable facets exported by libraries
//       'flair-sdk:introspection/ERC165Ownable',
//       'flair-sdk:finance/sales/TieredSalesOwnable',
//     ],
//     initializations: [
//       {
//         facet: 'flair-sdk:introspection/ERC165Ownable',
//         function: 'setERC165',
//         args: [['0xd9b67a26', '0x744f4bd4'], []],
//       },
//       {
//         facet: 'flair-sdk:finance/sales/TieredSalesOwnable',
//         function: 'configureTiering(uint256[],(uint256,uint256,address,uint256,uint256,bytes32,uint256,uint256)[])',
//         args: [Object.keys(tiers), Object.values(tiers)],
//       },
//       ...initializations,
//     ],
//   });
// };

// describe('My Custom Tiered Sales', function () {
//   it('should return facets', async function () {
//     await setupTest();

//     const diamond = await deployERC721WithSales();
//     const diamondLoupeFacet = (await getFacetContract<DiamondLoupe>('flair-sdk:diamond/DiamondLoupe')).attach(
//       diamond.address,
//     );

//     const facets = await diamondLoupeFacet.facets();

//     expect(facets.length).to.be.equal(7);
//   });

//   it('should mint by tier multiple times until reached max allowance in allowlist', async function () {
//     const { userA, userB, userC } = await setupTest();

//     const mkt = generateAllowlistMerkleTree([
//       {
//         address: userA.signer.address,
//         maxAllowance: 3,
//       },
//       {
//         address: userB.signer.address,
//         maxAllowance: 2,
//       },
//       {
//         address: userC.signer.address,
//         maxAllowance: 4,
//       },
//     ]);

//     const diamond = await deployERC721WithSales({
//       tiers: [
//         {
//           start: Math.floor(+new Date() / 1000) - 4 * 24 * 60 * 60,
//           end: Math.floor(+new Date() / 1000) + 6 * 24 * 60 * 60,
//           currency: ZERO_ADDRESS,
//           maxPerWallet: 5,
//           merkleRoot: mkt.getHexRoot(),
//           price: utils.parseEther('0.06'),
//           reserved: 0,
//           maxAllocation: 5000,
//         },
//       ],
//     });

//     const myFirstToken = await hre.ethers.getContract<MyFirstToken>('MyFirstToken');
//     const mySecondToken = await hre.ethers.getContract<MySecondToken>('MySecondToken');
//     const tieredSalesFacet = await hre.ethers.getContractAt<MyCustomTieredSales>(
//       'MyCustomTieredSales',
//       diamond.address,
//     );

//     await myFirstToken.grantMinterRole(diamond.address);
//     await mySecondToken.grantMinterRole(diamond.address);
//     await tieredSalesFacet.setTargetTokens(myFirstToken.address, mySecondToken.address);

//     expect(
//       await tieredSalesFacet.connect(userA.signer).onTierAllowlist(
//         0,
//         userA.signer.address,
//         3,
//         mkt.getHexProof(
//           generateAllowlistLeaf({
//             address: userA.signer.address,
//             maxAllowance: 3,
//           }),
//         ),
//       ),
//     ).to.be.equal(true);

//     await tieredSalesFacet.connect(userA.signer).mintByTier(
//       0,
//       2,
//       3,
//       mkt.getHexProof(
//         generateAllowlistLeaf({
//           address: userA.signer.address,
//           maxAllowance: 3,
//         }),
//       ),
//       {
//         value: utils.parseEther('0.18'),
//       },
//     );

//     await tieredSalesFacet.connect(userA.signer).mintByTier(
//       0,
//       1,
//       3,
//       mkt.getHexProof(
//         generateAllowlistLeaf({
//           address: userA.signer.address,
//           maxAllowance: 3,
//         }),
//       ),
//       {
//         value: utils.parseEther('0.06'),
//       },
//     );

//     await expect(
//       tieredSalesFacet.connect(userA.signer).mintByTier(
//         0,
//         1,
//         3,
//         mkt.getHexProof(
//           generateAllowlistLeaf({
//             address: userA.signer.address,
//             maxAllowance: 3,
//           }),
//         ),
//         {
//           value: utils.parseEther('0.06'),
//         },
//       ),
//     ).to.be.revertedWith('MAXED_ALLOWANCE');

//     expect(await mySecondToken.balanceOf(userA.signer.address)).to.equal(3);
//     expect(await myFirstToken.balanceOf(userA.signer.address)).to.equal(3);
//   });

//   it('should mint by tier when 1 tier, no allowlist, with native currency', async function () {
//     const { userA } = await setupTest();

//     const diamond = await deployERC721WithSales();
//     const myFirstToken = await hre.ethers.getContract<MyFirstToken>('MyFirstToken');
//     const mySecondToken = await hre.ethers.getContract<MySecondToken>('MySecondToken');
//     const tieredSalesFacet = await hre.ethers.getContractAt<MyCustomTieredSales>(
//       'MyCustomTieredSales',
//       diamond.address,
//     );

//     await myFirstToken.grantMinterRole(diamond.address);
//     await mySecondToken.grantMinterRole(diamond.address);
//     await tieredSalesFacet.setTargetTokens(myFirstToken.address, mySecondToken.address);

//     await tieredSalesFacet.connect(userA.signer).mintByTier(0, 2, 0, [], {
//       value: utils.parseEther('0.12'),
//     });

//     expect(await myFirstToken.balanceOf(userA.signer.address)).to.be.equal(2);
//     expect(await mySecondToken.balanceOf(userA.signer.address)).to.be.equal(2);
//   });

//   it('should get wallet minted amount by tier', async function () {
//     const { userA } = await setupTest();

//     const diamond = await deployERC721WithSales();
//     const myFirstToken = await hre.ethers.getContract<MyFirstToken>('MyFirstToken');
//     const mySecondToken = await hre.ethers.getContract<MySecondToken>('MySecondToken');
//     const tieredSalesFacet = await hre.ethers.getContractAt<MyCustomTieredSales>(
//       'MyCustomTieredSales',
//       diamond.address,
//     );

//     await myFirstToken.grantMinterRole(diamond.address);
//     await mySecondToken.grantMinterRole(diamond.address);
//     await tieredSalesFacet.setTargetTokens(myFirstToken.address, mySecondToken.address);

//     await tieredSalesFacet.connect(userA.signer).mintByTier(0, 2, 0, [], {
//       value: utils.parseEther('0.12'),
//     });

//     expect(await tieredSalesFacet.walletMintedByTier(0, userA.signer.address)).to.be.equal(2);
//   });

//   it('should fail when minting a non-existing tier', async function () {
//     const { userA } = await setupTest();

//     const diamond = await deployERC721WithSales();
//     const myFirstToken = await hre.ethers.getContract<MyFirstToken>('MyFirstToken');
//     const mySecondToken = await hre.ethers.getContract<MySecondToken>('MySecondToken');
//     const tieredSalesFacet = await hre.ethers.getContractAt<MyCustomTieredSales>(
//       'MyCustomTieredSales',
//       diamond.address,
//     );

//     await myFirstToken.grantMinterRole(diamond.address);
//     await mySecondToken.grantMinterRole(diamond.address);
//     await tieredSalesFacet.setTargetTokens(myFirstToken.address, mySecondToken.address);

//     await expect(
//       tieredSalesFacet.connect(userA.signer).mintByTier(555, 2, 0, [], {
//         value: utils.parseEther('0.12'),
//       }),
//     ).to.be.revertedWith('NOT_EXISTS');
//   });

//   it('should fail when minting a tier that is not started yet', async function () {
//     const { userA } = await setupTest();

//     const diamond = await deployERC721WithSales({
//       tiers: [
//         {
//           start: Math.floor(+new Date() / 1000) + 4 * 24 * 60 * 60,
//           end: Math.floor(+new Date() / 1000) + 6 * 24 * 60 * 60,
//           currency: ZERO_ADDRESS,
//           maxPerWallet: 5,
//           merkleRoot: ZERO_BYTES32,
//           price: utils.parseEther('0.06'),
//           reserved: 0,
//           maxAllocation: 5000,
//         },
//       ],
//     });
//     const myFirstToken = await hre.ethers.getContract<MyFirstToken>('MyFirstToken');
//     const mySecondToken = await hre.ethers.getContract<MySecondToken>('MySecondToken');
//     const tieredSalesFacet = await hre.ethers.getContractAt<MyCustomTieredSales>(
//       'MyCustomTieredSales',
//       diamond.address,
//     );

//     await myFirstToken.grantMinterRole(diamond.address);
//     await mySecondToken.grantMinterRole(diamond.address);
//     await tieredSalesFacet.setTargetTokens(myFirstToken.address, mySecondToken.address);

//     await expect(
//       tieredSalesFacet.connect(userA.signer).mintByTier(0, 2, 0, [], {
//         value: utils.parseEther('0.12'),
//       }),
//     ).to.be.revertedWith('NOT_STARTED');
//   });

//   it('should fail when minting a tier that is already ended', async function () {
//     const { userA } = await setupTest();

//     const diamond = await deployERC721WithSales({
//       tiers: [
//         {
//           start: Math.floor(+new Date() / 1000) - 4 * 24 * 60 * 60,
//           end: Math.floor(+new Date() / 1000) - 6 * 24 * 60 * 60,
//           currency: ZERO_ADDRESS,
//           maxPerWallet: 5,
//           merkleRoot: ZERO_BYTES32,
//           price: utils.parseEther('0.06'),
//           reserved: 0,
//           maxAllocation: 5000,
//         },
//       ],
//     });
//     const myFirstToken = await hre.ethers.getContract<MyFirstToken>('MyFirstToken');
//     const mySecondToken = await hre.ethers.getContract<MySecondToken>('MySecondToken');
//     const tieredSalesFacet = await hre.ethers.getContractAt<MyCustomTieredSales>(
//       'MyCustomTieredSales',
//       diamond.address,
//     );

//     await myFirstToken.grantMinterRole(diamond.address);
//     await mySecondToken.grantMinterRole(diamond.address);
//     await tieredSalesFacet.setTargetTokens(myFirstToken.address, mySecondToken.address);

//     await expect(
//       tieredSalesFacet.connect(userA.signer).mintByTier(0, 2, 0, [], {
//         value: utils.parseEther('0.12'),
//       }),
//     ).to.be.revertedWith('ALREADY_ENDED');
//   });

//   it('should fail when minting a tier and wallet is not allowlisted', async function () {
//     const { userA, userB, userC, userD } = await setupTest();

//     const mkt = generateAllowlistMerkleTree([
//       {
//         address: userA.signer.address,
//         maxAllowance: 3,
//       },
//       {
//         address: userB.signer.address,
//         maxAllowance: 2,
//       },
//       {
//         address: userC.signer.address,
//         maxAllowance: 4,
//       },
//     ]);

//     const diamond = await deployERC721WithSales({
//       tiers: [
//         {
//           start: Math.floor(+new Date() / 1000) - 4 * 24 * 60 * 60,
//           end: Math.floor(+new Date() / 1000) + 6 * 24 * 60 * 60,
//           currency: ZERO_ADDRESS,
//           maxPerWallet: 5,
//           merkleRoot: mkt.getHexRoot(),
//           price: utils.parseEther('0.06'),
//           reserved: 0,
//           maxAllocation: 5000,
//         },
//       ],
//     });
//     const myFirstToken = await hre.ethers.getContract<MyFirstToken>('MyFirstToken');
//     const mySecondToken = await hre.ethers.getContract<MySecondToken>('MySecondToken');
//     const tieredSalesFacet = await hre.ethers.getContractAt<MyCustomTieredSales>(
//       'MyCustomTieredSales',
//       diamond.address,
//     );

//     await myFirstToken.grantMinterRole(diamond.address);
//     await mySecondToken.grantMinterRole(diamond.address);
//     await tieredSalesFacet.setTargetTokens(myFirstToken.address, mySecondToken.address);

//     expect(
//       await tieredSalesFacet.connect(userD.signer).onTierAllowlist(
//         0,
//         userD.signer.address,
//         2,
//         mkt.getHexProof(
//           generateAllowlistLeaf({
//             address: userD.signer.address,
//             maxAllowance: 2,
//           }),
//         ),
//       ),
//     ).to.be.equal(false);

//     await expect(
//       tieredSalesFacet.connect(userD.signer).mintByTier(
//         0,
//         2,
//         2,
//         mkt.getHexProof(
//           generateAllowlistLeaf({
//             address: userD.signer.address,
//             maxAllowance: 2,
//           }),
//         ),
//         {
//           value: utils.parseEther('0.12'),
//         },
//       ),
//     ).to.be.revertedWith('NOT_ALLOWLISTED');
//   });
// });
