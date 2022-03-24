// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FundsReceiver is Ownable {
    event ClaimedTokens(address token, address owner, uint256 amount);

    function claimTokens(address token, uint256 amount) external onlyOwner {
        address payable ownerPayable = payable(owner());
        if (token == address(0)) {
            if (amount == 0) {
                amount = address(this).balance;
            }
            ownerPayable.transfer(amount);
            return;
        }

        if (amount == 0) {
            amount = IERC20(token).balanceOf(address(this));
        }
        IERC20(token).transfer(ownerPayable, amount);

        emit ClaimedTokens(token, ownerPayable, amount);
    }

    fallback() external payable {}

    receive() external payable {}
}
