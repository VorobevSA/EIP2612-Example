// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

interface IERC20PermitWithTransger {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract YourNewToken is ERC20, ERC20Permit  {

    address owner; 
    address cTokenAddress;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    constructor(address collectableTokenAddress) 
    ERC20("YourNewToken", "YNT") 
    ERC20Permit("YourNewToken") 
    {
        cTokenAddress = collectableTokenAddress;

        owner = msg.sender;
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address to, 
        uint256 amount
    ) public {
        IERC20PermitWithTransger  cToken = IERC20PermitWithTransger(cTokenAddress);
        cToken.permit(msg.sender, address(this), amount, deadline, v, r, s);
        require(cToken.transferFrom(msg.sender, address(this), amount), "Transfer CollectableToken failed");
        _mint(to, amount);
    }

    function withdrawCollectableToken(address recipient) public onlyOwner {
        IERC20 token = IERC20(cTokenAddress);
        uint256 contractBalance = token.balanceOf(address(this));        
        require(token.transfer(recipient, contractBalance), "Token transfer from YourNewToken failed");
    }

}
