import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './KYC.css';
import backIcon from './assets/leftarrow.png';
import maleIcon from './assets/male.png';
import femaleIcon from './assets/female.png';
import checkIcon from './assets/checkmarker.png';

const KYC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Basic');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
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

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const medicalQuestions = [
    "Do you have any allergies?",
    "Have you ever been hospitalized?",
    "Do you have any chronic diseases?",
    "Are you currently taking any medications?",
    "Do you have a family history of any serious illnesses?"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (activeTab === 'Basic') {
      setActiveTab('Vitals');
    } else if (activeTab === 'Vitals') {
      setActiveTab('Medical');
    } else if (activeTab === 'Medical') {
      if (currentQuestion < medicalQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsCompleted(true);
      }
    }
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
        <p>{medicalQuestions[currentQuestion]}</p>
      </div>
      <div className="dropdown-container">
        <select name={`medical_question_${currentQuestion}`} onChange={handleInputChange}>
          <option value="">Select an option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="progress-indicator">
        <span>{currentQuestion + 1}/{medicalQuestions.length}</span>
      </div>
    </div>
  );

  const renderCompletedScreen = () => (
    <div className="completed-screen">
      <div className="check-icon-container">
        <img src={checkIcon} alt="Completed" className="check-icon" />
      </div>
      <h2>Congratulations!</h2>
      <p>Your KYC is completed.</p>
      <button className="back-to-home-button">Back To Home</button>
    </div>
  );

  return (
    <div className="kyc-container">
      <div className="kyc-header">
        <img src={backIcon} alt="Back" className="back-icon" onClick={() => navigate(-1)} />
        <h1>KYC</h1>
      </div>
      {!isCompleted ? (
        <>
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
          <button className="next-button" onClick={handleNext}>
            {activeTab === 'Medical' && currentQuestion === medicalQuestions.length - 1 ? 'Submit' : 'NEXT'}
          </button>
        </>
      ) : (
        renderCompletedScreen()
      )}
    </div>
  );
};

export default KYC;