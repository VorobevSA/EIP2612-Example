// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract CollectableToken is ERC20, ERC20Permit {
    constructor()
        ERC20("CollectableToken", "CT")
        ERC20Permit("CollectableToken") 
    {
       //MINT to the creator's address.
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    //Unrestricted MINT for example only.
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
