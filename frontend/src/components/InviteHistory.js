import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSort } from 'react-icons/fa';
import walletIcon from './assets/wallet.png';
import profile1 from './assets/profile1.png';
import profile2 from './assets/profileicon.png';
import sort from './assets/sort.png';
import './InviteHistory.css';
import axios from 'axios';

const InviteHistory = () => {
    const navigate = useNavigate();
    const [earnedPoints, setEarnedPoints] = useState(0);
    const [recentInvites, setRecentInvites] = useState([]);
    const [invitedFriends, setInvitedFriends] = useState([]);

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        // Fetch earned points
        axios.get(`${process.env.REACT_APP_API_URL}user-wallet/${userId}`)
            .then(response => {
                setEarnedPoints(response.data.wallet);
            })
            .catch(error => {
                console.error('Error fetching earned points:', error);
            });

        // Fetch recent invites and invited friends
        axios.get(`${process.env.REACT_APP_API_URL}user/${userId}`)
            .then(response => {
                const referralCode = response.data.referral_code;

                axios.get(`${process.env.REACT_APP_API_URL}recent-invites/${referralCode}`)
                    .then(response => {
                        setRecentInvites(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching recent invites:', error);
                    });

                axios.get(`${process.env.REACT_APP_API_URL}invited-friends/${referralCode}`)
                    .then(response => {
                        setInvitedFriends(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching invited friends:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [userId]);

    const handleBack = () => {
        navigate('/refer-earn');  // Navigate to the Refer and Earn page
    };

    return (
        <div className="invite-history-container">
            <div className="header-invitehistory">
                <FaArrowLeft className="back-icon-invite" onClick={handleBack} />
                <h2>Invites</h2>
            </div>
            <div className="earned-points-section">
                <div className="points-info">
                    <h3>Earned Points</h3>
                    <h1>{earnedPoints}</h1>
                </div>
                <img src={walletIcon} alt="Wallet Icon" className="wallet-icon" />
            </div>
            <div className="recent-invites-wrapper">
                <h3 className="recent-invites-header">Recent Invites</h3>
                <div className="recent-invites-section">
                    {recentInvites.map((invite, index) => (
                        <div key={index} className="recent-invite">
                            <img src={profile1} alt={invite.name} />
                            <div>
                                <h3>{invite.name}</h3>
                                <h4>{invite.points} <p>Points you earned</p></h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="invited-friends-section">
                <h3>
                    Invited Friends
                    <img className="sort-icon" src={sort}/>
                </h3>
                {invitedFriends.map((friend, index) => (
                    <div key={index} className="friend">
                        <img src={profile2} alt={friend.name} />
                        <div className="friend-info">
                            <h4>{friend.name}</h4>
                            <p>Registered • {friend.date}</p>
                        </div>
                        <div className="pointsinfo">
                            <p className="points-earned">Points you earned</p>
                            <p className="points-invite">{friend.points}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InviteHistory;
