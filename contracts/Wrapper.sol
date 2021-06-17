//SPDX-License-Identifier: mit
pragma solidity >=0.7.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Wrapper is ERC20 {  
  constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {}

  function swap(address token_, uint amount) external {
    IERC20 swapToken = IERC20(token_);
    require(swapToken.transferFrom(msg.sender, address(this), amount));
    _mint(msg.sender, amount);
  }

  function unswap(address token_, uint amount) external {
    require(balanceOf(msg.sender) >= amount, 'Not have enough token');
    IERC20 swapToken = IERC20(token_);
    require(swapToken.transfer(msg.sender, amount));
    _burn(msg.sender, amount);
  }
}