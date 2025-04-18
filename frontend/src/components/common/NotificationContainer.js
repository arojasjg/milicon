import React, { useEffect, useRef } from 'react';
import './NotificationContainer.css';

const NotificationContainer = ({ notifications, removeNotification }) => {
  const notificationRefs = useRef({});
  
  useEffect(() => {
    // Set up auto-dismiss timers for notifications
    notifications.forEach(notification => {
      if (notification.autoClose !== false && !notificationRefs.current[notification.id]) {
        const duration = notification.duration || 5000; // Default 5 seconds
        
        // Store the timer ID so we can clear it if needed
        notificationRefs.current[notification.id] = {
          timer: setTimeout(() => {
            handleClose(notification.id);
          }, duration),
          progress: null
        };
      }
    });
    
    // Cleanup function to clear timers for removed notifications
    return () => {
      Object.entries(notificationRefs.current).forEach(([id, refs]) => {
        if (refs.timer) clearTimeout(refs.timer);
      });
    };
  }, [notifications, removeNotification]);

  const handleClose = (id) => {
    // Get the DOM element for the notification
    const element = document.getElementById(`notification-${id}`);
    if (element) {
      // Add exiting class for animation
      element.classList.add('exiting');
      
      // Clear existing timer
      if (notificationRefs.current[id]?.timer) {
        clearTimeout(notificationRefs.current[id].timer);
      }
      
      // After animation completes, remove the notification
      setTimeout(() => {
        removeNotification(id);
        delete notificationRefs.current[id];
      }, 300); // Match the CSS transition duration
    } else {
      // If element not found, just remove the notification
      removeNotification(id);
      delete notificationRefs.current[id];
    }
  };

  // Update progress bar for each notification
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.autoClose !== false) {
        const duration = notification.duration || 5000;
        const progressElement = document.getElementById(`progress-${notification.id}`);
        
        if (progressElement) {
          // Start with width of 100%
          progressElement.style.width = '100%';
          
          // Animate to 0% over the duration of the notification
          setTimeout(() => {
            progressElement.style.width = '0%';
            progressElement.style.transition = `width ${duration}ms linear`;
          }, 10);
        }
      }
    });
  }, [notifications]);

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          id={`notification-${notification.id}`}
          className={`notification ${notification.type || 'info'}`}
        >
          <div className="notification-header">
            <h4 className="notification-title">
              {notification.title || notification.type?.charAt(0).toUpperCase() + notification.type?.slice(1) || 'Info'}
            </h4>
            <button 
              className="notification-close" 
              onClick={() => handleClose(notification.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
          <p className="notification-message">{notification.message}</p>
          {notification.autoClose !== false && (
            <div 
              id={`progress-${notification.id}`}
              className="notification-progress"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer; 