import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Wallet.css';

const Wallet = () => {
    const [points, setPoints] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        if (!userId || !token) {
            setError('User not logged in');
            return;
        }
        
        console.log('Fetching points for user:', userId);
        
        axios.get(`${process.env.REACT_APP_API_URL}user-points/${userId}`, {
            headers: {
                'x-access-token': token
            }
        })
        .then(response => {
            console.log('Fetched points:', response.data);
            setPoints(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the points!', error);
            setError('There was an error fetching the points!');
        });
    }, []);

    return (
        <div className="wallet-container">
            <Navbar />
            <h2>Wallet</h2>
            {error && <p className="error">{error}</p>}
            {points.length > 0 ? (
                <ul>
                    {points.map(point => (
                        <li key={point.id}>
                            Points: {point.points}, Type: {point.type}, Remark: {point.remark}, Date: {point.date}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No points found.</p>
            )}
        </div>
    );
};

export default Wallet;
