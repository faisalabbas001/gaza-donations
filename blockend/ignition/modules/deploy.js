const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    // console.log("Account balance:", (await deployer.getBalance()).toString());

    const Token = await hre.ethers.getContractFactory("MockERC20");
    const token = await Token.deploy("Test Token", "TEST", ethers.parseEther("1000000"));
    // await token.deployed();

    console.log("Token deployed to:", token.target);

    // const token = "0x792BDA4e73be85f14D402b203026C6266495E4F8";

    const PoolManager = await hre.ethers.getContractFactory("PoolManager");
    const poolManager = await PoolManager.deploy(token.target);
    // await poolManager.deployed();

    console.log("PoolManager deployed to:", poolManager.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);

    });
