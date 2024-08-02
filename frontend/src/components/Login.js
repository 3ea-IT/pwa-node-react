import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import googleIcon from './assets/GoogleIcon.png';
import facebookIcon from './assets/FacebookIcon.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}login`, { email, password })
            .then(response => {
                console.log(response.data);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user_id', response.data.user_id);
                alert('Logging in...');
                navigate('/home');
            })
            .catch(error => {
                console.log()
                setError('Wrong email/password');
            });
    };

    const handleSignupRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Sign In</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="email" placeholder="Enter Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="password-container">
                        <input type={passwordVisible ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="button" className="toggle-password" onClick={() => setPasswordVisible(!passwordVisible)}>
                            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <div className="forgot-password">Forget Password?</div>
                    <button type="submit" className="signin-button">Sign In</button>
                </form>
                <p className="signup-link" onClick={handleSignupRedirect}>
                    Don’t have an account? <span>Sign Up</span>
                </p>
                {/* <div className="divider">
                    <span>OR</span>
                </div> */}
                {/* <div className="social-buttons">
                    <button className="social-button google">
                        <img src={googleIcon} alt="Google" /> Google
                    </button>
                    <button className="social-button facebook">
                        <img src={facebookIcon} alt="Facebook" /> Facebook
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default Login;
