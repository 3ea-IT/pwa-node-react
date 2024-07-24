import React, { useState } from 'react';
import './KYC.css';
import backIcon from './assets/leftarrow.png';
import maleIcon from './assets/male.png';
import femaleIcon from './assets/female.png';

const KYC = () => {
  const [activeTab, setActiveTab] = useState('Basic');
  const [formData, setFormData] = useState({
    pincode: '226010',
    area: 'Gomti Nagar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    gender: 'Male',
    height: 171,
    weight: 70,
    bloodGroup: 'A+',
    age: 28,
    allergies: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderBasicTab = () => (
    <div className="basic-tab">
        <h3>Enter Your Details</h3>
      <div className="input-group">
        <label>Pincode</label>
        <input name="pincode" value={formData.pincode} onChange={handleInputChange} />
      </div>
      <div className="input-group">
        <label>Area</label>
        <input name="area" value={formData.area} onChange={handleInputChange} />
      </div>
      <div className="input-group">
        <label>City</label>
        <input name="city" value={formData.city} onChange={handleInputChange} />
      </div>
      <div className="input-group">
        <label>State</label>
        <input name="state" value={formData.state} onChange={handleInputChange} />
      </div>
      <div className="input-group">
        <label>Country</label>
        <input name="country" value={formData.country} onChange={handleInputChange} />
      </div>
    </div>
  );

  const renderVitalsTab = () => (
    <div className="vitals-tab">
      <p>Your individual parameters are important for in-depth personalization.</p>
      <div className="gender-selection">
        <div className={`gender-option ${formData.gender === 'Male' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, gender: 'Male' })}>
          <div className="gender-icon-container">
            <img src={maleIcon} alt="Male" />
          </div>
          <span>Male</span>
        </div>
        <div className={`gender-option ${formData.gender === 'Female' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, gender: 'Female' })}>
          <div className="gender-icon-container">
            <img src={femaleIcon} alt="Female" />
          </div>
          <span>Female</span>
        </div>
      </div>
      <div className="slider-group">
        <div className="slider-container">
            <div className="slider-label">
            <div>
                <label>Height, cm</label>
                <span className="slider-value">{formData.height}</span>
            </div>
            </div>
            <input type="range" name="height" value={formData.height} onChange={handleInputChange} min="100" max="250" />
        </div>
      </div>
      <div className="slider-group">
        <div className="slider-container">
            <div className="slider-label">
            <div>
                <label>Weight, kg</label>
                <span className="slider-value">{formData.weight}</span>
            </div>
            </div>
            <input type="range" name="weight" value={formData.weight} onChange={handleInputChange} min="30" max="200" />
        </div>
      </div>
      <div className="input-row">
        <div className="input-group1">
          <label>Blood Group</label>
          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange}>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="O+">O+</option>
            <option value="AB+">AB+</option>
            <option value="A-">A-</option>
            <option value="B-">B-</option>
            <option value="O-">O-</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
        <div className="input-group1">
          <label>Age, Years</label>
          <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
        </div>
      </div>
    </div>
  );

  const renderMedicalTab = () => (
    <div className="medical-tab">
      <div className="allergy-question">
        <p>Are you allergic to any disease? If Yes please select from the list.</p>
      </div>
      <div className="dropdown-container">
        <select name="allergies" value={formData.allergies} onChange={handleInputChange}>
          <option value="">Select from dropdown</option>
          {/* Add more allergy options here */}
        </select>
      </div>
      <div className="progress-indicator">
        <span>9/10</span>
      </div>
    </div>
  );

  return (
    <div className="kyc-container">
      <div className="kyc-header">
        <img src={backIcon} alt="Back" className="back-icon" />
        <h1>KYC</h1>
      </div>
      <div className="tab-navigation">
        <button onClick={() => setActiveTab('Basic')} className={activeTab === 'Basic' ? 'active' : ''}>Basic</button>
        <button onClick={() => setActiveTab('Vitals')} className={activeTab === 'Vitals' ? 'active' : ''}>Vitals</button>
        <button onClick={() => setActiveTab('Medical')} className={activeTab === 'Medical' ? 'active' : ''}>Medical</button>
      </div>
      <div className="tab-content">
        {activeTab === 'Basic' && renderBasicTab()}
        {activeTab === 'Vitals' && renderVitalsTab()}
        {activeTab === 'Medical' && renderMedicalTab()}
      </div>
      <button className="next-button">NEXT</button>
    </div>
  );
};

export default KYC;