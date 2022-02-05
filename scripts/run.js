const { utils } = require('ethers');
const { BASE_URI_TOKEN } = process.env;

async function main() {
    // Get owner/deployer's wallet address
    const [owner] = await hre.ethers.getSigners();

    // Get contract that we want to deploy
    const contractFactory = await hre.ethers.getContractFactory('UnoCara');

    // Deploy contract with the correct constructor arguments
    const contract = await contractFactory.deploy(`${BASE_URI_TOKEN}`);

    // Wait for this transaction to be mined
    await contract.deployed();

    // Get contract address
    console.log('Contract deployed to:', contract.address);
    console.log('Contract owner:', owner.address);

    // set royalties
    await contract.setRoyalties(owner.address, 1800);

    // Reserve NFTs
    let txn = await contract.reserveNFTs();
    await txn.wait();
    console.log('10 NFTs have been reserved');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
