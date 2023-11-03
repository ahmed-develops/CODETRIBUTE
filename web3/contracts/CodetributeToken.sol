// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CodetributeToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Codetribute","CTKN") {
        _mint(msg.sender, initialSupply);
    }

    function decimals() public view virtual override returns(uint8) {
        return 1;
    }
}