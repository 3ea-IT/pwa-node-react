import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(3);
  const [message, setMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleEmailSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email });
      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      setMessage('OTP verified. Please set your new password.');
      setStep(3);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/reset-password', { email, newPassword });
      setMessage('Password reset successful.');
      setStep(4);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        {message && <p className="message">{message}</p>}
        {step === 1 && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleEmailSubmit}>Send OTP</button>
            <p>Go back to <a href='/login'>Login</a></p>
          </div>
        )}
        {step === 2 && (
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleOtpSubmit}>Verify OTP</button>
            <p>Entered wrong email address? <a href='/forgot-password'>Re-enter email</a>.</p>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button type="button" className="toggle-password1" onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <div className="password-container">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="button" className="toggle-password1" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <button onClick={handlePasswordSubmit}>Reset Password</button>
            <p><a href='/forgot-password'>Resend OTP</a></p>
          </div>
        )}
        {step === 4 && (
          <div>
            <p>Your password has been reset. You can now <a href="/login">login</a> with your new password.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
