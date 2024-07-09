import React from 'react';
import Navbar from './Navbar';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1>Dashboard</h1>
            </div>
        </div>
    );
};

export default Dashboard;
