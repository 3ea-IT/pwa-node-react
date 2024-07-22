import React from 'react';
import { useState } from 'react';
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

const Profile = () => {

    const [showMenu, setShowMenu] = useState(false);

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
          <h2 className="profile-name">Ramesh</h2>
        </div>
        <div className="profile-details">
          <div className="profile-detail-item">
            <span>Email:</span>
            <span>abc@example.com</span>
            <img src={rightArrow} alt="Arrow" className="right-arrow" />
          </div>
          <div className="profile-detail-item">
            <span>Date of birth:</span>
            <span>26-11-1994</span>
            <img src={rightArrow} alt="Arrow" className="right-arrow" />
          </div>
          <div className="profile-detail-item">
            <span>Gender:</span>
            <span>abc@example.com</span>
            <img src={rightArrow} alt="Arrow" className="right-arrow" />
          </div>
        </div>
        <div className="profile-actions">
          <div className="profile-action-box">
            <div className="profile-action-item">
              <img src={vitalsIcon} alt="Vitals" />
              <span>Your vitals</span>
              <img src={rightArrow} alt="Arrow" className="right-arrow" />
            </div>
          </div>
          <div className="profile-action-box">
            <div className="profile-action-item">
              <img src={otherDetailsIcon} alt="Other details" />
              <span>Other details</span>
              <img src={rightArrow} alt="Arrow" className="right-arrow" />
            </div>
            <div className="profile-action-item">
              <img src={changePasswordIcon} alt="Change password" />
              <span>Change password</span>
              <img src={rightArrow} alt="Arrow" className="right-arrow" />
            </div>
            <div className="profile-action-item">
              <img src={helpIcon} alt="Help" />
              <span>Help</span>
              <img src={rightArrow} alt="Arrow" className="right-arrow" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Profile;