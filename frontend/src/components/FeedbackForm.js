import React, { useState } from 'react';
import './FeedbackForm.css';

const FeedbackForm = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleRatingClick = (ratingValue) => {
    setRating(ratingValue);
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-form">
        <h2>Thanks for the feedback</h2>
        <p>Please rate your experience below</p>
        <div className="rating">
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <span
                key={index}
                className={`star ${ratingValue <= rating ? 'filled' : ''}`}
                onClick={() => handleRatingClick(ratingValue)}
              >
                &#9733;
              </span>
            );
          })}
          <span className='feedback-rating'>{rating}/5 stars</span>
        </div>
        <div className="feedback-input">
          <textarea
            placeholder="Add feedback ..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        <div className="feedback-buttons">
          <button className="skip-button" onClick={onClose}>Skip</button>
          <button className="send-button-feedback" onClick={onClose}>Send Feedback</button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
