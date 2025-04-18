import React, { useState } from 'react';
import NotificationExample from '../example/NotificationExample';
import ApiNotificationExample from '../example/ApiNotificationExample';
import { useNotifications } from '../hooks/useNotifications';
import './NotificationDemo.css';

/**
 * Comprehensive demonstration of the notification system
 */
const NotificationDemo = () => {
  const [activeTab, setActiveTab] = useState('examples');
  const { info } = useNotifications();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Show a notification when changing tabs
    const tabName = tab.charAt(0).toUpperCase() + tab.slice(1);
    info(tabName + ' tab selected', {
      title: 'Tab Change',
      duration: 3000
    });
  };

  // Documentation content
  const renderDocContent = () => {
    return (
      <div className="docs-content">
        <h2>Notification System Documentation</h2>
        <p>
          This notification system provides a flexible, accessible way to show feedback to users.
          The system supports multiple notification types, customizable duration, positioning options, and interactive action buttons.
        </p>
        
        <h3>Basic Usage</h3>
        <pre>
          <code>{`// Import the hook
import useNotifications from '../hooks/useNotifications';

// Inside your component
const { success, error, warning, info } = useNotifications();

// Show notifications
success('Operation completed successfully');
error('An error occurred');
warning('Please be careful with this action');
info('Here is some information');`}</code>
        </pre>
        
        <h3>Advanced Usage</h3>
        <pre>
          <code>{`// Show a custom notification
// Get the notify function
const { notify } = useNotifications();

notify({
  type: 'success',
  title: 'Custom Notification',
  message: 'This is a fully customized notification',
  duration: 8000,
  position: 'bottom-right',
  autoClose: true,
  actions: [
    {
      label: 'Action Button',
      onClick: (close) => {
        performAction();
        close();
      },
      variant: 'primary'
    }
  ]
});`}</code>
        </pre>
        
        <p>
          See the complete documentation in <code>src/docs/NOTIFICATION_SYSTEM.md</code> for more details.
        </p>
      </div>
    );
  };

  return (
    <div className="notification-demo-page">
      <div className="demo-header">
        <h1>Notification System Demo</h1>
        <p>Explore and test the notification system components and features</p>
      </div>
      
      <div className="demo-nav">
        <button 
          className={`demo-nav-item ${activeTab === 'examples' ? 'active' : ''}`}
          onClick={() => handleTabChange('examples')}
        >
          Basic Examples
        </button>
        <button 
          className={`demo-nav-item ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => handleTabChange('api')}
        >
          API Integration
        </button>
        <button 
          className={`demo-nav-item ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => handleTabChange('docs')}
        >
          Documentation
        </button>
      </div>
      
      <div className="demo-content">
        {activeTab === 'examples' && <NotificationExample />}
        {activeTab === 'api' && <ApiNotificationExample />}
        {activeTab === 'docs' && renderDocContent()}
      </div>
    </div>
  );
};

export default NotificationDemo; 