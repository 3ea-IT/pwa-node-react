import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './wallet.css';
import MenuIcon from './assets/menuIcon.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import LeftArrow from './assets/navleftarrow.png';
import RightArrow from './assets/navrightarrow.png';
import SideMenu from './SideMenu';
import { format } from 'date-fns';

const Wallet = () => {
  const [userName, setUserName] = useState('');
  const [mediPoints, setMediPoints] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [pointsVisible, setPointsVisible] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}user/${userId}`);
        const walletResponse = await axios.get(`${process.env.REACT_APP_API_URL}user-wallet/${userId}`);
        const pointsResponse = await axios.get(`${process.env.REACT_APP_API_URL}user-points-history/${userId}`);

        setUserName(userResponse.data.name);
        setMediPoints(walletResponse.data.wallet);

        const processedChartData = pointsResponse.data.map(data => ({
          month: format(new Date(`${data.month}-01`), 'MMM'), // Format to short month name
          value: data.value
        }));

        setChartData(processedChartData);
        console.log('Chart Data:', processedChartData); // Log chart data for debugging
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const togglePointsVisibility = () => {
    setPointsVisible(!pointsVisible);
  };

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/wallet-history`;
    navigate(path);
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="wallet">
      <header>
        <img src={MenuIcon} alt="Menu" className="menu-icon" onClick={() => setShowMenu(true)} />
        <h1>Wallet</h1>
      </header>
      {showMenu && <SideMenu closeMenu={() => setShowMenu(false)} />}
      <div className="medipoints-container">
        <div className="points-container">
          <div className="name-badge">
            <p className="name">{userName}</p>
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
        {chartData.length > 0 ? (
          chartData.map((data, index) => (
            <div key={index} className="bar-container">
              <div 
                className="bar" 
                style={{ height: `${data.value}px` }} // Ensure the height is set in pixels and scaled appropriately
              ></div>
              <p>{data.month}</p>
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>

      <button className="history-button" onClick={routeChange}>View History</button>
    </div>
  );
};

export default Wallet;
