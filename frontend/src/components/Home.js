import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to PWA</h1>
            <div className="button-container">
                <Link to="/login">
                    <button className="home-button">Login</button>
                </Link>
                <Link to="/signup">
                    <button className="home-button">Signup</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
