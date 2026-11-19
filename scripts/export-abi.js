const fs = require("node:fs");
const path = require("node:path");

const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "UESPIMerito.sol", "UESPIMerito.json");
const outputPath = path.join(__dirname, "..", "frontend", "src", "contracts", "UESPIMerito.json");
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify({ contractName: artifact.contractName, abi: artifact.abi }, null, 2)}\n`);
console.log(`ABI exportada para ${outputPath}`);
