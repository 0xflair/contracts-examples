#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd ${SCRIPT_DIR}/../solidity/custom-sales-logic
npm remove @flair-sdk/common @flair-sdk/registry @flair-sdk/contracts && npm i @flair-sdk/common@latest @flair-sdk/registry@latest @flair-sdk/contracts@latest


cd ${SCRIPT_DIR}/../next.js/custom-tiered-sales
yarn remove @flair-sdk/react && yarn add @flair-sdk/react@latest

cd ${SCRIPT_DIR}/../next.js/simple-wallet-integration
yarn remove @flair-sdk/react && yarn add @flair-sdk/react@latest


cd ${SCRIPT_DIR}/../react/erc721-custom-tiered-sales
npm remove @flair-sdk/react && npm install @flair-sdk/react@latest

cd ${SCRIPT_DIR}/../react/custom-tiered-sales
npm remove @flair-sdk/react && npm install @flair-sdk/react@latest

cd ${SCRIPT_DIR}/../react/simple-wallet-integration
npm remove @flair-sdk/react && npm install @flair-sdk/react@latest