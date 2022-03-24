// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FundsReceiver is Ownable {
    event ClaimedTokens(address token, address owner, uint256 amount);

    function claimTokens(address token, uint256 amount) external onlyOwner {
        address payable ownerPayable = payable(owner());
        if (token == address(0)) {
            ownerPayable.transfer(amount);
            return;
        }

        IERC20(token).transfer(ownerPayable, amount);

        emit ClaimedTokens(token, ownerPayable, amount);
    }

    fallback() external payable {}

    receive() external payable {}
}
