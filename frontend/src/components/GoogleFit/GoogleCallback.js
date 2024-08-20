import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/auth/google/callback')
          .then(response => {
            console.log('Google auth response:', response.data);
            localStorage.setItem('token', response.data.token);
            console.log('Token set in localStorage:', localStorage.getItem('token'));
            navigate('/fitness-data');
          })
          .catch(error => {
            console.error('Error during Google authentication:', error);
            navigate('/home');
          });
      }, [navigate]);

    return <div>Processing Google Login...</div>;
};

export default GoogleCallback;
