/**
 * Unified notification helper that supports both custom notification system and react-toastify
 */

import { toast as reactToastify } from 'react-toastify';
import toast from './toast';

// Check if react-toastify is properly configured
const isToastifyConfigured = () => {
  try {
    // Check if ToastContainer exists in the DOM
    return document.querySelector('.Toastify') !== null;
  } catch (e) {
    return false;
  }
};

/**
 * Unified notification function that works with both notification systems
 * Provides a simplified API that works with both notification systems
 */
export const notify = {
  success: (message, options = {}) => {
    if (isToastifyConfigured()) {
      return reactToastify.success(message, options);
    } else {
      try {
        return toast.success('Success', message, options);
      } catch (error) {
        console.warn('Notification failed:', error);
      }
    }
  },

  error: (message, options = {}) => {
    if (isToastifyConfigured()) {
      return reactToastify.error(message, options);
    } else {
      try {
        return toast.error('Error', message, options);
      } catch (error) {
        console.warn('Notification failed:', error);
      }
    }
  },

  warning: (message, options = {}) => {
    if (isToastifyConfigured()) {
      return reactToastify.warning(message, options);
    } else {
      try {
        return toast.warning('Warning', message, options);
      } catch (error) {
        console.warn('Notification failed:', error);
      }
    }
  },

  info: (message, options = {}) => {
    if (isToastifyConfigured()) {
      return reactToastify.info(message, options);
    } else {
      try {
        return toast.info('Info', message, options);
      } catch (error) {
        console.warn('Notification failed:', error);
      }
    }
  },

  /**
   * Custom notification with object-style options
   * @param {Object} options - Notification options object
   * @returns {string|null} Notification ID or null if failed
   */
  custom: (options = {}) => {
    if (!options || typeof options !== 'object') {
      console.warn('Notification options must be an object');
      return null;
    }

    // Extract type, message, and title from options
    const { type = 'info', message, title, ...restOptions } = options;
    
    // Choose the appropriate method based on type
    switch (type.toLowerCase()) {
      case 'success':
        return notify.success(message, { title, ...restOptions });
      case 'error':
        return notify.error(message, { title, ...restOptions });
      case 'warning':
        return notify.warning(message, { title, ...restOptions });
      case 'info':
      default:
        return notify.info(message, { title, ...restOptions });
    }
  },

  clearAll: () => {
    try {
      toast.clearAll();
    } catch (error) {
      console.warn('Failed to clear notifications:', error);
    }
    
    if (isToastifyConfigured()) {
      reactToastify.dismiss();
    }
  }
};

// Add support for direct function call syntax (backward compatibility)
const notifyFunction = (options) => notify.custom(options);

// Attach all methods to the function for easier access
Object.keys(notify).forEach(key => {
  notifyFunction[key] = notify[key];
});

// Export both as an object and as a function
export default notifyFunction; 