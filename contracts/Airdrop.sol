// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Airdrop is Ownable {
    IERC20 public token;

    constructor(
        address initialOwner,
        address _tokenAddress
    ) Ownable(initialOwner) {
        require(_tokenAddress != address(0), "Token address cannot be zero");
        token = IERC20(_tokenAddress);
    }

    function distribute(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(
            recipients.length == amounts.length,
            "Recipients and amounts must match"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            require(
                recipients[i] != address(0),
                "Recipient address cannot be zero"
            );
            require(amounts[i] > 0, "Amount must be greater than zero");

            require(
                token.transfer(recipients[i], amounts[i]),
                "Token transfer failed"
            );
        }
    }

    function withdrawRemaining(address to) external onlyOwner {
        require(to != address(0), "Withdraw address cannot be zero");
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");

        require(token.transfer(to, balance), "Token transfer failed");
    }
}
