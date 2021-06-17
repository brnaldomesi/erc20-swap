//SPDX-License-Identifier: mit
pragma solidity >=0.7.0;
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract ERC20Mock is ERC20 {
  constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
    _mint(msg.sender, 1000);
  }
  function mint(uint amount) public {
    _mint(msg.sender, amount);
  }
}