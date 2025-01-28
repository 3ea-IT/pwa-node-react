import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Signup.css";

// Comment out Firebase imports if you no longer need them:
// import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./firebase";

import { FaEye, FaEyeSlash } from "react-icons/fa";
// Comment out if not needed:
// import googleIcon from "./assets/GoogleIcon.png";
// import facebookIcon from "./assets/FacebookIcon.png";

const Signup = () => {
  const [userData, setUserData] = useState({
    name: "",
    dob: "",
    gender: "",
    mob: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  // Add state inside component
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Cleanup function for recaptcha if it was used
    // return () => {
    //   if (window.recaptchaVerifier) {
    //     window.recaptchaVerifier.clear();
    //     window.recaptchaVerifier = null;
    //   }
    // };
  }, []);

  useEffect(() => {
    // Check if there's a referral code in the URL query param
    const queryParams = new URLSearchParams(location.search);
    const referralCode = queryParams.get("ref");
    if (referralCode) {
      setUserData((prevData) => ({ ...prevData, referralCode }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const validateReferralCode = async (referralCode) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}validate-referral`,
        { referralCode }
      );
      return response.data.isValid;
    } catch (error) {
      console.error("Error validating referral code:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 1. Check if passwords match
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // 2. Validate referral code if entered
    if (userData.referralCode) {
      const isValidReferral = await validateReferralCode(userData.referralCode);
      if (!isValidReferral) {
        setError("Invalid referral code. Please try again.");
        return;
      }
    }

    // 3. Prepare the data
    const { confirmPassword, ...data } = userData;
    data.date = new Date().toISOString().slice(0, 10);

    try {
      // -- Bypass OTP & Recaptcha: Commented out code --
      // if (!window.recaptchaVerifier) {
      //   window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-up-button", {
      //     size: "invisible",
      //     callback: (response) => {
      //       console.log("Recaptcha resolved");
      //     },
      //   });
      // }
      // const phoneNumber = `+91${userData.mob}`;
      // const appVerifier = window.recaptchaVerifier;
      // const confirmationResult = await signInWithPhoneNumber(
      //   auth,
      //   phoneNumber,
      //   appVerifier
      // );
      // window.confirmationResult = confirmationResult;

      // 4. Directly call the "signup-direct" endpoint (no OTP)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}signup-direct`,
        { userData: data }
      );

      // 5. If success, show popup and navigate
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError("There was an error creating your account. Please try again.");
      // You can log the entire error object too:
      console.error("Error details:", error);
      // Cleanup recaptcha if it was used:
      // if (window.recaptchaVerifier) {
      //   window.recaptchaVerifier.clear();
      //   window.recaptchaVerifier = null;
      // }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSigninRedirect = () => {
    navigate("/login");
  };

  // Add this before the final return statement
  const SuccessModal = () => (
    <div className="signup-modal-overlay">
      <div className="signup-success-modal">
        <div className="signup-success-icon">✓</div>
        <h3>Registration Successful!</h3>
        <p>Redirecting to login...</p>
      </div>
    </div>
  );

  // ------------------ RENDER ------------------
  return (
    <div className="signup-container">
      {showModal && <SuccessModal />}
      <div className="signup-box">
        <h2>Let's Get Started!</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>
          <label style={{ marginRight: "210px" }}>Date of birth</label>
          <div className="form-group">
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={userData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div className="gender-container">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={handleChange}
                required
              />{" "}
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={handleChange}
                required
              />{" "}
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Others"
                onChange={handleChange}
                required
              />{" "}
              Others
            </label>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="mob"
              placeholder="Mobile Number"
              value={userData.mob}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code"
              value={userData.referralCode}
              onChange={handleChange}
            />
          </div>
          <div className="password-container">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <div className="password-container">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={userData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? <div className="signup-loader"></div> : "Sign Up"}
          </button>
        </form>
        <p className="signin-link" onClick={handleSigninRedirect}>
          Already have an account? <span>Sign In</span>
        </p>
        {/* Uncomment if you want social login buttons:
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
        */}
      </div>
    </div>
  );
};

export default Signup;
