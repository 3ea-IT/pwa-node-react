import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    pincode: '',
    area: '',
    city: '',
    state: '',
    country: '',
    gender: '',
    height: '',
    weight: '',
    bloodGroup: '',
    age: ''
  });

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    // Fetch existing KYC data
    axios.get(`http://localhost:5000/kyc/${userId}`)
      .then(response => {
        if (response.data) {
          setFormData({
            pincode: response.data.pincode || '',
            area: response.data.area || '',
            city: response.data.city || '',
            state: response.data.state || '',
            country: response.data.country || '',
            gender: response.data.gender || '',
            height: response.data.height || '',
            weight: response.data.weight || '',
            bloodGroup: response.data.blood_group || '',
            age: response.data.age || ''
          });
        }
      })
      .catch(error => {
        console.error('Error fetching KYC data:', error);
      });
  }, [location.state, userId]);

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
    const token = localStorage.getItem('token');  // Get the token from local storage

    if (!token) {
        console.error('No token found. User might not be logged in.');
        // Handle this case, perhaps by redirecting to the login page
        return;
    }

    const config = {
        headers: { 'x-access-token': token }  // Use 'x-access-token' as the header name
    };

    let dataToSend = { userId };
    if (activeTab === 'Basic') {
        dataToSend = {
            ...dataToSend,
            pincode: formData.pincode,
            area: formData.area,
            city: formData.city,
            state: formData.state,
            country: formData.country
        };
    } else if (activeTab === 'Vitals') {
        dataToSend = {
            ...dataToSend,
            gender: formData.gender,
            height: formData.height,
            weight: formData.weight,
            bloodGroup: formData.bloodGroup,
            age: formData.age
        };
    } else if (activeTab === 'Medical') {
      if (currentQuestion < medicalQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
      } else {
          setIsCompleted(true);
      }
  }

    axios.post('http://localhost:5000/save-kyc', dataToSend, config)
        .then(response => {
            console.log(`KYC ${activeTab.toLowerCase()} data saved successfully:`, response.data);
            if (activeTab === 'Basic') {
                setActiveTab('Vitals');
            } else {
                setActiveTab('Medical');
            }
        })
        .catch(error => {
            console.error(`Error saving KYC ${activeTab.toLowerCase()} data:`, error);
        });
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
            <option value="">Select Blood Group</option>
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