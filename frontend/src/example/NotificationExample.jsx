import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import notify from '../utils/notificationHelper';
import './NotificationExample.css';

/**
 * Example component demonstrating how to use the notification system
 */
const NotificationExample = () => {
  // Get notification functions from the hook
  const { success, error, warning, info, removeAllNotifications: clearAll } = useNotifications();

  // Functions to show different types of notifications
  const showSuccessNotification = () => {
    success('Your changes have been saved successfully.', {
      title: 'Operation Successful',
      duration: 5000
    });
  };

  const showErrorNotification = () => {
    error('There was an error processing your request. Please try again.', {
      title: 'Operation Failed',
      autoClose: false
    });
  };

  const showWarningNotification = () => {
    warning('This action cannot be undone. Please proceed with caution.', {
      title: 'Warning',
      duration: 6000
    });
  };

  const showInfoNotification = () => {
    info('Your session will expire in 5 minutes. Please save your work.', {
      title: 'Information',
      duration: 8000
    });
  };

  const showCustomNotification = () => {
    // Using direct function call style (object format)
    notify({
      type: 'info',
      title: 'Custom Notification',
      message: 'This is a custom notification with actions and a longer duration.',
      duration: 10000,
      actions: [
        {
          label: 'View Details',
          onClick: (close) => {
            alert('Viewing details...');
            close();
          },
          variant: 'primary'
        },
        {
          label: 'Dismiss',
          onClick: (close) => close(),
          variant: 'secondary'
        }
      ]
    });
  };

  const showNotificationsAtDifferentPositions = () => {
    // Top-left notification (method style)
    notify.info('This notification appears at the top-left', {
      title: 'Top Left',
      position: 'top-left'
    });
    
    // Bottom-right notification (object style)
    notify({
      type: 'success',
      title: 'Bottom Right',
      message: 'This notification appears at the bottom-right',
      position: 'bottom-right'
    });
    
    // Bottom-left notification (method style)
    notify.warning('This notification appears at the bottom-left', {
      title: 'Bottom Left',
      position: 'bottom-left'
    });
    
    // Top-center notification (object style)
    notify({
      type: 'error',
      title: 'Top Center',
      message: 'This notification appears at the top-center',
      position: 'top-center'
    });
  };

  return (
    <div className="notification-example">
      <h2>Notification Examples</h2>
      <p>
        Click the buttons below to display different types of notifications.
      </p>

      <div className="button-group">
        <button onClick={showSuccessNotification} className="btn btn-success">
          Success Notification
        </button>
        <button onClick={showErrorNotification} className="btn btn-danger">
          Error Notification
        </button>
        <button onClick={showWarningNotification} className="btn btn-warning">
          Warning Notification
        </button>
        <button onClick={showInfoNotification} className="btn btn-info">
          Info Notification
        </button>
        <button onClick={showCustomNotification} className="btn btn-primary">
          Custom with Actions
        </button>
        <button onClick={showNotificationsAtDifferentPositions} className="btn btn-secondary">
          Different Positions
        </button>
        <button onClick={clearAll} className="btn btn-outline-secondary">
          Clear All Notifications
        </button>
      </div>

      <div className="code-example">
        <h3>Basic Usage Example</h3>
        <pre>
          <code>{`import { useNotifications } from '../hooks/useNotifications';

// Inside your component
const { success, error, warning, info } = useNotifications();

// Show a success notification
success('Your changes have been saved successfully.', {
  title: 'Operation Successful',
  duration: 5000
});

// Show an error notification with no auto-close
error('There was an error processing your request.', {
  title: 'Operation Failed',
  autoClose: false
});`}</code>
        </pre>
      </div>
      
      <div className="code-example">
        <h3>Advanced Usage Example</h3>
        <pre>
          <code>{`// Import the notification helper
import notify from '../utils/notificationHelper';

// Method style
notify.info('This is a notification message', {
  title: 'Custom Notification',
  duration: 10000
});

// Object style
notify({
  type: 'info',
  title: 'Custom Notification',
  message: 'This is a custom notification with actions.',
  duration: 10000,
  position: 'bottom-right',
  actions: [
    {
      label: 'View Details',
      onClick: (close) => {
        // Do something
        close();
      },
      variant: 'primary'
    },
    {
      label: 'Dismiss',
      onClick: (close) => close(),
      variant: 'secondary'
    }
  ]
});`}</code>
        </pre>
      </div>
    </div>
  );
};

export default NotificationExample; 