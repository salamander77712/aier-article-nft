
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ArticleNFT is ERC721, AccessControl {

	bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

	address payable payoutAddress = payable(address(0));
	uint aierCut = 100;

	event ArticleCreated(uint id, string stub, string authorName);
	event AuthorAdded(uint id, string name);
	event AuctionCreated(uint id, uint tokenId, uint64 endTime);
	event PayoutAddressChnaged(address newAddress);
	event Bid(uint auctionId, uint amount);
	event AuctionFinished(uint auctionId, uint tokenId, address winner, uint price, uint weiToAuthor, uint weitToAIER);

	constructor() ERC721("AIER Articles", "AIER-A") {
		_setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_setupRole(MINTER_ROLE, msg.sender);
	}

	struct Author{
		string name;
		address payable payoutAddress;
	}

	struct Article{
		string stub;
		Author author;
		bool locked;
	}

	struct Auction{
		uint tokenId;
		uint highestBid;
		address payable highestBidder;
		uint64 endTime;
		bool finsihed;
	}

	Article[] public articles;
	Author[] public authors;
	Auction[] public auctions;

	function setPayoutAddress(address payable newAddress) external onlyRole(MINTER_ROLE){
		payoutAddress = newAddress;
		emit PayoutAddressChnaged(newAddress);
	}

	function _baseURI() internal pure override returns (string memory) {
		return "http://aier.org/article/";
 	}

	function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
		require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
		string memory baseURI = _baseURI();
		return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, articles[tokenId].stub)) : "";
  }

	function mint(string memory stub, uint authorId) public onlyRole(MINTER_ROLE) {
		articles.push(Article(stub, authors[authorId], false));
		uint tokenId = articles.length - 1;
		emit ArticleCreated(tokenId, stub, authors[authorId].name);
		_mint(address(this), tokenId);
  }

	function addAuthor(string memory name, address payable author) external  onlyRole(MINTER_ROLE){
		authors.push(Author(name, author));
		uint id = authors.length - 1;
		emit AuthorAdded(id, name);
  }

	function auctionToken(uint tokenId, uint numDays) external onlyRole(MINTER_ROLE){
		require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
		require(ownerOf(tokenId) == address(this), "Contract must own auctioned token");
		auctions.push(Auction(tokenId, 0, payable(address(this)), uint64(block.timestamp + numDays * 1 days), false));
		uint id = auctions.length - 1;
		emit AuctionCreated(id, tokenId, uint64(block.timestamp + numDays * 1 days));
	}

	function bidOnAuction(uint auctionId) external payable {
		require(auctions[auctionId].highestBid < msg.value, "Must bid more than current highest bid");
		require(auctions[auctionId].endTime > block.timestamp, "Auction has ended");
		if(auctions[auctionId].highestBidder != address(this)){
			auctions[auctionId].highestBidder.transfer(auctions[auctionId].highestBid);
		}
		auctions[auctionId].highestBid = msg.value;
		auctions[auctionId].highestBidder = payable(msg.sender);
		emit Bid(auctionId, msg.value);
	}

	function finishAuction(uint auctionId) external {
		require(auctions[auctionId].endTime < block.timestamp, "Auction must have ended");
		require(!auctions[auctionId].finsihed, "Auction has already been claimed");
		_transfer(address(this), auctions[auctionId].highestBidder, auctions[auctionId].tokenId);
		uint aierPay = (auctions[auctionId].highestBid * aierCut) / 1000;
		articles[auctions[auctionId].tokenId].author.payoutAddress.transfer(auctions[auctionId].highestBid - aierPay);
		payoutAddress.transfer(aierPay);
		auctions[auctionId].finsihed = true;
		emit AuctionFinished(auctionId, auctions[auctionId].tokenId, auctions[auctionId].highestBidder, auctions[auctionId].highestBid, auctions[auctionId].highestBid - aierPay, aierPay);
	}

  //The following functions are overrides required by Solidity.

	function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
		return super.supportsInterface(interfaceId);
  }
	
}