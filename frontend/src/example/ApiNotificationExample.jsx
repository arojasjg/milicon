import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import notificationService from '../services/notificationService';
import './ApiNotificationExample.css';

/**
 * Example component showing how to use notifications with API calls
 */
const ApiNotificationExample = () => {
  const { success, error, info, warning } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [loadingWithNotification, setLoadingWithNotification] = useState(false);

  // Example 1: Basic success/error notifications with API calls
  const handleSuccessfulApiCall = async () => {
    try {
      setLoading(true);
      
      // Simulate API call with successful response
      const mockApiCall = () => new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            data: { 
              id: 123,
              name: 'Product Example',
              price: 99.99
            },
            message: 'Product retrieved successfully'
          });
        }, 1500);
      });
      
      // Create notifications object with the destructured methods
      const notifications = { success, error, info, warning };
      
      // Execute API call and show success notification
      const response = await notificationService.handleApiCall(
        mockApiCall,
        notifications,
        {
          successOptions: {
            title: 'Product Retrieved',
            duration: 5000
          }
        }
      );
      
      console.log('API response:', response);
    } catch (error) {
      console.error('API error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example 2: API call with error
  const handleFailedApiCall = async () => {
    try {
      setLoading(true);
      
      // Simulate API call with error
      const mockFailedApiCall = () => new Promise((resolve, reject) => {
        setTimeout(() => {
          reject({
            response: {
              data: {
                message: 'Product not found',
                error: 'NotFoundError'
              },
              status: 404
            }
          });
        }, 1500);
      });
      
      // Create notifications object with the destructured methods
      const notifications = { success, error, info, warning };
      
      // Execute API call (will show error notification)
      await notificationService.handleApiCall(
        mockFailedApiCall,
        notifications,
        {
          errorOptions: {
            title: 'Product Error',
            duration: 7000
          }
        }
      );
    } catch (error) {
      console.error('Expected error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example 3: API call with loading notification that updates
  const handleLoadingNotificationExample = async () => {
    try {
      setLoadingWithNotification(true);
      
      // Simulate API call with successful response after delay
      const mockApiCallWithDelay = () => new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            data: { 
              id: 456,
              status: 'completed',
              items: 5
            },
            message: 'Order processed successfully'
          });
        }, 3000);
      });
      
      // Create notifications object with the destructured methods
      const notifications = { success, error, info, warning };
      
      // Execute API call with loading notification
      const response = await notificationService.handleLoadingOperation(
        mockApiCallWithDelay,
        notifications,
        {
          loadingTitle: 'Processing Order',
          loadingMessage: 'Please wait while we process your order...',
          successTitle: 'Order Confirmed',
          successMessage: 'Your order has been successfully processed!'
        }
      );
      
      console.log('API response with loading:', response);
    } catch (error) {
      console.error('API error:', error);
    } finally {
      setLoadingWithNotification(false);
    }
  };

  // Example 4: API call with validation errors
  const handleValidationErrorExample = async () => {
    try {
      setLoading(true);
      
      // Simulate API call with validation errors
      const mockValidationErrorCall = () => new Promise((resolve, reject) => {
        setTimeout(() => {
          reject({
            response: {
              data: {
                message: 'Validation failed',
                errors: {
                  email: 'Invalid email format',
                  password: 'Password must be at least 8 characters',
                  name: 'Name is required'
                }
              },
              status: 400
            }
          });
        }, 1500);
      });
      
      // Create notifications object with the destructured methods
      const notifications = { success, error, info, warning };
      
      // Execute API call (will show detailed validation errors)
      await notificationService.handleApiCall(
        mockValidationErrorCall,
        notifications,
        {
          errorOptions: {
            title: 'Form Validation Failed',
            duration: 10000,
            autoClose: false
          }
        }
      );
    } catch (error) {
      console.error('Validation error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-notification-example">
      <h2>API Integration Examples</h2>
      <p>
        These examples demonstrate how to use notifications with API calls.
      </p>

      <div className="examples-grid">
        <div className="example-card">
          <h3>Success Response</h3>
          <p>Demonstrates handling a successful API response with notifications.</p>
          <button 
            onClick={handleSuccessfulApiCall} 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Loading...' : 'Simulate Successful API Call'}
          </button>
        </div>

        <div className="example-card">
          <h3>Error Response</h3>
          <p>Demonstrates handling an API error with notifications.</p>
          <button 
            onClick={handleFailedApiCall} 
            disabled={loading}
            className="btn btn-danger"
          >
            {loading ? 'Loading...' : 'Simulate Failed API Call'}
          </button>
        </div>

        <div className="example-card">
          <h3>Loading Notification</h3>
          <p>Shows a loading notification that updates when the operation completes.</p>
          <button 
            onClick={handleLoadingNotificationExample} 
            disabled={loadingWithNotification}
            className="btn btn-info"
          >
            {loadingWithNotification ? 'Processing...' : 'Show Loading Notification'}
          </button>
        </div>

        <div className="example-card">
          <h3>Validation Errors</h3>
          <p>Demonstrates handling form validation errors with notifications.</p>
          <button 
            onClick={handleValidationErrorExample} 
            disabled={loading}
            className="btn btn-warning"
          >
            {loading ? 'Loading...' : 'Show Validation Errors'}
          </button>
        </div>
      </div>

      <div className="code-example">
        <h3>Code Example</h3>
        <pre>
          <code>{`
import { useNotifications } from '../hooks/useNotifications';
import notificationService from '../services/notificationService';

function MyComponent() {
  const { success, error, info, warning } = useNotifications();
  
  const handleSubmit = async (formData) => {
    try {
      // Use the notification service to handle API call
      const response = await notificationService.handleApiCall(
        () => api.post('/endpoint', formData),
        { success, error, info, warning },
        {
          successOptions: {
            title: 'Success',
            message: 'Your data has been saved'
          },
          errorOptions: {
            title: 'Error',
            duration: 7000
          }
        }
      );
      
      // Process response
      console.log(response);
    } catch (error) {
      // Error is already handled by notification service
      console.error(error);
    }
  };
}
`}</code>
        </pre>
      </div>
    </div>
  );
};

export default ApiNotificationExample; 