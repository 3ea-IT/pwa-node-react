import React, { useState } from 'react';
import './ChatInterface.css';
import backIcon from './assets/leftarrow.png';
import send from './assets/send.png';
import mascotImage from './assets/Mascort.png';
import FeedbackForm from './FeedbackForm';

const ChatInterface = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello Ramesh, How can I help you?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [input, setInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        type: 'user',
        text: input,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setInput('');
    }
  };

  const handleEndChat = () => {
    setShowFeedback(true); // Show the feedback form when end chat is clicked
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    onClose(); // Call onClose to end the chat and close the interface
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <img src={mascotImage} alt="Dr. Haslab" className="mascot-image" />
        <div className="header-text">
          <h2>Dr. Haslab</h2>
          <p>24x7 support</p>
        </div>
        <button className="back-button" onClick={() => window.history.back()}>
          <div className="back-icon-circle">
            <img src={backIcon} alt="Back" />
          </div>
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={message.type === 'bot' ? 'bot-message' : 'user-message'}>
            <p>{message.text}</p>
            <span className="timestamp">{message.timestamp}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask anything ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="send-button" onClick={handleSend}>
          <img src={send} alt="Send" className="send-icon" />
        </button>
      </div>
      <button className="end-chat-button" onClick={handleEndChat}>End Chat</button>
      {showFeedback && <FeedbackForm onClose={handleCloseFeedback} />} {/* Show feedback form */}
    </div>
  );
};

export default ChatInterface;
