const hre = require("hardhat");

async function main() {
    const voting_contract = await hre.ethers.getContractFactory("voting");
    const deployed_voting_contract = await voting_contract.deploy()

    console.log(`Contract Address Deployed: ${deployed_voting_contract.target}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

