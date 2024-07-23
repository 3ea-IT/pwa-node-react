import React, { useState } from 'react';
import './wallet.css';
import MenuIcon from './assets/menuIcon.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import LeftArrow from './assets/navleftarrow.png';
import RightArrow from './assets/navrightarrow.png';
import SideMenu from './SideMenu';

const Wallet = () => {
  const [currentMonth, setCurrentMonth] = useState('July 2024');
  const [mediPoints, setMediPoints] = useState(1250);
  const [chartData] = useState([
    { month: 'Mar', value: 20 },
    { month: 'Apr', value: 40 },
    { month: 'May', value: 80 },
    { month: 'Jun', value: 30 },
    { month: 'Jul', value: 50 },
  ]);
  const [pointsVisible, setPointsVisible] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

    const togglePointsVisibility = () => {
        setPointsVisible(!pointsVisible);
    };

  return (
    <div className="wallet">
      <header>
        <img src={MenuIcon} alt="Menu" className="menu-icon" onClick={() => setShowMenu(true)}/>
        <h1>Wallet</h1>
      </header>
      {showMenu && <SideMenu closeMenu={() => setShowMenu(false)} />}
      <div className="medipoints-container">
        <div className="points-container">
          <div className="name-badge">
            <p className="name">Ramesh</p>
          </div>
          <h2>MediPoints</h2>
          <p className="pointsval">{pointsVisible ? mediPoints : '****'}</p>
          <div onClick={togglePointsVisibility} className="view-icon">
                    {pointsVisible ? <FaEye /> : <FaEyeSlash />}
            </div>
        </div>
      </div>

      <div className="date-nav">
        <p className="current-month">{currentMonth}</p>
        <div className="nav-buttons">
            <button className="nav-button left-arrow">
            <img src={LeftArrow} alt="Left Arrow" />
            </button>
            <button className="nav-button right-arrow">
            <img src={RightArrow} alt="Right Arrow" />
            </button>
        </div>
        </div>

      <div className="chart">
        {chartData.map((data, index) => (
          <div key={index} className="bar-container">
            <div 
              className="bar" 
              style={{ height: `${data.value}%` }}
            ></div>
            <p>{data.month}</p>
          </div>
        ))}
      </div>

      <button className="history-button">View History</button>
    </div>
  );
};

export default Wallet;
