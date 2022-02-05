//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import './eip2981/ERC2981ContractWideRoyalties.sol';
import 'hardhat/console.sol';

/// @title Example of ERC721 contract with ERC2981
/// @author @czshows
/// @notice Not production ready
contract UnoCara is ERC721, ERC2981ContractWideRoyalties, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant PRICE = 0.18 ether;
    uint256 public constant MAX_PER_MINT = 5;
    string public baseTokenURI;

    // uint256 nextTokenId;
    Counters.Counter private _tokenIds;

    constructor(string memory baseURI) ERC721('UnoCara', 'CARA') {
        setBaseURI(baseURI);
    }

    /// @inheritdoc	ERC165
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC2981Base)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// @notice Allows to set the royalties on the contract
    /// @dev This function in a real contract should be protected with a onlyOwner (or equivalent) modifier
    /// @param recipient the royalties recipient
    /// @param value royalties value (between 0 and 10000)
    function setRoyalties(address recipient, uint256 value) public onlyOwner {
        _setRoyalties(recipient, value);
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function reserveNFTs() public onlyOwner {
        uint256 totalMinted = _tokenIds.current();
        require(totalMinted.add(10) < MAX_SUPPLY, 'Not enough NFTs');
        for (uint256 i = 0; i < 10; i++) {
            mint(msg.sender);
        }
    }

    /// @notice Mint one token to `to`
    /// @param to the recipient of the token
    function mint(address to) public payable {
        uint256 totalMinted = _tokenIds.current();
        require(totalMinted.add(1) <= MAX_SUPPLY, 'Not enough NFTs!');
        require(
            msg.value >= PRICE.mul(1),
            'Not enough ether to purchase NFTs.'
        );

        uint256 tokenId = _tokenIds.current();
        _safeMint(to, tokenId, '');

        _tokenIds.increment();
    }

    /// @notice Mint several tokens at once
    /// @param recipients an array of recipients for each token
    function mintBatch(address[] memory recipients) public payable {
        uint256 tokenId = _tokenIds.current();
        for (uint256 i; i < recipients.length; i++) {
            _safeMint(recipients[i], tokenId, '');
            _tokenIds.increment();
        }
    }

    function withdraw() public payable onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, 'No ether left to withdraw');
        (bool success, ) = (msg.sender).call{value: balance}('');
        require(success, 'Transfer failed.');
    }
}
