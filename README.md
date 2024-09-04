# Gelato Secrets Smart Contract and Task Automation

This project demonstrates how to use Gelato Automate to create a task and set secrets for a smart contract using a trusted signer mechanism and the Sign-In With Ethereum (SIWE) flow.

## Introduction

The GelatoSecretsContract contract uses Gelato Automate to automate tasks. The contract integrates with Gelato Automate and allows a trusted signer to create tasks and interact with secrets securely using the SIWE (Sign-In With Ethereum) flow.

This project includes:

A smart contract that supports task automation.
A script to create tasks using the smart contract.
A script to set secrets for tasks using SIWE.

## How to run the project

### Install dependencies

```bash
npm install
```

### Compile the smart contract

```bash
npx hardhat compile
```

### Deploy the smart contract

```bash
npx hardhat deploy --tags GelatoSecretsContract --network arbitrumSepolia
```

### Create a task

```bash
npx hardhat run scripts/create-task-gelato.ts --network arbitrumSepolia
```

### Set secrets for the task

```bash
npx hardhat run scripts/siwe-secrets-gelato.ts --network arbitrumSepolia
```

- Contract deployed on Arbitrum Sepolia: [0x56593b957dd67d9fa64d443d03fb9efe33d6b7fc](https://sepolia.arbiscan.io/address/0x56593b957dd67d9fa64d443d03fb9efe33d6b7fc)
- [Task created on Gelato](https://app.gelato.network/functions/task/0x03df216a48d8928ea739c27d14e5dd0457ff54ff1f56bfd9fa8564377918900a:421614)
