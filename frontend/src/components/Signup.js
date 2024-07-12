import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from './firebase';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import googleIcon from './assets/GoogleIcon.png';
import facebookIcon from './assets/FacebookIcon.png';

const Signup = () => {
    const [userData, setUserData] = useState({
        name: '',
        dob: '',
        gender: '',
        mob: '',
        email: '',
        password: '',
        confirmPassword:'',
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Cleanup function
        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (userData.password !== userData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
    
        const { confirmPassword, ...data } = userData;
        data.date = new Date().toISOString().slice(0, 10);
    
        try {
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-up-button', {
                    'size': 'invisible',
                    'callback': (response) => {
                        console.log('Recaptcha resolved');
                    }
                });
            }
    
            const phoneNumber = `+91${userData.mob}`;
            const appVerifier = window.recaptchaVerifier;
            
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            window.confirmationResult = confirmationResult;
    
            // Send user data to server
            await axios.post('http://localhost:5000/signup', { userData: data });
    
            navigate('/otp-verification', { state: { userData: data } });
        } catch (error) {
            setError('There was an error sending the OTP. Please try again.');
            console.error('Error details:', error.code, error.message);
            
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        }
    };

    const handleSigninRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Let's Get Started!</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text" name="name" placeholder="Full Name" value={userData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <input type="date" name="dob" placeholder="Date of Birth" value={userData.dob} onChange={handleChange} required />
                    </div>
                    <div className="gender-container">
                        <label>
                            <input type="radio" name="gender" value="Male" onChange={handleChange} required /> Male
                        </label>
                        <label>
                            <input type="radio" name="gender" value="Female" onChange={handleChange} required /> Female
                        </label>
                        <label>
                            <input type="radio" name="gender" value="Others" onChange={handleChange} required /> Others
                        </label>
                    </div>
                    <div className="form-group">
                        <input type="text" name="mob" placeholder="Mobile Number" value={userData.mob} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
                    </div>
                    <div className="password-container">
                        <input type={passwordVisible ? "text" : "password"} name="password" placeholder="Password" value={userData.password} onChange={handleChange} required />
                        <button type="button" className="toggle-password" onClick={() => setPasswordVisible(!passwordVisible)}>
                            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <div className="password-container">
                        <input type={confirmPasswordVisible ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={userData.confirmPassword} onChange={handleChange} required />
                        <button type="button" className="toggle-password" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                            {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <button type="submit" id="sign-up-button" className="signup-button">Sign Up</button>
                </form>
                <p className="signin-link" onClick={handleSigninRedirect}>
                    Already have an account? <span>Sign In</span>
                </p>
                <div className="divider">
                    <span>OR</span>
                </div>
                <div className="social-buttons">
                    <button className="social-button google">
                        <img src={googleIcon} alt="Google" /> Google
                    </button>
                    <button className="social-button facebook">
                        <img src={facebookIcon} alt="Facebook" /> Facebook
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
