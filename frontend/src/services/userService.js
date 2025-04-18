import api from './api';

/**
 * Service for user-related API calls
 */
const userService = {
  /**
   * Register a new user
   * 
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise with the created user data
   */
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  
  /**
   * Login user
   * 
   * @param {Object} credentials - Login credentials
   * @returns {Promise} Promise with auth token and user data
   */
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  /**
   * Logout user (clears token)
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  /**
   * Get current user profile
   * 
   * @returns {Promise} Promise with user profile data
   */
  getProfile: () => {
    return api.get('/users/profile');
  },
  
  /**
   * Update user profile
   * 
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Promise with updated profile data
   */
  updateProfile: (profileData) => {
    return api.put('/users/profile', profileData);
  },
  
  /**
   * Change user password
   * 
   * @param {Object} passwordData - Current and new password
   * @returns {Promise} Promise with success message
   */
  changePassword: (passwordData) => {
    return api.post('/users/change-password', passwordData);
  },
  
  /**
   * Get user addresses
   * 
   * @returns {Promise} Promise with user addresses
   */
  getAddresses: () => {
    return api.get('/users/addresses');
  },
  
  /**
   * Add new address
   * 
   * @param {Object} addressData - Address data
   * @returns {Promise} Promise with created address
   */
  addAddress: (addressData) => {
    return api.post('/users/addresses', addressData);
  },
  
  /**
   * Update address
   * 
   * @param {string} addressId - Address ID to update
   * @param {Object} addressData - Address data
   * @returns {Promise} Promise with updated address
   */
  updateAddress: (addressId, addressData) => {
    return api.put(`/users/addresses/${addressId}`, addressData);
  },
  
  /**
   * Delete address
   * 
   * @param {string} addressId - Address ID to delete
   * @returns {Promise} Promise with success status
   */
  deleteAddress: (addressId) => {
    return api.delete(`/users/addresses/${addressId}`);
  },
  
  /**
   * Set address as default
   * 
   * @param {string} addressId - Address ID to set as default
   * @returns {Promise} Promise with updated address
   */
  setDefaultAddress: (addressId) => {
    return api.put(`/users/addresses/${addressId}/default`);
  },
  
  /**
   * Get user orders
   * 
   * @param {Object} params - Pagination and filtering params
   * @returns {Promise} Promise with user orders
   */
  getOrders: (params = {}) => {
    return api.get('/users/orders', params);
  },
  
  /**
   * Get order details
   * 
   * @param {string} orderId - Order ID
   * @returns {Promise} Promise with order details
   */
  getOrderDetails: (orderId) => {
    return api.get(`/users/orders/${orderId}`);
  },
};

export default userService; 