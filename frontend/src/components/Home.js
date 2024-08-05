import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';
import SideMenu from './SideMenu';
import profileicon from './assets/profileicon.png';
import sun from './assets/sun.png';
import Mascort from './assets/Mascort.png';
import { FaBars, FaSearch } from 'react-icons/fa';
import { format } from 'date-fns';

import p1 from './assets/p1.jpeg';
import p2 from './assets/p2.jpeg';
import p3 from './assets/p3.jpeg';
import p4 from './assets/p4.jpeg';
import p5 from './assets/p5.jpeg';
import p6 from './assets/p6.jpeg';

const Home = () => {
    const [userData, setUserData] = useState({});
    const [showMenu, setShowMenu] = useState(false);
    const date = new Date();

    const popularMedicines = [
        { name: 'Digesto', image: p1 },
        { name: 'Jaboran', image: p2 },
        { name: 'Drox-24', image: p3 },
        { name: 'Aidoaller', image: p4 },
        { name: 'Goparty', image: p5 },
        { name: 'HC-24', image: p6 }
    ];

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/profile');  // Navigate to the Refer and Earn page
    };

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        fetch(`${process.env.REACT_APP_API_URL}user/${userId}`)
            .then(response => response.json())
            .then(data => setUserData(data))
            .catch(error => console.error('Error fetching user data:', error));
    }, []);

    return (
        <div className="home-container">
            <div className="header">
                <FaBars className="menu-icon" onClick={() => setShowMenu(true)} />
                <img src={profileicon} alt="Profile" className="profile-icon" onClick={handleBack}/>
            </div>
            {showMenu && <SideMenu closeMenu={() => setShowMenu(false)} />}
            <div className="content">
                <div className="date-section">
                    <img src={sun} alt="Sun" className="sun-icon" />
                    <div className="date">{format(date, 'EEE dd MMM').toUpperCase()}</div>
                </div>
                <div className="greeting">
                    <h1>Hi, {userData.name}</h1>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Hair Fall" />
                    <FaSearch className="search-icon" />
                </div>
                <div className="mascot-section">
                    <img src={Mascort} alt="Doctor Mascot" className="mascot-image" />
                    <div className="mascot-text">
                        <h2>Discover Home Remedies for Hair Fall by Dr. Haslab</h2>
                        <button className="learn-more-btn">Learn More</button>
                    </div>
                </div>
                <div className="carousel-dots">
                    <span className="carousel-dot active"></span>
                    <span className="carousel-dot"></span>
                    <span className="carousel-dot"></span>
                </div>
                <div className="popular-medicine-section">
                <div className="popular-medicine-header">
                    <h3 className="popular-medicine-title">Popular Medicine</h3>
                    <a href="#" className="see-all-link">See All</a>
                </div>
                <div className="medicine-grid">
                    {popularMedicines.map((medicine, index) => (
                        <div key={index} className="medicine-item">
                            <img src={medicine.image} alt={medicine.name} className="medicine-image" />
                            <Link to={`/product/${medicine.name}`} className="product-item">
                                <p className="medicine-name">{medicine.name}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div>
    );
};

export default Home;