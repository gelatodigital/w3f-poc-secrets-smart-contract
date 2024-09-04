import { ethers } from "hardhat";

async function main() {
  // Replace these with your actual values
  const contractAddress = "0x56593b957dd67d9fa64d443d03fb9efe33d6b7fc"; // Deployed GelatoSecretsContract address
  const web3FunctionHash = "QmT4oWpb85U6zsoX2RD5aaEX2qTf1mSbYGoojydbaXpscL"; // Web3 function hash

  // User arguments
  const currency = "ethereum";
  const oracle = "0x71B9B0F6C999CBbB0FeF9c92B80D54e4973214da";

  // Encode the user arguments into a hex string
  const web3FunctionArgsHex = ethers.utils.defaultAbiCoder.encode(
    ["string", "string"],
    [currency, oracle]
  );

  console.log("Encoded Web3 Function Arguments:", web3FunctionArgsHex);

  // Get the deployer account to interact with the contract
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Attach to the deployed GelatoSecretsContract
  const gelatoSecretsContract = await ethers.getContractAt(
    "GelatoSecretsContract",
    contractAddress
  );

  // Create the task by calling the createTask function
  const tx = await gelatoSecretsContract.createTask(
    web3FunctionHash,
    web3FunctionArgsHex
  );
  console.log("Transaction sent, waiting for confirmation...");

  // Wait for the transaction to be mined
  await tx.wait();

  console.log("Task created successfully!");
}

main().catch((error) => {
  console.error("Error creating task:", error);
  process.exit(1);
});
