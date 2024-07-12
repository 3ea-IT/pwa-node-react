import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './OtpVerification.css';
import verificationImage from './assets/two-step-verification.png';
import editIcon from './assets/editicon.png';
import { auth, signInWithPhoneNumber } from './firebase';

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData } = location.state;
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newMob, setNewMob] = useState(userData.mob);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
    
        try {
            const result = await window.confirmationResult.confirm(enteredOtp);
            // If OTP is verified successfully, create the user account
            const date = new Date().toISOString().slice(0, 10);
            const data = { ...userData, date };
    
            await axios.post('http://localhost:5000/verify-otp', { userData: data });
            alert('You have successfully signed up!');
            navigate('/login');
        } catch (error) {
            setError('Invalid OTP. Please try again.');
            console.error('There was an error!', error);
        }
    };

    const handleResendOtp = async () => {
        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, `+91${newMob}`, appVerifier);
            window.confirmationResult = confirmationResult;
            setOtp(new Array(6).fill(''));
        } catch (error) {
            setError('There was an error verifying the OTP. Please try again.');
            console.error('Error details:', error.response ? error.response.data : error.message);
        }
    };

    const handleEditNumber = () => {
        setIsEditing(!isEditing);
    };

    const handleNumberChange = (e) => {
        setNewMob(e.target.value);
    };

    const handleSaveNumber = async () => {
        userData.mob = newMob;
        setIsEditing(false);
        await handleResendOtp();
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
                                onChange={(e) => handleChange(e.target, index)}
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
                                    onChange={handleNumberChange}
                                    className="edit-mobile-input"
                                />
                                <button type="button" onClick={handleSaveNumber} className="update-mobile">
                                    Update
                                </button>
                            </>
                        ) : (
                            <>
                                {newMob}
                                <button type="button" onClick={handleEditNumber} className="edit-mobile">
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
