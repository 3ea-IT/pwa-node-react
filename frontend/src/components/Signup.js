import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import googleIcon from './assets/GoogleIcon.png';
import facebookIcon from './assets/FacebookIcon.png';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mob: '',
        dob: '',
        gender: '',
        password: '',
        confirmPassword: '',
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // Remove confirmPassword from the data sent to the backend
        const { confirmPassword, ...data } = formData;

        // Add current date as registration date
        data.date = new Date().toISOString().slice(0, 10);
        
        // Add null values for pin, area, city, and state
        data.pin = null;
        data.area = null;
        data.city = null;
        data.state = null;

        axios.post('http://localhost:5000/signup', data)
            .then(response => {
                alert('Registration successful!');
                navigate('/login');
            })
            .catch(error => {
                setError('There was an error creating the account. Please try again.');
                console.error('There was an error!', error);
            });
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
                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} required />
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
                        <input type="text" name="mob" placeholder="Mobile Number" value={formData.mob} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    </div>


                    <div className="password-container">
                        <input type={passwordVisible ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <button type="button" className="toggle-password" onClick={() => setPasswordVisible(!passwordVisible)}>
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="password-container">
                        <input type={confirmPasswordVisible ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                        <button type="button" className="toggle-password" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button type="submit" className="signup-button">Sign Up</button>
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
