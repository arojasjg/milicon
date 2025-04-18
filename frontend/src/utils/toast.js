/**
 * Global toast notification utility
 * Provides an easier way to use notifications without hooks
 */

// Will be initialized by the NotificationProvider
let notificationInstance = null;

// Set the notification instance (called by NotificationProvider)
export const setNotificationInstance = (instance) => {
  notificationInstance = instance;
};

// Utility wrapper for notifications
const toast = {
  /**
   * Show success notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {Object} options - Configuration options
   */
  success: (title, message, options = {}) => {
    if (!notificationInstance) {
      console.warn('Toast: Notification system not initialized');
      return;
    }
    
    // Support both parameter styles
    if (typeof message === 'object' && message !== null) {
      // Called as success(message, options)
      options = message;
      message = title;
      title = 'Success';
    }
    
    return notificationInstance.success(title, message, options);
  },

  /**
   * Show error notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {Object} options - Configuration options
   */
  error: (title, message, options = {}) => {
    if (!notificationInstance) {
      console.warn('Toast: Notification system not initialized');
      return;
    }
    
    // Support both parameter styles
    if (typeof message === 'object' && message !== null) {
      // Called as error(message, options)
      options = message;
      message = title;
      title = 'Error';
    }
    
    return notificationInstance.error(title, message, options);
  },

  /**
   * Show warning notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {Object} options - Configuration options
   */
  warning: (title, message, options = {}) => {
    if (!notificationInstance) {
      console.warn('Toast: Notification system not initialized');
      return;
    }
    
    // Support both parameter styles
    if (typeof message === 'object' && message !== null) {
      // Called as warning(message, options)
      options = message;
      message = title;
      title = 'Warning';
    }
    
    return notificationInstance.warning(title, message, options);
  },

  /**
   * Show info notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {Object} options - Configuration options
   */
  info: (title, message, options = {}) => {
    if (!notificationInstance) {
      console.warn('Toast: Notification system not initialized');
      return;
    }
    
    // Support both parameter styles
    if (typeof message === 'object' && message !== null) {
      // Called as info(message, options)
      options = message;
      message = title;
      title = 'Info';
    }
    
    return notificationInstance.info(title, message, options);
  },

  /**
   * Show custom notification
   * @param {Object|string} optionsOrMessage - Notification options object or message string
   * @param {Object} [maybeOptions] - Configuration options if first param is a message
   */
  notify: (optionsOrMessage, maybeOptions) => {
    if (!notificationInstance) {
      console.warn('Toast: Notification system not initialized');
      return;
    }
    
    // Support both call styles
    if (typeof optionsOrMessage === 'object' && optionsOrMessage !== null) {
      // Called with options object
      return notificationInstance.notify(optionsOrMessage);
    } else {
      // Called with message string and options
      const options = maybeOptions || {};
      options.message = optionsOrMessage;
      return notificationInstance.notify(options);
    }
  },

  /**
   * Clear all notifications
   */
  clearAll: () => {
    if (!notificationInstance) {
      console.warn('Toast: Notification system not initialized');
      return;
    }
    // Use removeAllNotifications or clearAll, depending on what's available
    if (notificationInstance.removeAllNotifications) {
      notificationInstance.removeAllNotifications();
    } else if (notificationInstance.clearAll) {
      notificationInstance.clearAll();
    }
  }
};

// Create a function version that also has all methods attached
const toastFunction = (optionsOrMessage, maybeOptions) => {
  return toast.notify(optionsOrMessage, maybeOptions);
};

// Add all methods to the function
Object.keys(toast).forEach(key => {
  toastFunction[key] = toast[key];
});

export default toastFunction; 