import React, { useState, useEffect } from "react";
import "./PlayEarn.css";
import menuIcon from "./assets/menuIcon.png";
import wallet from "./assets/wallet.png";
import quizIcon from "./assets/brain.png";
import tetris from "./assets/tetris.png";
import tictactoe from "./assets/tictactoe.png";
import bowling from "./assets/bowling.png";
import SideMenu from "./SideMenu";
import axios from "axios";

const PlayEarn = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    axios
      .get(`${process.env.REACT_APP_API_URL}user-wallet/${userId}`)
      .then((response) => {
        setPoints(response.data.wallet);
      })
      .catch((error) => {
        console.error("There was an error fetching the wallet points!", error);
      });
  }, []);

  return (
    <div className="playearn-container">
      <div className="playearn-header">
        <img
          src={menuIcon}
          alt="Menu"
          className="menu-icon"
          onClick={() => setShowMenu(true)}
        />
        <h1 className="header-title1">Play & Earn</h1>
        {showMenu && <SideMenu closeMenu={() => setShowMenu(false)} />}
        <div className="points-container1">
          <img src={wallet} alt="Points" className="points-icon" />
          <span className="points1">{points}</span>
        </div>
      </div>
      <div className="banner">{/* <span>Banner</span> */}</div>
      <div className="games">
        <div className="game-card">
          <a className="play-button" href="/tetris">
            Play
          </a>
          <br />
          <img src={tetris} alt="Tictactoe" className="game-icon" />
          <br />
          <span className="game-name">Play Tetris</span>
        </div>
        <div className="game-card">
          <a href="/tictactoe" className="play-button">
            Play
          </a>
          <br />
          <img src={tictactoe} alt="Tetris" className="game-icon" />
          <br />
          <span className="game-name">Play Tictactoe</span>
        </div>
        {/* <div className="game-card">
          <a href="/bowling" className="play-button">
            Play
          </a>
          <br />
          <img src={bowling} alt="Bowling" className="game-icon" />
          <br />
          <span className="game-name">Play Bowling</span>
        </div> */}
        <div className="game-card">
          <a href="/quiz" className="play-button">
            Play
          </a>
          <br />
          <img src={quizIcon} alt="Quiz" className="game-icon" />
          <br />
          <span className="game-name">Play Quiz</span>
        </div>
      </div>
    </div>
  );
};

export default PlayEarn;
