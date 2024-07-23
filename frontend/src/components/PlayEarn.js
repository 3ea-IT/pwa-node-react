import React from 'react';
import { useState } from 'react';
import './PlayEarn.css';
import menuIcon from './assets/menuIcon.png'; 
import wallet from './assets/wallet.png'; 
import quizIcon from './assets/brain.png'; 
import SideMenu from './SideMenu';

const PlayEarn = () => {
    const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="playearn-container">
      <div className="playearn-header">
        <img src={menuIcon} alt="Menu" className="menu-icon" onClick={() => setShowMenu(true)}/>
        <h1 className="header-title1">Play & Earn</h1>
        {showMenu && <SideMenu closeMenu={() => setShowMenu(false)} />}
        <div className="points-container1">
          <img src={wallet} alt="Points" className="points-icon" />
          <span className="points1">1220</span>
        </div>
      </div>
      <div className="banner">
        <span>Banner</span>
      </div>
      <div className="games">
        <div className="game-card">
          <a className="play-button" href="/quiz">Play</a>
          <br></br>
          <img src={quizIcon} alt="Tictactoe" className="game-icon" />
          <br></br>
          <span className="game-name">Play Quiz</span>
        </div>
        <div className="game-card">
          <div className="play-button">Play</div>
          <br></br>
          <img src={quizIcon} alt="Tetris" className="game-icon" />
          <br></br>
          <span className="game-name">Play Quiz</span>
        </div>
        <div className="game-card">
          <div className="play-button">Play</div>
          <br></br>
          <img src={quizIcon} alt="Bowling" className="game-icon" />
          <br></br>
          <span className="game-name">Play Quiz</span>
        </div>
        <div className="game-card">
          <div className="play-button">Play</div>
          <br></br>
          <img src={quizIcon} alt="Quiz" className="game-icon" />
          <br></br>
          <span className="game-name">Play Quiz</span>
        </div>
      </div>
    </div>
  );
};

export default PlayEarn;
