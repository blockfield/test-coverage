// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenMock is ERC20 {
    constructor() ERC20("Mock Token", "MOCK") {}

    function mint(address _holder, uint256 _value) external {
        _mint(_holder, _value);
    }
}
