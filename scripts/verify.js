const { run, network } = require("hardhat");
const deployment = require(`../deployments/${network.name}.json`);

async function main() {
  await run("verify:verify", {
    address: deployment.contractAddress,
    constructorArguments: deployment.constructorArguments,
  });
  console.log(`Contrato verificado: ${deployment.contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
