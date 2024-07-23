import React from 'react';
import './WalletHistory.css';
import { useNavigate } from 'react-router-dom';
import backIcon from './assets/leftarrow.png';
import wallethistory from './assets/wallethistory.png';
import coinIcon from './assets/pointsbag.png';
import gameRemote from './assets/gameremote.png';
import usersIcon from './assets/usersIcon.png'

const WalletHistory = () => {
    const navigate = useNavigate();
    return (
      <div className="wallet-history">
        <header>
          <button className="back-button" onClick={() => navigate(-1)}><img src={backIcon} alt="Back" /></button>
          <h1>Wallet History</h1>
        </header>
        
        <div className="medipoints-card">
          <div className="medipoints-info">
            <h2>MediPoints</h2>
            <p className="points">1250</p>
          </div>
          <img src={wallethistory} className="wallethistory" />
        </div>
        
        <button className="redeem-button">Redeem Now</button>
        
        <p className="subtitle">Trace your spending journey with a glance, wallet history in a nutshell.</p>
        
        <h3>Recent Transactions</h3>
        
        <ul className="transactions-list">
          <li>
            <img src={gameRemote} alt="Coin" />
            <div className="transaction-details">
              <p>Played Tetris</p>
              <span>25 Mar 2024</span>
            </div>
            <span className="points1 positive">+150</span>
          </li>
          <li>
            <img src={usersIcon} alt="Coin" />
            <div className="transaction-details">
              <p>Pranesh joined</p>
              <span>13 Mar 2024</span>
            </div>
            <span className="points1 positive">+250</span>
          </li>
          <li>
            <img src={coinIcon} alt="Coin" />
            <div className="transaction-details">
              <p>Points redeemed</p>
              <span>12 Feb 2024</span>
            </div>
            <span className="points1 negative">-1,000</span>
          </li>
          <li>
            <img src={gameRemote} alt="Coin" />
            <div className="transaction-details">
              <p>Played Quiz</p>
              <span>10 Feb 2024</span>
            </div>
            <span className="points1 positive">+150</span>
          </li>
          <li>
            <img src={coinIcon} alt="Coin" />
            <div className="transaction-details">
              <p>Points redeemed</p>
              <span>12 Feb 2024</span>
            </div>
            <span className="points1 negative">-1,000</span>
          </li>
        </ul>
      </div>
    );
  };
  
  export default WalletHistory;
