import axios from "axios";
import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import { SiweMessage } from "siwe";

dotenv.config();

async function setSecrets() {
  // Load the private key from .env file
  const privateKey = process.env.PK || "";
  if (!privateKey) {
    console.error("Private key is missing from .env file");
    process.exit(1);
  }

  const provider = new ethers.providers.JsonRpcProvider(
    "https://arb-sepolia.g.alchemy.com/v2/iWL0Xm8PpSwnQJQQxNyJHEBTnqRdCYI3"
  );
  const signer = new ethers.Wallet(privateKey, provider);
  console.log("Signer address:", await signer.getAddress());
  const chainId = 421614; // Arbitrum Sepolia Chain ID as provided
  const taskId =
    "0x03df216a48d8928ea739c27d14e5dd0457ff54ff1f56bfd9fa8564377918900a"; // Task ID created earlier
  const contractAddress = "0x56593B957dD67D9fA64d443d03FB9efe33d6B7fc"; // Your GelatoSecretsContract address

  const domain = "app.gelato.network";
  const uri = `https://${domain}/`;
  const version = "1";
  const statement = "Gelato Web3Functions";
  const expirationTimestamp = Date.now() + 600_000;
  const expirationTime = new Date(expirationTimestamp).toISOString();

  // Construct the SIWE message using the provided information
  const siweMessage = new SiweMessage({
    domain,
    statement,
    uri,
    address: contractAddress,
    version,
    chainId,
    expirationTime,
  });

  const message = siweMessage.prepareMessage();
  const signature = await signer.signMessage(message);

  const authToken = Buffer.from(
    JSON.stringify({ message, signature })
  ).toString("base64");

  // Define the secret to be set
  const secretsData = {
    COINGECKO_API: "https://api.coingecko.com/api/v3",
  };

  try {
    await axios.post(
      `https://api.gelato.digital/automate/users/users/${contractAddress}/secrets/${chainId}/${taskId}`,
      { ...secretsData },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("Secrets set successfully!");

    const { data } = await axios.get(
      `https://api.gelato.digital/automate/users/users/${contractAddress}/secrets/${chainId}/${taskId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    console.log(`Secrets fetched: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error("Error setting secrets:", error);
  }
}

setSecrets().catch((error) => {
  console.error("Error in setting secrets:", error);
  process.exit(1);
});
