// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public Token;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    


    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        Token = 0;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        require(msg.sender == owner, "You are not the owner of this account");
        balance += _amount;

        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
    
    function increment() public {
        Token++;
    }

    function decrement() public {
        Token--;
    }
    
}
