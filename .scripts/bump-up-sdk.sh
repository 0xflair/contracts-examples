#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Solidity
cd ${SCRIPT_DIR}/../solidity/custom-sales-logic
npm remove @flair-sdk/common @flair-sdk/registry @flair-sdk/contracts && \
npm i @flair-sdk/common@latest @flair-sdk/registry@latest @flair-sdk/contracts@latest

# React
cd ${SCRIPT_DIR}/../react/custom-tiered-sales
npm remove @flair-sdk/react && \
npm install @flair-sdk/react@latest

cd ${SCRIPT_DIR}/../react/simple-wallet-integration
npm remove @flair-sdk/react && \
npm install @flair-sdk/react@latest

cd ${SCRIPT_DIR}/../react/erc721-custom-tiered-sales
npm remove @flair-sdk/react && \
npm install @flair-sdk/react@latest

cd ${SCRIPT_DIR}/../react/erc721-show-nfts-with-sign-in
npm remove @flair-sdk/react && \
npm install @flair-sdk/react@latest

# Node.js
cd ${SCRIPT_DIR}/../express/mint-erc721-with-metadata
npm remove @flair-sdk/contracts @flair-sdk/ipfs @flair-sdk/metatx && \
npm install @flair-sdk/contracts @flair-sdk/ipfs @flair-sdk/metatx
