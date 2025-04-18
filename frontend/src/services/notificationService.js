/**
 * Notification Service
 * A utility service to handle API responses and display appropriate notifications
 */
import toast from '../utils/toast';

// Default notification options
const DEFAULT_OPTIONS = {
  success: {
    duration: 5000,
    autoClose: true
  },
  error: {
    duration: 7000,
    autoClose: true
  },
  warning: {
    duration: 6000,
    autoClose: true
  },
  info: {
    duration: 5000,
    autoClose: true
  }
};

/**
 * Process error messages from various API error formats
 * @param {Error} error - Error object from API call
 * @returns {string} Formatted error message
 */
const extractErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Handle Axios error responses
  if (error.response) {
    // Server responded with error status
    const { data, status } = error.response;
    
    // Handle validation errors (typically 400 responses with validation details)
    if (status === 400 && data.errors) {
      // Format validation errors
      const validationErrors = Object.entries(data.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(', ');
      
      return `Validation error: ${validationErrors}`;
    }
    
    // Use the server's error message if available
    if (data.message) return data.message;
    if (data.error) return data.error;
    
    // Fallback to HTTP status
    return `Request failed with status code ${status}`;
  }
  
  // Network errors or request canceled
  if (error.request) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    return 'Network error. Please check your connection.';
  }
  
  // Other errors
  return error.message || 'An error occurred';
};

/**
 * Notification service to standardize API response handling
 */
const notificationService = {
  /**
   * Handle API success response and display notification
   * 
   * @param {Function} notifyFn - Notification function from useNotifications or toast
   * @param {Object} response - API response object
   * @param {Object} options - Notification options
   * @returns {Object} Original response
   */
  handleSuccess: (notifyFn, response, options = {}) => {
    // Ensure message is a string
    let message = 
      options.message || 
      (response?.message) || 
      'Operation completed successfully';
      
    if (typeof message !== 'string') {
      message = String(message);
    }
      
    let title = options.title || 'Success';
    if (typeof title !== 'string') {
      title = String(title);
    }
    
    notifyFn(message, {
      ...DEFAULT_OPTIONS.success,
      title,
      ...options
    });
    
    return response;
  },
  
  /**
   * Handle API error and display notification
   * 
   * @param {Function} notifyFn - Notification function from useNotifications or toast
   * @param {Error} error - Error object
   * @param {Object} options - Notification options
   * @throws {Error} Rethrows the original error after notification
   */
  handleError: (notifyFn, error, options = {}) => {
    // Extract error message from various API error formats
    let message = options.message || extractErrorMessage(error);
    if (typeof message !== 'string') {
      message = String(message);
    }
    
    let title = options.title || 'Error';
    if (typeof title !== 'string') {
      title = String(title);
    }
    
    notifyFn(message, {
      ...DEFAULT_OPTIONS.error,
      title,
      ...options
    });
    
    // Rethrow to allow further error handling
    throw error;
  },
  
  /**
   * Generic API call handler with notifications
   * 
   * @param {Function} apiFn - API function to call
   * @param {Object} notifications - useNotifications hook object or toast
   * @param {Object} options - Notification options
   * @returns {Promise} API call result
   */
  handleApiCall: async (apiFn, notifications, options = {}) => {
    try {
      const response = await apiFn();
      
      if (options.showSuccessNotification !== false) {
        // Use success function from notifications object
        const successFn = notifications.success || toast.success;
        
        notificationService.handleSuccess(
          successFn, 
          response, 
          options.successOptions || {}
        );
      }
      
      return response;
    } catch (error) {
      if (options.showErrorNotification !== false) {
        // Use error function from notifications object
        const errorFn = notifications.error || toast.error;
        
        notificationService.handleError(
          errorFn, 
          error, 
          options.errorOptions || {}
        );
      }
      
      throw error;
    }
  },

  /**
   * Display a loading notification that updates when process completes
   * 
   * @param {Function} apiFn - API function to call
   * @param {Object} notifications - useNotifications hook object
   * @param {Object} options - Notification options
   * @returns {Promise} API call result
   */
  handleLoadingOperation: async (apiFn, notifications, options = {}) => {
    // Ensure loading message and title are strings
    const loadingMessage = options.loadingMessage || 'Processing request...';
    const loadingTitle = options.loadingTitle || 'Loading';
    
    const safeLoadingMessage = typeof loadingMessage === 'string' ? loadingMessage : String(loadingMessage);
    const safeLoadingTitle = typeof loadingTitle === 'string' ? loadingTitle : String(loadingTitle);
    
    // Create a unique notification ID for this operation
    const loadingNotification = notifications.info(
      safeLoadingMessage, 
      {
        title: safeLoadingTitle,
        autoClose: false,
        ...options.loadingOptions
      }
    );
    
    // Keep track of the notification ID
    const loadingNotifId = typeof loadingNotification === 'string' 
      ? loadingNotification 
      : loadingNotification.id || loadingNotification.notificationId;
    
    try {
      const response = await apiFn();
      
      // Remove loading notification if we have a removal function
      if (notifications.removeNotification) {
        notifications.removeNotification(loadingNotifId);
      } else if (notifications.remove) {
        notifications.remove(loadingNotifId);
      }
      
      // Show success notification
      if (options.showSuccessNotification !== false) {
        // Ensure success message and title are strings
        const successMessage = options.successMessage || response?.message || 'Operation completed successfully';
        const successTitle = options.successTitle || 'Success';
        
        const safeSuccessMessage = typeof successMessage === 'string' ? successMessage : String(successMessage);
        const safeSuccessTitle = typeof successTitle === 'string' ? successTitle : String(successTitle);
        
        notifications.success(
          safeSuccessMessage,
          {
            title: safeSuccessTitle,
            ...DEFAULT_OPTIONS.success,
            ...options.successOptions
          }
        );
      }
      
      return response;
    } catch (error) {
      // Remove loading notification
      if (notifications.removeNotification) {
        notifications.removeNotification(loadingNotifId);
      } else if (notifications.remove) {
        notifications.remove(loadingNotifId);
      }
      
      // Show error notification
      if (options.showErrorNotification !== false) {
        // Ensure error message and title are strings
        const errorMessage = options.errorMessage || extractErrorMessage(error);
        const errorTitle = options.errorTitle || 'Error';
        
        const safeErrorMessage = typeof errorMessage === 'string' ? errorMessage : String(errorMessage);
        const safeErrorTitle = typeof errorTitle === 'string' ? errorTitle : String(errorTitle);
        
        notifications.error(
          safeErrorMessage,
          {
            title: safeErrorTitle,
            ...DEFAULT_OPTIONS.error,
            ...options.errorOptions
          }
        );
      }
      
      throw error;
    }
  }
};

export default notificationService; 