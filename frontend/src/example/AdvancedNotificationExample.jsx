import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';

/**
 * Advanced example showcasing all notification features
 */
const AdvancedNotificationExample = () => {
  const { notify, success, error, info, clearAll } = useNotifications();
  const [position, setPosition] = useState('top-right');

  // Demo notification with actions
  const showNotificationWithActions = () => {
    notify({
      type: 'info',
      title: 'Update Available',
      message: 'A new version of the app is available. Would you like to update now?',
      autoClose: false,
      position,
      actions: [
        {
          label: 'Update Now',
          variant: 'primary',
          onClick: (close) => {
            close();
            success('Update started successfully!', { position });
          }
        },
        {
          label: 'Later',
          variant: 'secondary',
          onClick: (close) => close()
        }
      ]
    });
  };

  // Notification with different position
  const showNotificationAtPosition = (selectedPosition) => {
    info(`This notification appears at the ${selectedPosition} position`, {
      title: 'Position Demo',
      position: selectedPosition
    });
  };

  // Error notification with action
  const showErrorWithAction = () => {
    error('There was a problem connecting to the server', {
      title: 'Connection Failed',
      position,
      autoClose: false,
      actions: [
        {
          label: 'Retry',
          onClick: (close) => {
            close();
            info('Attempting to reconnect...', { position });
            
            // Simulate reconnection attempt
            setTimeout(() => {
              success('Connection restored!', { position });
            }, 2000);
          }
        },
        {
          label: 'Dismiss',
          variant: 'text',
          onClick: (close) => close()
        }
      ]
    });
  };

  // Success notification with details
  const showSuccessWithDetails = () => {
    success('Your order has been placed successfully!', {
      title: 'Order Confirmed',
      position,
      actions: [
        {
          label: 'View Order',
          onClick: (close) => {
            close();
            info('Navigating to order details...', { position });
          }
        }
      ]
    });
  };

  // Clear notifications at the current position
  const clearPositionNotifications = () => {
    clearAll(position);
    info(`Cleared notifications at ${position}`, {
      position: 'top-center', // Show this one in a different position
      duration: 2000
    });
  };

  return (
    <div className="advanced-notification-example">
      <h2>Advanced Notification Features</h2>
      
      <div className="settings-panel">
        <h3>Settings</h3>
        <div className="setting-group">
          <label htmlFor="position-select">Notification Position:</label>
          <select 
            id="position-select"
            value={position} 
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-center">Top Center</option>
            <option value="bottom-center">Bottom Center</option>
          </select>
        </div>
      </div>
      
      <div className="demo-section">
        <h3>Notification Types with Actions</h3>
        <div className="button-group">
          <button 
            className="btn btn-info" 
            onClick={showNotificationWithActions}
          >
            With Actions
          </button>
          
          <button 
            className="btn btn-danger" 
            onClick={showErrorWithAction}
          >
            Error with Retry
          </button>
          
          <button 
            className="btn btn-success" 
            onClick={showSuccessWithDetails}
          >
            Success with Details
          </button>
        </div>
      </div>
      
      <div className="demo-section">
        <h3>Different Positions</h3>
        <div className="button-group">
          <button 
            className="btn btn-secondary" 
            onClick={() => showNotificationAtPosition('top-right')}
          >
            Top Right
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => showNotificationAtPosition('top-left')}
          >
            Top Left
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => showNotificationAtPosition('bottom-right')}
          >
            Bottom Right
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => showNotificationAtPosition('bottom-left')}
          >
            Bottom Left
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => showNotificationAtPosition('top-center')}
          >
            Top Center
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => showNotificationAtPosition('bottom-center')}
          >
            Bottom Center
          </button>
        </div>
      </div>
      
      <div className="demo-section">
        <h3>Management</h3>
        <div className="button-group">
          <button 
            className="btn btn-warning" 
            onClick={clearPositionNotifications}
          >
            Clear Current Position
          </button>
          
          <button 
            className="btn btn-outline-danger" 
            onClick={() => clearAll()}
          >
            Clear All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedNotificationExample; 