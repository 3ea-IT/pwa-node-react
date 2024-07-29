import React, { useEffect, useState } from 'react';
import './WalletHistory.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backIcon from './assets/leftarrow.png';
import wallethistory from './assets/wallethistory.png';
import coinIcon from './assets/pointsbag.png';
import gameRemote from './assets/gameremote.png';
import usersIcon from './assets/usersIcon.png';

const WalletHistory = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      const userId = localStorage.getItem('user_id');
      try {
        const response = await axios.get(`http://localhost:5000/user-wallet/${userId}`);
        console.log('User wallet data:', response.data); // Debugging line
        setPoints(response.data.wallet);
      } catch (error) {
        console.error('Error fetching wallet points:', error);
      }
    };

    const fetchTransactions = async () => {
      const userId = localStorage.getItem('user_id');
      try {
        const response = await axios.get(`http://localhost:5000/transactions/${userId}`);
        console.log('Transactions data:', response.data); // Debugging line
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchWalletData();
    fetchTransactions();
  }, []);

  const getTransactionDescription = (source) => {
    switch (source) {
      case 'PEARN':
        return 'Played Quiz';
      case 'RB':
        return 'Referral Bonus';
      case 'JBR':
        return 'Joining Bonus via Referral';
      case 'DJB':
        return 'Direct Joining Bonus';
      default:
        return 'Transaction';
    }
  };

  const getTransactionIcon = (source) => {
    switch (source) {
      case 'PEARN':
        return gameRemote;
      case 'RB':
      case 'JBR':
      case 'DJB':
        return usersIcon;
      default:
        return coinIcon;
    }
  };

  return (
    <div className="wallet-history">
      <header>
        <button className="back-button" onClick={() => navigate(-1)}><img src={backIcon} alt="Back" /></button>
        <h1>Wallet History</h1>
      </header>
      
      <div className="medipoints-card">
        <div className="medipoints-info">
          <h2>MediPoints</h2>
          <p className="points">{points}</p>
        </div>
        <img src={wallethistory} className="wallethistory" alt="Wallet History"/>
      </div>
      
      <button className="redeem-button">Redeem Now</button>
      
      <p className="subtitle">Trace your spending journey with a glance, wallet history in a nutshell.</p>
      
      <h3>Recent Transactions</h3>
      
      <ul className="transactions-list">
        {transactions.map((transaction, index) => (
          <li key={index}>
            <img src={getTransactionIcon(transaction.source)} alt="Transaction Icon" />
            <div className="transaction-details">
              <p>{getTransactionDescription(transaction.source)}</p>
              <span>{new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <span className={`points1 ${transaction.type === 'cr' ? 'positive' : 'negative'}`}>{transaction.type === 'cr' ? `+${transaction.points}` : `-${transaction.points}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WalletHistory;
