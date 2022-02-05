This project was started by following this tutorial: https://dev.to/rounakbanik/writing-an-nft-collectible-smart-contract-2nh8

I add the eip2981 standard for royalties found here: https://github.com/dievardump/EIP2981-implementation

# NFT Collection Contract

This project demonstrates an nft contract that adds eip-2981 royalty standard.

Note: this is not a boilerplate, and is probably not a production ready contract. I just wanted to add some royalties to my first nft.

```sh
git clone https://github.com/CZTopp/unocara-nft
cd unocara-nft
npm install
```

Try running the tests:

```sh
npx hardhat test
```

try running the contract

```sh
npx hardhat run scripts/run.js --network localhost
```
