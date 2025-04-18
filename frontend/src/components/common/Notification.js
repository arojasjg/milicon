import React, { useState, useEffect } from 'react';
import '../../../styles/notifications.css';

const Notification = ({ id, type, title, message, duration, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  // Set up auto-dismiss
  useEffect(() => {
    let timer;
    
    if (duration) {
      timer = setTimeout(() => {
        handleClose();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [duration]);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    
    // Wait for animation to complete before actually removing
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  return (
    <div 
      className={`notification notification-${type} ${isClosing ? 'closing' : ''}`}
      role="alert"
    >
      <div className="notification-header">
        <h4 className="notification-title">{title}</h4>
        <button 
          className="notification-close" 
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
      <p className="notification-message">{message}</p>
    </div>
  );
};

export default Notification; 