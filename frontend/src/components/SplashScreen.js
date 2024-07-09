import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';
import logo from './assets/Mascort.png';

const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/get-started');
        }, 3000); // Redirect after 3 seconds

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, [navigate]);

    return (
        <div className="splash-screen">
            <img src={logo} alt="Dr. Haslab" className="splash-logo" />
        </div>
    );
};

export default SplashScreen;
