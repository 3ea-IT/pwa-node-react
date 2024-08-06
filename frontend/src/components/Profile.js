import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import SideMenu from './SideMenu';
import profilePic from './assets/profileicon.png'; 
import vitalsIcon from './assets/vitals.png'; 
import otherDetailsIcon from './assets/otherdetailsicon.png'; 
import changePasswordIcon from './assets/changePasswordIcon.png'; 
import helpIcon from './assets/helpIcon.png'; 
import menuIcon from './assets/menuIcon.png'; 
import cameraIcon from './assets/Camera.png'; 
import rightArrow from './assets/rightArrow.png';

// Utility function to format the date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA', options); // This will return the date in YYYY-MM-DD format
};

const Profile = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [profile, setProfile] = useState({
      name: '',
      email: '',
      dob: '',
      gender: ''
  });

  const handleNavigateToVitals = () => {
    navigate('/kyc', { state: { activeTab: 'Vitals' } });
  };

  const handleNavigateToKyc = () => {
    navigate('/kyc');
  }

  const handleNavigateToChatbot = () => {
    navigate('/chatbot');
  }

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
        axios.get(`${process.env.REACT_APP_API_URL}user-profile/${userId}`)
            .then(response => {
                const profileData = response.data;
                profileData.dob = formatDate(profileData.dob); // Format the date before setting the state
                setProfile(profileData);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }
  }, []);

    return (
      <div className="profile-container">
        <div className="profile-header">
          <img src={menuIcon} alt="Menu" className="menu-icon" onClick={() => setShowMenu(true)} />
          <h1>Profile</h1>
        </div>
        {showMenu && <SideMenu closeMenu={() => setShowMenu(false)} />}
        <div className="profile-info">
          <div className="profile-pic-container">
            <img src={profilePic} alt="Profile" className="profile-pic" />
            <img src={cameraIcon} alt="Camera" className="camera-icon" />
          </div>
          <h2 className="profile-name">{profile.name}</h2>
        </div>
        <div className="profile-details">
          <div className="profile-detail-item">
            <span>Email:</span>
            <span>{profile.email}</span>
            <img src={rightArrow} alt="Arrow" className="right-arrow" />
          </div>
          <div className="profile-detail-item">
            <span>Date of birth:</span>
            <span>{profile.dob}</span>
            <img src={rightArrow} alt="Arrow" className="right-arrow" />
          </div>
          <div className="profile-detail-item">
            <span>Gender:</span>
            <span>{profile.gender}</span>
            <img src={rightArrow} alt="Arrow" className="right-arrow" />
          </div>
        </div>
        <div className="profile-actions">
          <div className="profile-action-box">
            <div className="profile-action-item">
              <img src={vitalsIcon} alt="Vitals" />
              <span>Your vitals</span>
              <img src={rightArrow} alt="Arrow" className="right-arrow" onClick={handleNavigateToVitals} />
            </div>
          </div>
          <div className="profile-action-box">
            <div className="profile-action-item">
              <img src={otherDetailsIcon} alt="Other details"/>
              <span>Other details</span>
              <img src={rightArrow} alt="Arrow" className="right-arrow"  onClick={handleNavigateToKyc} />
            </div>
            <div className="profile-action-item">
              <img src={changePasswordIcon} alt="Change password" />
              <span>Change password</span>
              <img src={rightArrow} alt="Arrow" className="right-arrow" />
            </div>
            <div className="profile-action-item">
              <img src={helpIcon} alt="Help" />
              <span>Help</span>
              <img src={rightArrow} alt="Arrow" className="right-arrow" onClick={handleNavigateToChatbot} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Profile;