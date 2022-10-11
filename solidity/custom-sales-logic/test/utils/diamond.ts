import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';

import { Diamond } from '@flair-sdk/contracts';
import { findContractByReference } from '@flair-sdk/registry';
import { Contract, utils } from 'ethers';
import hre from 'hardhat';

export enum FacetCutAction {
  Add,
  Replace,
  Remove,
}

export type Facet =
  | string
  | {
      facetAddress: string;
      functionSelectors: string[];
    };

export type Initialization = {
  facet: string;
  function: string;
  args: any[];
};

export const encodeFunctionSignature = (signature: string) => {
  return utils.keccak256(utils.toUtf8Bytes(signature)).slice(0, 10);
};

const deployedByReference: Record<string, Contract> = {};

export const deployArtifactByReference = async <T extends Contract>(
  reference: string,
  args: any = [],
  forceNew = false,
) => {
  if (deployedByReference[reference] && !forceNew) {
    if ((await hre.deployments.getDeploymentsFromAddress(deployedByReference[reference].address)).length > 0) {
      return deployedByReference[reference] as T;
    } else {
      delete deployedByReference[reference];
    }
  }

  const signer = await hre.ethers.getSigner((await hre.getUnnamedAccounts())[0]);
  const artifact = await findContractByReference(reference);

  if (!artifact.artifact?.abi || !artifact.artifact?.bytecode) {
    throw new Error(`Artifact ABI or bytecode missing: ${reference}`);
  }

  const factory = new hre.ethers.ContractFactory(artifact.artifact?.abi, artifact.artifact?.bytecode, signer);
  const contract = await factory.deploy(...args);

  deployedByReference[reference] = contract;

  return contract as T;
};

export const deployDiamond = async (
  {
    facets = [],
    initializations = [],
  }: {
    facets?: Facet[];
    initializations?: Initialization[];
  } = { facets: [], initializations: [] },
) => {
  const accounts = await hre.getUnnamedAccounts();

  const diamondCutFacet = await getFacetContract('flair-sdk:diamond/DiamondCut');
  const diamondLoupeFacet = await getFacetContract('flair-sdk:diamond/DiamondLoupe');
  const erc165Facet = await getFacetContract('flair-sdk:introspection/ERC165');
  const erc173Facet = await getFacetContract('flair-sdk:access/ownable/Ownable');

  const initialFacets = await Promise.all(
    facets.map(async (facet) => {
      if (typeof facet === 'string') {
        const facetContract = await getFacetContract(facet);
        const publicFunctionSignatures = Object.keys(facetContract.functions).filter((key) => key.endsWith(')'));

        return {
          action: FacetCutAction.Add,
          facetAddress: facetContract.address,
          functionSelectors: publicFunctionSignatures.map(encodeFunctionSignature),
        };
      }

      return {
        ...facet,
        action: FacetCutAction.Add,
      };
    }),
  );

  const initialCalls = await Promise.all(
    initializations.map(async (call) => {
      const facetContract = await getFacetContract(call.facet);

      if (!facetContract[call.function]) {
        throw new Error(
          `Function ${call.function} not found OR ambiguous in contract ${call.facet}, choose one of: ${Object.keys(
            facetContract.interface.functions,
          ).join(' ')}`,
        );
      }

      const initData = facetContract.interface.encodeFunctionData(call.function, call.args);
      return {
        initContract: facetContract.address,
        initData,
      };
    }),
  );

  return await deployArtifactByReference<Diamond>(
    'flair-sdk:diamond/Diamond',
    [
      // owner
      accounts[0],
      // coreFacets
      {
        diamondCutFacet: diamondCutFacet.address,
        diamondLoupeFacet: diamondLoupeFacet.address,
        erc165Facet: erc165Facet.address,
        erc173Facet: erc173Facet.address,
      },
      initialFacets,
      initialCalls,
    ],
    true,
  );
};
export async function getFacetContract<T extends Contract>(facet: string) {
  let facetContract;

  try {
    facetContract = await hre.ethers.getContract<T>(facet);
  } catch (e) {
    facetContract = await deployArtifactByReference<T>(facet);
  }

  if (!facetContract || !facetContract.functions) {
    throw new Error(`Facet not found locally nor via registry: ${facet}`);
  }
  return facetContract;
}
