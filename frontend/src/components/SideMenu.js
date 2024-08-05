import React from 'react';
import './SideMenu.css';
import { FaTimes, FaUser, FaWallet, FaGamepad, FaShareAlt, FaSignOutAlt, FaHome } from 'react-icons/fa';
import profileicon from './assets/profileicon.png';

const SideMenu = ({ closeMenu }) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        window.location.href = '/login';
    };

    const userId = localStorage.getItem('user_id');
    const [userData, setUserData] = React.useState({});

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}user/${userId}`)
            .then(response => response.json())
            .then(data => setUserData(data))
            .catch(error => console.error('Error fetching user data:', error));
    }, [userId]);

    return (
        <div className="side-menu">
            <FaTimes className="close-icon" onClick={closeMenu} />
            <div className="profile-section">
                <img src={profileicon} alt="Profile" />
                <h2>{userData.name}</h2>
                <p>{userData.mob}</p>
            </div>
            <div className="menu-items">
                <a href='/home'><FaHome />Home</a>
                <a href="/profile"><FaUser />Profile</a>
                <a href="/wallet"><FaWallet />Wallet</a>
                <a href="/playearn"><FaGamepad />Play & Earn</a>
                <a href="/refer-earn"><FaShareAlt />Refer & Earn</a>
                <button onClick={handleLogout}><FaSignOutAlt />Logout</button>
            </div>
        </div>
    );
};

export default SideMenu;
