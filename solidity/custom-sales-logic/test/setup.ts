import '@flair-sdk/registry';
import '@flair-sdk/contracts';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { deployments } from 'hardhat';

type ContractDictionary = {
  [contractName: string]: {
    signer: SignerWithAddress;
  };
};

export const setupTest = deployments.createFixture(async ({ deployments, getUnnamedAccounts, ethers }, options) => {
  const accounts = await getUnnamedAccounts();

  await deployments.fixture();

  return {
    deployer: {
      signer: await ethers.getSigner(accounts[0]),
    },
    userA: {
      signer: await ethers.getSigner(accounts[1]),
    },
    userB: {
      signer: await ethers.getSigner(accounts[2]),
    },
    userC: {
      signer: await ethers.getSigner(accounts[3]),
    },
    userD: {
      signer: await ethers.getSigner(accounts[4]),
    },
  } as ContractDictionary;
});
