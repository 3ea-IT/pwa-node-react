import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage
                const response = await axios.get(`${process.env.REACT_APP_API_URL}notifications/${userId}`);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
    };

    const handleCloseModal = () => {
        if (selectedNotification) {
            axios.post(`${process.env.REACT_APP_API_URL}mark-notification-read`, { notificationId: selectedNotification.id })
                .then(() => {
                    // Remove the read notification from the list
                    setNotifications(prevNotifications => 
                        prevNotifications.filter(notif => notif.id !== selectedNotification.id)
                    );
                    setSelectedNotification(null);
                    
                    // Update notification count
                    const userId = localStorage.getItem('user_id');
                    fetch(`${process.env.REACT_APP_API_URL}notifications/${userId}`)
                        .then(response => response.json())
                        .then(data => {
                            const unreadCount = data.length;
                            setNotificationCount(unreadCount);
                        })
                        .catch(error => console.error('Error fetching notifications:', error));
                })
                .catch(error => console.error('Error marking notification as read:', error));
        }
    };      

    return (
        <div className="notifications-container">
            <div className="header-notif">
                <FaArrowLeft className="back-icon-header" onClick={() => navigate(-1)} />
                <h2>Notifications</h2>
            </div>
            <div className="notifications-list">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div key={notification.id} className="notification-item" onClick={() => handleNotificationClick(notification)}>
                            <p>{notification.msg}</p>
                            <span className="timestamp">{new Date(notification.date).toLocaleString()}</span>
                        </div>
                    ))
                ) : (
                    <p className="no-notifications">No notifications to show</p>
                )}
            </div>
            {selectedNotification && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <p>{selectedNotification.msg}</p>
                        <span className="timestamp">{new Date(selectedNotification.date).toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
