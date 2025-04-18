import { useContext } from 'react';
import NotificationContext from '../context/NotificationContext';

/**
 * Custom hook for using the notification system
 * @returns {Object} Notification methods including success, error, warning, info, notify, etc.
 */
const useNotifications = () => {
  // Get the context value which includes all the notification functions
  const context = useContext(NotificationContext);
  
  // Make sure the hook is used within a NotificationProvider
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  // Return the context which already contains all the notification methods
  return context;
};

// Export as both default export (recommended) and named export (for backwards compatibility)
export { useNotifications };
export default useNotifications; 