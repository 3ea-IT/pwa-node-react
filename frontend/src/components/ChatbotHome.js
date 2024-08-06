import React, { useState } from 'react';
import './ChatbotHome.css';
import { Link } from 'react-router-dom';
import backIcon from './assets/leftarrow.png'; // Ensure you have a back icon image
import send from './assets/send.png';
import mascotImage from './assets/Mascort.png'; // Ensure you have a mascot image
import ChatInterface from './ChatInterface'; // We'll create this component next

const ChatbotHome = () => {
    const [showChat, setShowChat] = useState(false);

  const toggleChat = () => {
    setShowChat(!showChat);
  };
  return (
    <div className="chatbot-home">
        {!showChat ? (
        <>
      <div className="header">
        <button className="back-button" onClick={() => window.history.back()}>
          <div className="back-icon-circle">
            <img src={backIcon} alt="Back" />
          </div>
        </button>
        <div className="mascot-container">
          <img src={mascotImage} alt="Dr. Haslab" className="mascot-image" />
        </div>
        <p className="header-subtitle">Your expert companion in every inquiry.</p>
      </div>
      <div className="content-box">
        <div className="content">
          <p>Welcome to Dr. Haslab, where knowledge is just a chat away.</p>
          <div className="faq-links">
            <Link to="/faq" className="faq-link">Frequently Asked Questions For Expert Advice.</Link>
            <Link to="/guidance" className="faq-link">Guidance and Advisory: Common Queries</Link>
            <Link to="/ask-dr-haslab" className="faq-link">Ask Dr. Haslab: Expert Insights and Advice</Link>
            <Link to="/top-questions" className="faq-link">Top Questions for Personalized Guidance</Link>
          </div>
        </div>
      </div>
      <div className="talk-box">
      <div className="talk-link" onClick={toggleChat}>
        <div className="talk-text">
            Talk to Dr. Haslab
            <span className="talk-subtitle">For better advised</span>
            </div>
            <img src={send} alt="Talk" className="right-arrow" />
        </div>
      </div>
      </>
      ) : (
        <ChatInterface onClose={toggleChat} />
      )}
    </div>
  );
};

export default ChatbotHome;
