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
    contract._burn();
    // set royalties
    await contract.setRoyalties(owner.address, 1800);

    // Reserve NFTs
    let txn = await contract.reserveNFTs();
    await txn.wait();
    console.log('10 NFTs have been reserved');

    // // Mint 3 NFTs by sending 0.03 ether
    // txn = await contract.mintNFTs(3, { value: utils.parseEther("0.54") })
    // await txn.wait()

    // Get all token IDs of the owner
    // let tokens = await contract.tokensOfOwner(owner.address);
    // console.log('Owner has tokens: ', tokens);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
