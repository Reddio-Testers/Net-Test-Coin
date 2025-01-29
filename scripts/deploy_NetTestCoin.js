require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying from account:", deployer.address);


    const NetTestCoin = await ethers.getContractFactory("NetTestCoin");
    const dNetTestCoin = await NetTestCoin.deploy();

    await dNetTestCoin.waitForDeployment();

    console.log("Token has been deployed:", await dNetTestCoin.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });