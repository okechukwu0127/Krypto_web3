
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


contract Transactions {

    uint256 transactionsCounter;

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword );
    
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;

    }

    TransferStruct[] transactions; 

    function addToBlockChain(address payable receiver, uint amount, string memory message, string memory keyword) public
    {
        transactionsCounter +=1;

        //store transaction to array
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));
        
        //trigger transfer event
        emit Transfer((msg.sender), receiver, amount, message, block.timestamp, keyword);



    }
                                                       //return data structure
    function getAllTransactions() public view returns (TransferStruct[] memory)
    {
         return transactions;

    }
                                                    //return a number/count
    function getAllTransactionsCount() public view returns(uint256)
    {
        return transactionsCounter;
    }
}
