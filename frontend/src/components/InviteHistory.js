import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSort } from 'react-icons/fa';
import walletIcon from './assets/wallet.png';
import profile1 from './assets/profile1.png';
import profile2 from './assets/profileicon.png';
import sort from './assets/sort.png';
import './InviteHistory.css';

const InviteHistory = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/refer-earn');  // Navigate to the Refer and Earn page
    };

    return (
        <div className="invite-history-container">
            <div className="header">
                <FaArrowLeft className="back-icon" onClick={handleBack} />
                <h2>Invites</h2>
            </div>
            <div className="earned-points-section">
                <div className="points-info">
                    <h3>Earned Points</h3>
                    <h1>1,500</h1>
                </div>
                <img src={walletIcon} alt="Wallet Icon" className="wallet-icon" />
            </div>
            <div className="recent-invites-wrapper">
                <h3 className="recent-invites-header">Recent Invites</h3>
                <div className="recent-invites-section">
                    <div className="recent-invite">
                        <img src={profile1} alt="Bruce Banner" />
                        <div>
                            <h3>Bruce Banner</h3>
                            <h4>100 <p>Points you earned</p></h4>
                        </div>
                    </div>
                    <div className="recent-invite">
                        <img src={profile2} alt="Tony Stark" />
                        <div>
                            <h3>Tony Stark</h3>
                            <h4>100 <p>Points you earned</p></h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="invited-friends-section">
                <h3>
                    Invited Friends
                    <img className="sort-icon" src={sort}/>
                </h3>
                <div className="friend">
                    <img src={profile1} alt="Tony Stark" />
                    <div className="friend-info">
                        <h4>Tony Stark</h4>
                        <p>Registered • Today</p>
                    </div>
                    <div className="pointsinfo">
                        <p className="points-earned">Points you earned</p>
                        <p className="points">100</p>
                    </div>
                </div>
                <div className="friend">
                    <img src={profile2} alt="Bruce Banner" />
                    <div className="friend-info">
                        <h4>Bruce Banner</h4>
                        <p>Registered • April 29</p>
                    </div>
                    <div className="pointsinfo">
                        <p className="points-earned">Points you earned</p>
                        <p className="points">100</p>
                    </div>
                </div>
                <div className="friend">
                    <img src={profile1} alt="Captain America" />
                    <div className="friend-info">
                        <h4>Captain America</h4>
                        <p>Registered • April 28</p>
                    </div>
                    <div className="pointsinfo">
                        <p className="points-earned">Points you earned</p>
                        <p className="points">50</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteHistory;
