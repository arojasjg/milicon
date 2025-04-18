
import React, { memo } from 'react';
import NotificationItem from './NotificationItem';
import '../styles/notifications.css';

/**
 * Container component for notifications grouped by position
 * @param {Object} props - Component props
 * @param {Array} props.notifications - Array of notification objects
 * @param {string} props.position - Position of notifications (top-right, top-left, bottom-right, bottom-left, top-center, bottom-center)
 * @param {Function} props.onClose - Function to close a notification
 * @returns {React.ReactElement|null} NotificationContainer component or null if no notifications
 */
const NotificationContainer = ({ notifications = [], position = 'top-right', onClose }) => {
  // Don't render if no notifications
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className={`notification-container ${position}`}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          autoClose={notification.autoClose}
          onClose={onClose}
          isLoading={notification.isLoading}
          actions={notification.actions}
        />
      ))}
    </div>
  );
};

export default memo(NotificationContainer); 