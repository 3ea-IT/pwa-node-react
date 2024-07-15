import React, { useState } from 'react';
import SideMenu from './SideMenu';
import { FaBars, FaLinkedin, FaWhatsapp, FaFacebook, FaTimes } from 'react-icons/fa';
import inviteIcon from './assets/inviteIcon.png';
import whatsappIcon from './assets/whatsappIcon.png';
import linkedinIcon from './assets/linkedinIcon.png';
import facebookIcon from './assets/image 17.png';
import tick from './assets/tick.png'
import './ReferAndEarn.css';

function ReferAndEarn() {
    const [showMenu, setShowMenu] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('https://3ea.in/invite/?ref=ajsdgh');
        alert('Link copied to clipboard!');
    };

    return (
        <div className="refer-earn-container">
            <header className="header">
                <FaBars className="menu-icon" onClick={() => setShowMenu(true)} />
                <h1 className="header-title">Refer & Earn</h1>
            </header>
            {showMenu && <SideMenu closeMenu={() => setShowMenu(false)} />}
            <div className="content">
                <div className="track-button-container">
                    <button className="track-button"> <a href="/invite-history">Track Invites</a></button>
                </div>

                <div className="invite-box">
                    <img src={inviteIcon} alt="Invite Icon" className="invite-icon" />
                    <h2>INVITE YOUR FRIEND AND EARN 100</h2>
                    <p>Share your link</p>

                    <div className="share-link">
                        <input
                            type="text"
                            value="https://3ea.in/invite/?ref=ajsdgh"
                            readOnly
                        />
                        <button className="copy-button" onClick={handleCopy}>Copy</button>
                    </div>

                    <div className="social-icons">
                        <img src={linkedinIcon} className="icon" />
                        <img src={whatsappIcon} assName="icon" />
                        <img src={facebookIcon} className="icon" />
                    </div>
                </div>

                <div className="rewards-info">
                    <div className="reward-box">
                        <h3>You'll get</h3>
                        <p><img src={tick}/> 50 when friends register using your code.</p>
                    </div>
                    <div className="reward-box">
                        <h3>They'll get</h3>
                        <p><img src={tick}/> 100 when they register using your code.</p>
                    </div>
                </div>

                <a href="#" className="terms">Terms and Conditions</a>
            </div>
        </div>
    );
}

export default ReferAndEarn;
