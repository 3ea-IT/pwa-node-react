import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './OtpVerification.css';
import verificationImage from './assets/two-step-verification.png';
import editIcon from './assets/editicon.png';

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, otp: sentOtp } = location.state;
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newMob, setNewMob] = useState(userData.mob);
    const [currentOtp, setCurrentOtp] = useState(sentOtp);
    const inputRefs = useRef([]);

    useEffect(() => {
        console.log(`Sent OTP: ${currentOtp}`); // For testing purposes
    }, [currentOtp]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');

        axios.post('http://localhost:5000/verify-otp', { otp: enteredOtp, userData })
            .then(response => {
                alert('You have successfully signed up!');
                navigate('/login');
            })
            .catch(error => {
                setError('There was an error verifying the OTP. Please try again.');
                console.error('There was an error!', error);
            });
    };

    const handleResendOtp = () => {
        const updatedUserData = { ...userData, mob: newMob };
        axios.post('http://localhost:5000/send-otp', { userData: updatedUserData })
            .then(response => {
                alert('OTP resent successfully!');
                setOtp(new Array(6).fill('')); // Clear OTP input
                setCurrentOtp(response.data.otp); // Update the current OTP
            })
            .catch(error => {
                setError('There was an error resending the OTP. Please try again.');
                console.error('There was an error!', error);
            });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdateMobile = () => {
        setIsEditing(false);
        userData.mob = newMob;
        handleResendOtp();
    };

    return (
        <div className="otp-container">
            <div className="otp-box">
                <h2>Verification</h2>
                <div className="verification-image-container">
                    <div className="outer-circle">
                        <div className="inner-circle">
                            <img src={verificationImage} alt="Verification" />
                        </div>
                    </div>
                </div>
                <h3>Verification Code</h3>
                <p>We have sent the verification code to your mobile number</p>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="otp-input-container">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                ref={el => inputRefs.current[index] = el}
                                className="otp-input"
                            />
                        ))}
                    </div>
                    <p className="mobile-number">
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={newMob}
                                    onChange={(e) => setNewMob(e.target.value)}
                                    className="edit-mobile-input"
                                />
                                <button type="button" onClick={handleUpdateMobile} className="update-mobile">
                                    Update
                                </button>
                            </>
                        ) : (
                            <>
                                {newMob}
                                <button type="button" onClick={handleEditClick} className="edit-mobile">
                                    <img src={editIcon} alt="Edit" className="edit-icon" />
                                </button>
                            </>
                        )}
                    </p>
                    <button type="submit" className="otp-submit-button">Submit</button>
                </form>
                <button onClick={handleResendOtp} className="otp-resend-button">Send Again</button>
            </div>
        </div>
    );
};

export default OtpVerification;
