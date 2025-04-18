import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import NotificationContainer from '../components/NotificationContainer';
import { setNotificationInstance } from '../utils/toast';
import { v4 as uuidv4 } from 'uuid';

// Initial state for the notification context
const initialState = {
  notifications: [],
  position: 'top-right', // default position
  maxNotifications: 5,   // default max number of notifications shown at once
};

// Actions for the reducer
const ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  REMOVE_ALL_NOTIFICATIONS: 'REMOVE_ALL_NOTIFICATIONS',
  REMOVE_ALL_NOTIFICATIONS_AT_POSITION: 'REMOVE_ALL_NOTIFICATIONS_AT_POSITION',
  UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
  UPDATE_POSITION: 'UPDATE_POSITION',
  UPDATE_MAX_NOTIFICATIONS: 'UPDATE_MAX_NOTIFICATIONS',
};

// Reducer function to handle state updates
const notificationReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_NOTIFICATION: {
      const maxExceeded = state.notifications.length >= state.maxNotifications;
      let updatedNotifications = [...state.notifications];
      
      // If max notifications reached, remove the oldest one
      if (maxExceeded) {
        updatedNotifications = state.notifications.slice(1);
      }
      
      return {
        ...state,
        notifications: [...updatedNotifications, action.payload],
      };
    }
    
    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      };
    
    case ACTIONS.REMOVE_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };
    
    case ACTIONS.REMOVE_ALL_NOTIFICATIONS_AT_POSITION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.position !== action.payload
        ),
      };
    
    case ACTIONS.UPDATE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map(notification => 
          notification.id === action.payload.id 
            ? { ...notification, ...action.payload.updates }
            : notification
        ),
      };
    
    case ACTIONS.UPDATE_POSITION:
      return {
        ...state,
        position: action.payload,
      };
    
    case ACTIONS.UPDATE_MAX_NOTIFICATIONS:
      return {
        ...state,
        maxNotifications: action.payload,
      };
    
    default:
      return state;
  }
};

// Create the context
const NotificationContext = createContext(null);

// Default notification options
const defaultOptions = {
  type: 'info',
  duration: 5000,      // 5 seconds
  autoClose: true,
  onClose: () => {},
  position: null,      // Will use context default if null
  actions: [],         // Array of action buttons
};

// Provider component
export const NotificationProvider = ({ children, position, maxNotifications }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    ...initialState,
    position: position || initialState.position,
    maxNotifications: maxNotifications || initialState.maxNotifications,
  });

  // Add a new notification
  const addNotification = useCallback((title, message, options = {}) => {
    const id = options.id || uuidv4();
    
    // Ensure title and message are strings
    const safeTitle = typeof title === 'string' ? title : String(title);
    const safeMessage = typeof message === 'string' ? message : String(message);
    
    const notification = {
      id,
      title: safeTitle,
      message: safeMessage,
      createdAt: new Date(),
      ...defaultOptions,
      ...options,
    };

    dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: notification });
    return id;
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id) => {
    dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: id });
  }, []);

  // Remove all notifications
  const removeAllNotifications = useCallback((position) => {
    if (position) {
      // If position is provided, only remove notifications at that position
      dispatch({ 
        type: ACTIONS.REMOVE_ALL_NOTIFICATIONS_AT_POSITION, 
        payload: position 
      });
    } else {
      // Otherwise remove all notifications
      dispatch({ type: ACTIONS.REMOVE_ALL_NOTIFICATIONS });
    }
  }, []);
  
  // Alias for removeAllNotifications for better API compatibility
  const clearAll = removeAllNotifications;

  // Update an existing notification
  const updateNotification = useCallback((id, updates) => {
    // Sanitize updates to ensure title and message are strings
    const sanitizedUpdates = { ...updates };
    
    if (updates.title !== undefined && typeof updates.title !== 'string') {
      sanitizedUpdates.title = String(updates.title);
    }
    
    if (updates.message !== undefined && typeof updates.message !== 'string') {
      sanitizedUpdates.message = String(updates.message);
    }
    
    dispatch({ 
      type: ACTIONS.UPDATE_NOTIFICATION, 
      payload: { id, updates: sanitizedUpdates } 
    });
  }, []);

  // Update position
  const updatePosition = useCallback((position) => {
    dispatch({ type: ACTIONS.UPDATE_POSITION, payload: position });
  }, []);

  // Update max notifications
  const updateMaxNotifications = useCallback((maxNotifications) => {
    dispatch({ type: ACTIONS.UPDATE_MAX_NOTIFICATIONS, payload: maxNotifications });
  }, []);

  // Shorthand methods for different notification types
  const success = useCallback((title, message, options = {}) => {
    // Handle different parameter combinations
    if (typeof message === 'object' && message !== null) {
      // If called as success(message, options)
      options = message;
      message = title;
      title = 'Success';
    } else if (message === undefined) {
      // If called as success(message)
      message = title;
      title = 'Success';
    }
    
    // Make sure message is a string
    message = typeof message === 'string' ? message : JSON.stringify(message);
    
    return addNotification(title, message, { ...options, type: 'success' });
  }, [addNotification]);

  const error = useCallback((title, message, options = {}) => {
    // Handle different parameter combinations
    if (typeof message === 'object' && message !== null) {
      // If called as error(message, options)
      options = message;
      message = title;
      title = 'Error';
    } else if (message === undefined) {
      // If called as error(message)
      message = title;
      title = 'Error';
    }
    
    // Make sure message is a string
    message = typeof message === 'string' ? message : JSON.stringify(message);
    
    return addNotification(title, message, { ...options, type: 'error' });
  }, [addNotification]);

  const warning = useCallback((title, message, options = {}) => {
    // Handle different parameter combinations
    if (typeof message === 'object' && message !== null) {
      // If called as warning(message, options)
      options = message;
      message = title;
      title = 'Warning';
    } else if (message === undefined) {
      // If called as warning(message)
      message = title;
      title = 'Warning';
    }
    
    // Make sure message is a string
    message = typeof message === 'string' ? message : JSON.stringify(message);
    
    return addNotification(title, message, { ...options, type: 'warning' });
  }, [addNotification]);

  const info = useCallback((title, message, options = {}) => {
    // Handle different parameter combinations
    if (typeof message === 'object' && message !== null) {
      // If called as info(message, options)
      options = message;
      message = title;
      title = 'Info';
    } else if (message === undefined) {
      // If called as info(message)
      message = title;
      title = 'Info';
    }
    
    // Make sure message is a string
    message = typeof message === 'string' ? message : JSON.stringify(message);
    
    return addNotification(title, message, { ...options, type: 'info' });
  }, [addNotification]);

  // Loading notification with update capability
  const loading = useCallback((title, message, options = {}) => {
    const id = options.id || uuidv4();
    
    // Ensure title and message are strings
    const safeTitle = typeof title === 'string' ? title : String(title || 'Loading');
    const safeMessage = typeof message === 'string' ? message : String(message || 'Please wait...');
    
    addNotification(safeTitle, safeMessage, { 
      ...options, 
      type: 'loading',
      id,
      autoClose: false,
      duration: 0
    });
    
    return {
      id,
      success: (newTitle, newMessage, newOptions = {}) => {
        // Ensure new title and message are strings
        const safeNewTitle = typeof newTitle === 'string' ? newTitle : String(newTitle || safeTitle);
        const safeNewMessage = typeof newMessage === 'string' ? newMessage : String(newMessage || safeMessage);
        
        updateNotification(id, { 
          type: 'success',
          title: safeNewTitle,
          message: safeNewMessage,
          autoClose: newOptions.autoClose !== undefined ? newOptions.autoClose : true,
          duration: newOptions.duration !== undefined ? newOptions.duration : defaultOptions.duration,
          ...newOptions
        });
      },
      error: (newTitle, newMessage, newOptions = {}) => {
        // Ensure new title and message are strings
        const safeNewTitle = typeof newTitle === 'string' ? newTitle : String(newTitle || safeTitle);
        const safeNewMessage = typeof newMessage === 'string' ? newMessage : String(newMessage || safeMessage);
        
        updateNotification(id, { 
          type: 'error',
          title: safeNewTitle,
          message: safeNewMessage,
          autoClose: newOptions.autoClose !== undefined ? newOptions.autoClose : true,
          duration: newOptions.duration !== undefined ? newOptions.duration : defaultOptions.duration,
          ...newOptions
        });
      },
      update: (updates) => {
        // If updates contain title or message, ensure they are strings
        const safeUpdates = { ...updates };
        if (updates.title && typeof updates.title !== 'string') {
          safeUpdates.title = String(updates.title);
        }
        if (updates.message && typeof updates.message !== 'string') {
          safeUpdates.message = String(updates.message);
        }
        
        updateNotification(id, safeUpdates);
      },
      remove: () => {
        removeNotification(id);
      }
    };
  }, [addNotification, updateNotification, removeNotification]);

  // Add support for notify function that matches useNotifications hook
  const notify = useCallback((optionsOrMessage, maybeOptions) => {
    // Check if first argument is an object (object-style call) or a string (method-style call)
    if (typeof optionsOrMessage === 'object' && optionsOrMessage !== null) {
      // Object-style call: notify({ type: 'info', message: 'Hello', ... })
      const options = optionsOrMessage;
      
      // Extract message, title, and type
      const { message, title, type = 'info', ...restOptions } = options;
      
      // Ensure we always have strings for message and title
      let safeTitle = title;
      let safeMessage = message;
      
      // Convert non-string values to strings
      if (safeTitle && typeof safeTitle !== 'string') {
        safeTitle = String(safeTitle);
      }
      
      if (safeMessage && typeof safeMessage !== 'string') {
        safeMessage = String(safeMessage);
      }
      
      if (typeof safeMessage === 'string' && typeof safeTitle === 'string') {
        return addNotification(safeTitle, safeMessage, { type, ...restOptions });
      } else if (typeof safeMessage === 'string') {
        return addNotification(type.charAt(0).toUpperCase() + type.slice(1), safeMessage, { type, ...restOptions });
      } else if (typeof safeTitle === 'string') {
        // If only title is provided, use it as the message
        return addNotification(type.charAt(0).toUpperCase() + type.slice(1), safeTitle, { type, ...restOptions });
      } else {
        console.error('Notification must have at least a message or title as a string');
        return null;
      }
    } else {
      // Method-style call: notify('Hello', { title: 'Info', ... })
      const message = optionsOrMessage;
      const options = maybeOptions || {};
      
      // Use info type as default
      const type = options.type || 'info';
      const title = options.title || type.charAt(0).toUpperCase() + type.slice(1);
      
      // Ensure message is a string
      const safeMessage = typeof message === 'string' ? message : String(message || '');
      
      return addNotification(title, safeMessage, { type, ...options });
    }
  }, [addNotification]);

  // Create the context value
  const contextValue = useMemo(() => ({
    notifications: state.notifications,
    position: state.position,
    maxNotifications: state.maxNotifications,
    addNotification,
    removeNotification,
    removeAllNotifications,
    clearAll,
    updateNotification,
    updatePosition,
    updateMaxNotifications,
    // Shorthand methods
    success,
    error,
    warning,
    info,
    loading,
    notify, // Add notify function for compatibility
  }), [
    state,
    addNotification,
    removeNotification,
    removeAllNotifications,
    clearAll,
    updateNotification,
    updatePosition,
    updateMaxNotifications,
    success,
    error,
    warning,
    info,
    loading,
    notify
  ]);

  // Register the notification instance with the toast utility
  useEffect(() => {
    setNotificationInstance(contextValue);
    return () => setNotificationInstance(null);
  }, [contextValue]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer 
        notifications={state.notifications} 
        position={state.position}
        onClose={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

// Custom hook for using the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext; 