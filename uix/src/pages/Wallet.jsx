// import React, { useEffect, useState } from "react";
// import Web3 from 'web3';
// import PropTypes from 'prop-types';

// const Wallet = ({ loginCredentials }) => {
//     const [walletInfo, setWalletInfo] = useState(null);
//     const [txHistory, setTxHistory] = useState(null);

//     useEffect(() => {
//         loadWallet();
//     }, [loginCredentials.user_id]);
    
//     const loadWallet = async () => {
//         try {
//             if (window.ethereum) {
//                 const web3 = new Web3(window.ethereum);
//                 const accounts = await window.ethereum.request({
//                     method: 'eth_requestAccounts'
//                 });
//                 const balance_wei = await web3.eth.getBalance(accounts[0]);
//                 const balance = web3.utils.fromWei(balance_wei, 'ether');

//                 setWalletInfo({
//                     web3: web3,
//                     balance: balance,
//                     account: accounts[0]
//                 });

//                 fetchTransactionHistory();
//             } else {
//                 throw new Error('Web3 not available');
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const fetchTransactionHistory = async () => {
//         try {
//             const getHistory = await fetch(`http://localhost:3300/get/history/${loginCredentials.user_id}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             const history = await getHistory.json();

//             if (Array.isArray(history)) {
//                 setTxHistory(history);
//             } else {
//                 setTxHistory([history]);
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const renderTransactionTable = () => {
//         return (
//             <div className="projects-container">
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Transaction ID</th>
//                             <th>Receiver Wallet ID</th>
//                             <th>Sender Wallet ID</th>
//                             <th>Tokens Transferred</th>
//                             <th>Timestamp</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {txHistory ? (
//                             txHistory.map((val, i) => (
//                                 <tr key={i}>
//                                     <td>{val.transaction_id}</td>
//                                     <td>{val.receiver_wallet_id}</td>
//                                     <td className="path-cell">{val.sender_wallet_id}</td>
//                                     <td className="path-cell">{val.tokens_transferred}</td>
//                                     <td>{val.timestamp}</td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="6">No transaction history available</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         );
//     };

//     return (
//         <>
//             <h1>Wallet Number: {walletInfo?.account}</h1>
//             <h1>Wallet Balance: {walletInfo?.balance}</h1>
//             <hr />
//             <fieldset>TRANSACTIONS</fieldset>
//             <hr />
//             {renderTransactionTable()}
//         </>
//     );
// };

// Wallet.propTypes = {
//     setWalletInfo: PropTypes.func.isRequired,
// };

// export default Wallet;

import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import PropTypes from 'prop-types';

import TokenABI from './TokenABI.json';

const Wallet = ({ loginCredentials }) => {
    const [walletInfo, setWalletInfo] = useState(null);
    const [txHistory, setTxHistory] = useState(null);
    const [tokenBalance, setTokenBalance] = useState(null);

    useEffect(() => {
        loadWallet();
    }, [loginCredentials.user_id]);

    const loadWallet = async () => {
        try {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                const balance_wei = await web3.eth.getBalance(accounts[0]);
                const balance = web3.utils.fromWei(balance_wei, 'ether');

                setWalletInfo({
                    web3: web3,
                    balance: balance,
                    account: accounts[0]
                });

                fetchTransactionHistory();

                // Fetch token balance
                const tokenAddress = '0xe2ca36365E40e81A8185bB8986d662501dF5F6f2';  // Replace with your token's address
                const tokenAbi = TokenABI;  // Replace with your token's ABI
                const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);

                const userAddress = accounts[0];
                const tokenBalance = await tokenContract.methods.balanceOf(userAddress).call();
                setTokenBalance(tokenBalance);
            } else {
                throw new Error('Web3 not available');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTransactionHistory = async () => {
        try {
            const getHistory = await fetch(`http://localhost:3300/get/history/${loginCredentials.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const history = await getHistory.json();

            if (Array.isArray(history)) {
                setTxHistory(history);
            } else {
                setTxHistory([history]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderTransactionTable = () => {
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
                        {txHistory ? (
                            txHistory.map((val, i) => (
                                <tr key={i}>
                                    <td>{val.transaction_id}</td>
                                    <td>{val.receiver_wallet_id}</td>
                                    <td className="path-cell">{val.sender_wallet_id}</td>
                                    <td className="path-cell">{val.tokens_transferred}</td>
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
            <h1>Wallet Number: {walletInfo?.account}</h1>
            <h1>Wallet Balance: {walletInfo?.balance}</h1>
            <h1>Token Balance: {tokenBalance}</h1>
            <hr />
            <fieldset>TRANSACTIONS</fieldset>
            <hr />
            {renderTransactionTable()}
        </>
    );
};

Wallet.propTypes = {
    setWalletInfo: PropTypes.func.isRequired,
};

export default Wallet;
