const { ethers, network } = require("hardhat");
const fs = require("node:fs");
const path = require("node:path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Rede: ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);

  const Token = await ethers.getContractFactory("UESPIMerito");
  const token = await Token.deploy(deployer.address);
  await token.waitForDeployment();

  const address = await token.getAddress();
  const receipt = await token.deploymentTransaction().wait();
  const output = {
    network: network.name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    contractAddress: address,
    deployer: deployer.address,
    transactionHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    constructorArguments: [deployer.address],
  };

  fs.mkdirSync(path.join(__dirname, "..", "deployments"), { recursive: true });
  fs.writeFileSync(
    path.join(__dirname, "..", "deployments", `${network.name}.json`),
    `${JSON.stringify(output, null, 2)}\n`,
  );
  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
