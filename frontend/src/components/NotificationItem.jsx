import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import '../styles/notifications.css';

const NotificationItem = ({ 
  id, 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  autoClose = true, 
  onClose,
  actions = [],
  className = ''
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(duration);
  const timerRef = useRef(null);
  const pausedTimeRef = useRef(null);
  const notificationRef = useRef(null);

  // Ensure title and message are strings
  const safeTitle = typeof title === 'string' ? title : title ? String(title) : '';
  const safeMessage = typeof message === 'string' ? message : message ? String(message) : '';

  // Handle closing of notification
  const handleClose = useCallback(() => {
    if (isExiting) return;
    
    setIsExiting(true);
    
    // Wait for exit animation to complete before removing from DOM
    setTimeout(() => {
      onClose(id);
    }, 300); // Match this with the CSS animation duration
  }, [isExiting, onClose, id]);

  // Setup auto-close timer
  useEffect(() => {
    // Don't setup timer if autoClose is false or duration is 0
    if (!autoClose || duration <= 0 || isPaused) return;
    
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      handleClose();
    }, remainingTime);
    
    // Start time for progress calculation
    pausedTimeRef.current = Date.now();
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoClose, duration, isPaused, remainingTime, handleClose]);

  // Pause timer on hover
  const handleMouseEnter = () => {
    if (!autoClose || duration <= 0) return;
    
    setIsPaused(true);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      
      // Calculate remaining time
      const elapsedTime = Date.now() - pausedTimeRef.current;
      setRemainingTime(prev => Math.max(0, prev - elapsedTime));
    }
  };

  // Resume timer on mouse leave
  const handleMouseLeave = () => {
    if (!autoClose || duration <= 0) return;
    
    setIsPaused(false);
    pausedTimeRef.current = Date.now();
  };

  // Handle keyboard accessibility
  useEffect(() => {
    const notification = notificationRef.current;
    
    const handleKeyDown = (event) => {
      // Close on Escape key
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    
    if (notification) {
      notification.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      if (notification) {
        notification.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [handleClose]);

  // Calculate progress percentage for the progress bar
  const progressPercentage = autoClose && duration > 0 
    ? (remainingTime / duration) * 100 
    : 0;

  // Determine notification class based on type
  const notificationTypeClass = `notification-${type}`;
  
  return (
    <div
      ref={notificationRef}
      className={`notification-item ${notificationTypeClass} ${isExiting ? 'exit' : 'enter'} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="alert"
      aria-live="assertive"
    >
      <div className="notification-content">
        {/* Notification icon based on type */}
        <div className="notification-icon">
          {type === 'success' && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          )}
          {type === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
            </svg>
          )}
          {type === 'warning' && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
            </svg>
          )}
          {type === 'info' && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          )}
          {type === 'loading' && (
            <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
              <circle cx="12" cy="12" r="10" strokeWidth="4" strokeDasharray="30 30" strokeDashoffset="0">
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from="0 12 12"
                  to="360 12 12"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          )}
        </div>

        {/* Notification text content */}
        <div className="notification-text">
          {safeTitle && <h4 className="notification-title">{safeTitle}</h4>}
          {safeMessage && <div className="notification-message">{safeMessage}</div>}
          
          {/* Action buttons */}
          {actions.length > 0 && (
            <div className="notification-actions">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (action.onClick) action.onClick(handleClose);
                    if (action.closeOnClick !== false) handleClose();
                  }}
                  className={`notification-action-btn ${action.variant ? `notification-action-btn-${action.variant}` : ''} ${action.className || ''}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Close button */}
        <button 
          className="notification-close" 
          onClick={handleClose}
          aria-label="Close notification"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
        </button>
      </div>
      
      {/* Progress bar for autoClose notifications */}
      {autoClose && duration > 0 && (
        <div className="notification-progress-bar">
          <div 
            className="notification-progress-bar-inner"
            style={{
              width: `${progressPercentage}%`,
              transition: isPaused ? 'none' : 'width linear 0.1s'
            }}
          />
        </div>
      )}
    </div>
  );
};

// Optimize with memo to prevent unnecessary re-renders
export default memo(NotificationItem); 