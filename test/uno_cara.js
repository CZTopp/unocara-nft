const { expect } = require('chai');
const { ethers } = require('hardhat');
const { utils } = require('ethers');
const { BASE_URI_TOKEN } = process.env;

describe('UnoCara', () => {
    let UnoCara;
    let deployer;
    let royaltiesRecipient;

    const ADDRESS_ZERO = ethers.constants.AddressZero;

    beforeEach(async () => {
        [deployer, randomAccount, royaltiesRecipient] =
            await hre.ethers.getSigners();

        const contractFactory = await await hre.ethers.getContractFactory(
            'UnoCara'
        );
        UnoCara = await contractFactory.deploy(`${BASE_URI_TOKEN}`);
        await UnoCara.deployed();
        unoCara = await ethers.getContractAt(
            'UnoCara',
            UnoCara.address,
            deployer
        );
    });

    describe('Contract wide Royalties', async () => {
        it('has no royalties if not set', async function () {
            await unoCara.mint(deployer.address, {
                value: utils.parseEther('0.18'),
            });

            const info = await unoCara.royaltyInfo(0, 100);
            expect(info[1].toNumber()).to.be.equal(0);
            expect(info[0]).to.be.equal(ADDRESS_ZERO);
        });

        it('throws if royalties more than 100%', async function () {
            const tx = unoCara.setRoyalties(royaltiesRecipient.address, 10001);
            await expect(tx).to.be.revertedWith('ERC2981Royalties: Too high');
        });

        it('has the right royalties for tokenId', async function () {
            await unoCara.setRoyalties(royaltiesRecipient.address, 250);

            await unoCara.mint(deployer.address, {
                value: utils.parseEther('0.18'),
            });

            const info = await unoCara.royaltyInfo(0, 10000);
            expect(info[1].toNumber()).to.be.equal(250);
            expect(info[0]).to.be.equal(royaltiesRecipient.address);
        });

        it('can set address(0) as royalties recipient', async function () {
            await unoCara.setRoyalties(ADDRESS_ZERO, 5000);

            await unoCara.mint(deployer.address, {
                value: utils.parseEther('0.18'),
            });

            const info = await unoCara.royaltyInfo(0, 10000);
            expect(info[1].toNumber()).to.be.equal(5000);
            expect(info[0]).to.be.equal(ADDRESS_ZERO);
        });
        it('can burn a token by id', async function () {
            await unoCara.setRoyalties(ADDRESS_ZERO, 5000);

            await unoCara.mint(deployer.address, {
                value: utils.parseEther('0.18'),
            });
            const tokenBalance = await unoCara.balanceOf(deployer.address);
            expect(tokenBalance).to.be.equal(1);
            await unoCara.burn(0);
            expect(tokenBalance).to.be.equal(1);
        });
    });
});
