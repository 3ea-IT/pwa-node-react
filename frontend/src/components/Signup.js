import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mob: '',
        dob: '',
        gender: '',
        pin: '',
        area: '',
        city: '',
        state: '',
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
                <h2>Signup</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Mobile:</label>
                        <input type="text" name="mob" placeholder="Mobile" value={formData.mob} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth:</label>
                        <input type="date" name="dob" placeholder="dd-mm-yyyy" value={formData.dob} onChange={handleChange} required />
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
                        <label>PIN:</label>
                        <input type="text" name="pin" placeholder="PIN" value={formData.pin} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Area:</label>
                        <input type="text" name="area" placeholder="Area" value={formData.area} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>City:</label>
                        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>State:</label>
                        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
                    </div>

                    <div className="password-container">
                        <label>Password:</label>
                        <input type={passwordVisible ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <button type="button" className="toggle-password" onClick={() => setPasswordVisible(!passwordVisible)}>
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="password-container">
                        <label>Confirm Password:</label>
                        <input type={confirmPasswordVisible ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                        <button type="button" className="toggle-password" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button type="submit">Signup</button>
                </form>
                <p className="signin-link" onClick={handleSigninRedirect}>
                    Already a user? Sign in
                </p>
            </div>
        </div>
    );
};

export default Signup;
