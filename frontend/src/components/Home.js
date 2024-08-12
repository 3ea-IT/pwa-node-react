import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';
import SideMenu from './SideMenu';
import profileicon from './assets/profileicon.png';
import sun from './assets/sun.png';
import Mascort from './assets/Mascort.png';
import { FaBars, FaSearch, FaRegBell, FaTimes } from 'react-icons/fa';
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
    const [notificationCount, setNotificationCount] = useState(0);
    const [showNotificationLabel, setShowNotificationLabel] = useState(true);
    const [showSubscribePopup, setShowSubscribePopup] = useState(true);
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

    const handleProfile = () => {
        navigate('/profile'); 
    };
    const handleNotif = () => {
        navigate('/notifications'); 
    };

    const subscribeUser = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY),
                });
    
                const userId = localStorage.getItem('user_id');
                const subscriptionData = {
                    userId,
                    endpoint: subscription.endpoint,
                    keyId: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
                    token: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))),
                };
    
                await fetch(`${process.env.REACT_APP_API_URL}subscribe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(subscriptionData),
                });
    
                setShowSubscribePopup(false);
            } catch (error) {
                console.error('Failed to subscribe the user: ', error);
            }
        } else {
            console.warn('Push messaging is not supported');
        }
    };
    
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
    
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
    
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    
    useEffect(() => {
        const userId = localStorage.getItem('user_id');
    
        // Fetch whether the user has subscribed to notifications
        fetch(`${process.env.REACT_APP_API_URL}check-subscription/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.isSubscribed) {
                    setShowSubscribePopup(false);  // User already subscribed, hide the popup
                } else {
                    setShowSubscribePopup(true);   // User not subscribed, show the popup
                }
            })
            .catch(error => console.error('Error checking subscription status:', error));
    }, []);
    
    useEffect(() => {
        const fetchNotificationCount = () => {
            const userId = localStorage.getItem('user_id');
            if (userId) {
                fetch(`http://localhost:5000/notifications/${userId}`)
                    .then(response => response.json())
                    .then(data => {
                        const unreadCount = data.length;
                        setNotificationCount(unreadCount);
                    })
                    .catch(error => console.error('Error fetching notifications:', error));
            }
        };
    
        fetchNotificationCount();

        if (notificationCount > 0 && showNotificationLabel) {
            const timer = setTimeout(() => {
                setShowNotificationLabel(false);
            }, 5000); // 5 seconds
    
            return () => clearTimeout(timer);
        }
    }, [notificationCount, showNotificationLabel]);  

    return (
        <div className="home-container">
            <div className="home-header">
                <FaBars className="menu-icon" onClick={() => setShowMenu(true)} />
                <div className='notifications'>
                    {notificationCount > 0 && (
                        <div className="notification-badge">{notificationCount}</div>
                    )}
                    <FaRegBell className='bell-icon' onClick={handleNotif}/>
                    <img src={profileicon} alt="Profile" className="profile-icon" onClick={handleProfile}/>
                </div>
            </div>
            {showMenu && <SideMenu closeMenu={() => setShowMenu(false)} />}
            {showNotificationLabel && notificationCount > 0 && (
                <div className="notification-label">
                    <p>You have {notificationCount} unread notifications.</p>
                    <FaTimes className="close-icon" onClick={() => setShowNotificationLabel(false)} />
                    {/* <div className="notification-badge">{notificationCount}</div> */}
                </div>
            )}
            {showSubscribePopup && (
                <div className="subscribe-popup">
                    <p>Subscribe for latest updates</p>
                    <button onClick={subscribeUser}>Allow</button>
                </div>
            )}
            <div className="home-content">
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