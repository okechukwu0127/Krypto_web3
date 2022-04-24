import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);

  const signer = provider.getSigner();

  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;

  //console.log({ provider, signer, transactionContract });
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );

  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  const getAllTransactions = async () => {
    try {
      //check if Meta mask is install
      if (!ethereum) return alert("Please install MetamMask");
      const transactionContract = getEthereumContract();

      const availableTransactions =
        await transactionContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map(
        (transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        })
      );

      //console.log(availableTransactions);
      //console.log(structuredTransactions);

      setTransactions(structuredTransactions);
    } catch (error) {
      console.log(error);
      //throw new Error("No Ethereum Object!!");
    }
  };

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  //check if user have connected account with application
  const checkIfWalletIsConnected = async () => {
    try {
      //check if Meta mask is install
      if (!ethereum) return alert("Please install MetamMask");

      //Get our meta Mask connected account
      const account = await ethereum.request({ method: "eth_accounts" });

      if (account.length) {
        setCurrentAccount(account[0]);

        getAllTransactions();
      } else {
        console.log("No Accounts Found");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object!");
    }

    //console.log(account)
  };

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount =
        await transactionContract.getAllTransactionsCount();

      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object!!");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetamMask");
      //get all the accounts while user chooses to connect one
      const account = await ethereum.request({ method: "eth_requestAccounts" });

      setCurrentAccount(account[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object.");
    }
  };

  const sendTransaction = async () => {
    try {
      //check if Meta mask is install
      if (!ethereum) return alert("Please install MetamMask");

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();

      const parseAmount = ethers.utils.parseEther(amount);

      //Do your Transaction using Ether
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", //HEX decimal Gas amount - which is 21000 of Gwei which is equivalent to 0.000021 of Ether
            value: parseAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockChain(
        addressTo,
        parseAmount,
        message,
        keyword
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);

      await transactionHash.wait();

      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount =
        await transactionContract.getAllTransactionsCount();

        setTransactionCount(transactionCount.toNumber());
        window.reload()
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object!!");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleChange,
        transactions,
        sendTransaction,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
