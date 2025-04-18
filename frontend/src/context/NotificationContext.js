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
export const NotificationContext = createContext(null);

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
    const notification = {
      id,
      title,
      message,
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
  const removeAllNotifications = useCallback(() => {
    dispatch({ type: ACTIONS.REMOVE_ALL_NOTIFICATIONS });
  }, []);

  // Update an existing notification
  const updateNotification = useCallback((id, updates) => {
    dispatch({ 
      type: ACTIONS.UPDATE_NOTIFICATION, 
      payload: { id, updates } 
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
    return addNotification(title, message, { ...options, type: 'success' });
  }, [addNotification]);

  const error = useCallback((title, message, options = {}) => {
    return addNotification(title, message, { ...options, type: 'error' });
  }, [addNotification]);

  const warning = useCallback((title, message, options = {}) => {
    return addNotification(title, message, { ...options, type: 'warning' });
  }, [addNotification]);

  const info = useCallback((title, message, options = {}) => {
    return addNotification(title, message, { ...options, type: 'info' });
  }, [addNotification]);

  // Loading notification with update capability
  const loading = useCallback((title, message, options = {}) => {
    const id = options.id || uuidv4();
    addNotification(title, message, { 
      ...options, 
      type: 'loading',
      id,
      autoClose: false,
      duration: 0
    });
    
    return {
      id,
      success: (newTitle, newMessage, newOptions = {}) => {
        updateNotification(id, { 
          type: 'success',
          title: newTitle || title,
          message: newMessage || message,
          autoClose: newOptions.autoClose !== undefined ? newOptions.autoClose : true,
          duration: newOptions.duration !== undefined ? newOptions.duration : defaultOptions.duration,
          ...newOptions
        });
      },
      error: (newTitle, newMessage, newOptions = {}) => {
        updateNotification(id, { 
          type: 'error',
          title: newTitle || title,
          message: newMessage || message,
          autoClose: newOptions.autoClose !== undefined ? newOptions.autoClose : true,
          duration: newOptions.duration !== undefined ? newOptions.duration : defaultOptions.duration,
          ...newOptions
        });
      },
      update: (updates) => {
        updateNotification(id, updates);
      },
      remove: () => {
        removeNotification(id);
      }
    };
  }, [addNotification, updateNotification, removeNotification]);

  // Create the context value
  const contextValue = useMemo(() => ({
    notifications: state.notifications,
    position: state.position,
    maxNotifications: state.maxNotifications,
    addNotification,
    removeNotification,
    removeAllNotifications,
    updateNotification,
    updatePosition,
    updateMaxNotifications,
    // Shorthand methods
    success,
    error,
    warning,
    info,
    loading,
  }), [
    state,
    addNotification,
    removeNotification,
    removeAllNotifications,
    updateNotification,
    updatePosition,
    updateMaxNotifications,
    success,
    error,
    warning,
    info,
    loading
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