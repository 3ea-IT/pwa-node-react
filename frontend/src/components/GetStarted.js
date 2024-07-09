// src/components/GetStarted.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GetStarted.css';
import logo from './assets/Mascort.png';

const GetStarted = () => {
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/signup');
    };

    const handleSignIn = () => {
        navigate('/login');
    };

    return (
        <div className="get-started-screen">
            <img src={logo} alt="Logo" className="get-started-logo" />
            <h1 className="get-started-title">Let's Get Started!</h1>
            <p className="get-started-description">
                Sign in to enjoy the features we’ve provided and stay healthy!
            </p>
            <button className="get-started-button signup" onClick={handleSignUp}>
                Sign UP
            </button>
            <button className="get-started-button signin" onClick={handleSignIn}>
                Sign In
            </button>
        </div>
    );
};

export default GetStarted;
