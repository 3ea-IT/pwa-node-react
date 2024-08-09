import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SideMenu from './SideMenu';
import { FaBars } from 'react-icons/fa';
import inviteIcon from './assets/inviteIcon.png';
import whatsappIcon from './assets/whatsappIcon.png';
import linkedinIcon from './assets/linkedinIcon.png';
import facebookIcon from './assets/image 17.png';
import tick from './assets/tick.png';
import './ReferAndEarn.css';

let refcode = '';
function ReferAndEarn() {
    const [showMenu, setShowMenu] = useState(false);
    const [referralCode, setReferralCode] = useState('');
    const [textToCopy, setTextToCopy] = useState('');
    const userId = localStorage.getItem('user_id');
    const [code,setcode]=useState(`${process.env.REACT_APP_BASE_URL}Signup?ref=gfghf`);
    const refcode = localStorage.getItem('ref_code');
    
    

    useEffect(() => {
        const fetchReferralCode = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}user/${userId}`);
                const code = response.data.referral_code;
                localStorage.setItem('ref_code', response.data.referral_code);
                console.log(code);
                setReferralCode(code);
               
                setTextToCopy(`${process.env.REACT_APP_BASE_URL}signup?ref=${code}`);

                refcode = code;
            } catch (error) {
                console.error('Error fetching referral code:', error);
            }
        };

        fetchReferralCode();
    }, [userId]);

    const handleCopy = () => {
        const referralLink = `${process.env.REACT_APP_BASE_URL}signup?ref=${referralCode}`;
        navigator.clipboard.writeText(referralLink);
        alert('Referral link copied to clipboard!');
    };

    const CopyText = () => {
        navigator.clipboard.writeText(code)
            .then(() => {
                alert('Copied to clipboard');
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    useEffect(() => {
        const shareButton = document.getElementById('shareButton');
        if (navigator.share) {
            shareButton.addEventListener('click', async () => {
                try {
                    await navigator.share({
                        title: 'Invite your friends',
                        text: 'Invite your friends and earn rewards!',
                        url: 'https://hsl.3ea.in/signup?ref='+localStorage.getItem('ref_code')
                    });
                    console.log('Link shared successfully');
                } catch (error) {
                    console.error('Error sharing link:', error);
                }
            });
        } else {
            shareButton.style.display = 'none';
        }
    }, ['https://hsl.3ea.in/signup?ref='+localStorage.getItem('ref_code')]);

    const encodedMessage = encodeURIComponent(`Hi! Use ${referralCode} while registering for Dr. Haslab and earn 100 points. Download the app by clicking on this link - ${process.env.REACT_APP_BASE_URL}signup?ref=${referralCode}`);

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
                            value={`${process.env.REACT_APP_BASE_URL}signup?ref=${referralCode}`}
                            readOnly
                        />
                        <button className="copy-button" onClick={handleCopy}>Copy</button>
                    </div>
                    <div className='flex flex-content-center mt-2'>
                        <button className='invite-button' id="shareButton">Invite Your Friends</button>
                    </div>
                    <div className="social-icons">
                        {/* <img src={linkedinIcon} className="icon" /> */}
                        <Link to={`http://wa.me/?text=${encodedMessage}`} target="_blank"><img src={whatsappIcon} assName="icon" /></Link>
                        {/* <img src={facebookIcon} className="icon" /> */}
                    </div>
                </div>

                <div className="rewards-info">
                    <div className="reward-box">
                        <h3>You'll get</h3>
                        <p><img src={tick} alt="tick"/> 70 when friends register using your code.</p>
                    </div>
                    <div className="reward-box">
                        <h3>They'll get</h3>
                        <p><img src={tick} alt="tick"/> 100 when they register using your code.</p>
                    </div>
                </div>

                <a href="#" className="terms">Terms and Conditions</a>
            </div>
        </div>
    );
}

export default ReferAndEarn;
