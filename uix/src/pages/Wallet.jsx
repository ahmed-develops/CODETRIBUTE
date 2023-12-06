import React, { useEffect, useState } from "react";
import Web3 from "web3";
import PropTypes from "prop-types";
import TokenABI from "./TokenABI.json";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";

const Wallet = ({ loginCredentials }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [incomingTxHistory, setIncomingTxHistory] = useState(null);
  const [outgoingTxHistory, setOutgoingTxHistory] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);

  useEffect(() => {
    if (loginCredentials) {
      loadWallet();
    }
  }, [loginCredentials]);

  const loadWallet = async () => {
    try {
      const getWalletFromDatabase = await fetch(
        `http://localhost:3300/get/wallet/${loginCredentials.user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const wallet = await getWalletFromDatabase.json();

      console.log(wallet);
      if (wallet.status === 200) {
        fetchIncomingTransactionHistory();
        fetchOutgoingTransactionHistory();

        setWalletAddress(wallet.accountAddress);
        const web3 = new Web3(
          "https://eth-sepolia.g.alchemy.com/v2/f_R62a50s5Tn4qsHaz0n0AyoIUkwzXAG"
        );
        const tokenAddress = "0xe2ca36365E40e81A8185bB8986d662501dF5F6f2";
        const tokenAbi = TokenABI;
        const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);

        const userAddress = wallet.accountAddress;
        const tokenBalance = await tokenContract.methods
          .balanceOf(userAddress)
          .call();
        setTokenBalance(tokenBalance);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIncomingTransactionHistory = async () => {
    try {
      const getIncomingHistory = await fetch(
        `http://localhost:3300/get/tx/incoming/${loginCredentials.user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const incomingHistory = await getIncomingHistory.json();

      if (Array.isArray(incomingHistory)) {
        setIncomingTxHistory(incomingHistory);
      } else {
        setIncomingTxHistory([incomingHistory]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOutgoingTransactionHistory = async () => {
    try {
      const getOutgoingHistory = await fetch(
        `http://localhost:3300/get/tx/outgoing/${loginCredentials.user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const outgoingHistory = await getOutgoingHistory.json();

      if (Array.isArray(outgoingHistory)) {
        setOutgoingTxHistory(outgoingHistory);
      } else {
        setOutgoingTxHistory([outgoingHistory]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderIncomingTransactionTable = () => {
    return (
      <div className="projects-container">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Receiver Wallet ID</th>
              <th>Sender Wallet ID</th>
              <th>Tokens Transferred</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {incomingTxHistory ? (
              incomingTxHistory.map((val, i) => (
                <tr key={i}>
                  <td>{val.transaction_id}</td>
                  <td>{val.receiver_user_id}</td>
                  <td className="path-cell">{val.sender_user_id}</td>
                  <td className="path-cell">{val.amount}</td>
                  <td>{val.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No transaction history available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderOutgoingTransactionTable = () => {
    return (
      <div className="projects-container">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Receiver Wallet ID</th>
              <th>Sender Wallet ID</th>
              <th>Tokens Transferred</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {outgoingTxHistory ? (
              outgoingTxHistory.map((val, i) => (
                <tr key={i}>
                  <td>{val.transaction_id}</td>
                  <td>{val.receiver_user_id}</td>
                  <td className="path-cell">{val.sender_user_id}</td>
                  <td className="path-cell">{val.amount}</td>
                  <td>{val.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No transaction history available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <center>
        <NavLink to={`/${loginCredentials?.privilege}-portal`} className="btn btn-primary">
          Go Back
        </NavLink>
        <br />
        <br />
      </center>
      {walletAddress ? (
        <>
          <h1>Wallet Number: {walletAddress}</h1>
          <h1>Token Balance: {tokenBalance}</h1>
          <hr />
          <fieldset>INCOMING TRANSACTIONS</fieldset>
          <hr />
          {renderIncomingTransactionTable()}
          <br />
          <hr />
          <fieldset>OUTGOING TRANSACTIONS</fieldset>
          <hr />
          {renderOutgoingTransactionTable()}
        </>
      ) : (
        <>
        <h1>You do not have a wallet</h1>
        <Button onClick={
          async () => {
            try {
              if (window.ethereum) {
                const accounts = await window.ethereum.request({
                  method: 'eth_requestAccounts',
                });
        
                const userWalletAddress = accounts[0];
                
                alert(`Web3 wallet linked. User address: ${userWalletAddress}`);
                
                setWalletAddress(userWalletAddress);

                const addWallet = await fetch(`http://localhost:3300/update/wallet/${loginCredentials.user_id}/${userWalletAddress}`,{
                 method: 'POST',
                 headers: {
                  'Content-Type' : 'application/json'
                 } 
                });

                const resAddWallet = await addWallet.json();

                if (resAddWallet.status === 200) {
                  setWalletAddress(userWalletAddress);
                }
                
                window.location.reload();
              } else {
                console.error('Web3 not found. Please install MetaMask or another Web3 wallet.');
              }
            } catch (error) {
              console.error('Error linking Web3 wallet:', error);
            }
          }
        }>Click here to link your web3 wallet to your account</Button>
        </>
      )}
    </>
  );
};

Wallet.propTypes = {
  setWalletAdress: PropTypes.func.isRequired,
};

export default Wallet;
