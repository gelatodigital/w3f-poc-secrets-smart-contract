import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployGelatoSecretsContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Replace these with your actual addresses
  const automateAddress = "0x2A6C106ae13B558BB9E2Ec64Bd2f1f7BEFF3A5E0"; // The address of the Gelato Automate contract
  const trustedSignerAddress = "0x23e359eCAB56210f4b8B559218C4d27A85b052b8"; // The address of your trusted signer

  await deploy("GelatoSecretsContract", {
    from: deployer,
    args: [automateAddress, trustedSignerAddress], // Constructor arguments
    log: true,
  });
};

export default deployGelatoSecretsContract;
deployGelatoSecretsContract.tags = ["GelatoSecretsContract"];
