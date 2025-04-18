import axios from 'axios';

/**
 * API service configuration
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const TIMEOUT = 15000; // 15 seconds

/**
 * Configure axios instance with default config
 */
const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add auth token to requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common errors and token refreshing
 */
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Check if we're already on the login page or trying to refresh token
        // This prevents infinite refresh loops
        if (window.location.pathname === '/login' || originalRequest.url.includes('refresh-token')) {
          throw new Error('Already on login page or trying to refresh token');
        }
        
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        const newToken = response.data.token;
        
        if (newToken) {
          // Store new token in the same storage used before
          if (localStorage.getItem('rememberMe') === 'true') {
            localStorage.setItem('token', newToken);
          } else {
            sessionStorage.setItem('token', newToken);
          }
          
          // Update authorization header and retry original request
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear invalid token
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?session_expired=true';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Reusable API methods
export const apiService = {
  /**
   * GET request
   * 
   * @param {string} url - The endpoint URL
   * @param {Object} params - URL parameters
   * @returns {Promise} Promise object with response data
   */
  get: (url, params = {}) => {
    return api.get(url, { params });
  },
  
  /**
   * POST request
   * 
   * @param {string} url - The endpoint URL
   * @param {Object} data - Request body data
   * @returns {Promise} Promise object with response data
   */
  post: (url, data = {}) => {
    return api.post(url, data);
  },
  
  /**
   * PUT request
   * 
   * @param {string} url - The endpoint URL
   * @param {Object} data - Request body data
   * @returns {Promise} Promise object with response data
   */
  put: (url, data = {}) => {
    return api.put(url, data);
  },
  
  /**
   * DELETE request
   * 
   * @param {string} url - The endpoint URL
   * @returns {Promise} Promise object with response data
   */
  delete: (url) => {
    return api.delete(url);
  },
  
  /**
   * Upload file(s)
   * 
   * @param {string} url - The endpoint URL
   * @param {FormData} formData - Form data with files
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Promise object with response data
   */
  upload: (url, formData, onProgress) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
  },
};

export default apiService; 