import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './OtpVerification.css';
import verificationImage from './assets/two-step-verification.png';
import editIcon from './assets/editicon.png';
import { auth, signInWithPhoneNumber, RecaptchaVerifier } from './firebase';

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData } = location.state;
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newMob, setNewMob] = useState(userData.mob);

    const recaptchaContainerRef = useRef(null);

    useEffect(() => {
        let recaptchaVerifier;

        const initRecaptcha = () => {
            if (!window.recaptchaVerifier && recaptchaContainerRef.current) {
                recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
                    'size': 'invisible',
                    'callback': (response) => {
                        console.log('Recaptcha resolved');
                    },
                    'expired-callback': () => {
                        console.log('Recaptcha expired');
                        if (recaptchaVerifier) {
                            recaptchaVerifier.clear();
                        }
                        initRecaptcha();
                    }
                });

                window.recaptchaVerifier = recaptchaVerifier;
            }
        };

        // Delay the initialization slightly to ensure the DOM is ready
        const timer = setTimeout(() => {
            initRecaptcha();
        }, 1000);

        return () => {
            clearTimeout(timer);
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };
    }, []);

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
            if (!window.confirmationResult) {
                throw new Error('Confirmation result not available. Please try signing up again.');
            }
            const result = await window.confirmationResult.confirm(enteredOtp);
            // If OTP is verified successfully, create the user account
            const date = new Date().toISOString().slice(0, 10);
            const data = { ...userData, date };
    
            await axios.post(`${process.env.REACT_APP_API_URL}verify-otp`, { userData: data });
            alert('You have successfully signed up!');
            navigate('/login');
        } catch (error) {
            setError('Invalid OTP or verification failed. Please try again.');
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
        try {
            console.log('Sending update request with:', { oldMob: userData.mob, newMob });
            const response = await axios.post(`${process.env.REACT_APP_API_URL}update-phone`, {
                oldMob: userData.mob,
                newMob: newMob
            });
            
            console.log('Server response:', response.data);
    
            if (response.data.message === 'Phone number updated and new OTP sent successfully') {
                userData.mob = newMob;
                setIsEditing(false);
                setOtp(new Array(6).fill(''));
                setError('');
                alert('Phone number updated. A new OTP has been sent to your updated number.');
                
                // Reinitialize phone authentication
                if (window.recaptchaVerifier) {
                    const appVerifier = window.recaptchaVerifier;
                    try {
                        const confirmationResult = await signInWithPhoneNumber(auth, `+91${newMob}`, appVerifier);
                        window.confirmationResult = confirmationResult;
                    } catch (error) {
                        console.error('Error sending OTP:', error);
                        setError('Error sending OTP. Please try again.');
                    }
                } else {
                    setError('reCAPTCHA not initialized. Please refresh the page and try again.');
                }
            } else {
                throw new Error('Unexpected response from server');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('User data not found. Please try signing up again.');
            } else {
                setError('There was an error updating the phone number. Please try again.');
            }
            console.error('Error details:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="otp-container">
            <div ref={recaptchaContainerRef} id="recaptcha-container"></div>
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
