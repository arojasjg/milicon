import api from './api';

/**
 * Service for product-related API calls
 */
const productService = {
  /**
   * Get all products with pagination and filtering
   * 
   * @param {Object} params - Query parameters for pagination and filtering
   * @returns {Promise} Promise with paginated products
   */
  getProducts: (params = {}) => {
    return api.get('/products', params);
  },
  
  /**
   * Get product by ID
   * 
   * @param {string} productId - Product ID
   * @returns {Promise} Promise with product details
   */
  getProductById: (productId) => {
    return api.get(`/products/${productId}`);
  },
  
  /**
   * Get products by category
   * 
   * @param {string} categoryId - Category ID
   * @param {Object} params - Query parameters for pagination
   * @returns {Promise} Promise with paginated products in category
   */
  getProductsByCategory: (categoryId, params = {}) => {
    return api.get('/products', { ...params, category: categoryId });
  },
  
  /**
   * Get featured products
   * 
   * @param {number} limit - Number of products to fetch
   * @returns {Promise} Promise with featured products
   */
  getFeaturedProducts: (limit = 8) => {
    return api.get('/products/featured', { limit });
  },
  
  /**
   * Search products
   * 
   * @param {string} query - Search query
   * @param {Object} params - Additional params like pagination
   * @returns {Promise} Promise with search results
   */
  searchProducts: (query, params = {}) => {
    return api.get('/products', { ...params, search: query });
  },
  
  /**
   * Get product reviews
   * 
   * @param {string} productId - Product ID
   * @param {Object} params - Query parameters for pagination
   * @returns {Promise} Promise with product reviews
   */
  getProductReviews: (productId, params = {}) => {
    return api.get(`/products/${productId}/reviews`, params);
  },
  
  /**
   * Submit product review
   * 
   * @param {string} productId - Product ID
   * @param {Object} reviewData - Review data
   * @returns {Promise} Promise with created review
   */
  submitReview: (productId, reviewData) => {
    return api.post(`/products/${productId}/reviews`, reviewData);
  },
  
  /**
   * Get all categories
   * 
   * @returns {Promise} Promise with categories
   */
  getCategories: () => {
    return api.get('/categories');
  },
  
  /**
   * Get category by ID
   * 
   * @param {string} categoryId - Category ID
   * @returns {Promise} Promise with category details
   */
  getCategoryById: (categoryId) => {
    return api.get(`/categories/${categoryId}`);
  },
  
  // Admin functions
  
  /**
   * Create new product (admin only)
   * 
   * @param {Object} productData - Product data
   * @returns {Promise} Promise with created product
   */
  createProduct: (productData) => {
    return api.post('/products', productData);
  },
  
  /**
   * Update product (admin only)
   * 
   * @param {string} productId - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise} Promise with updated product
   */
  updateProduct: (productId, productData) => {
    return api.put(`/products/${productId}`, productData);
  },
  
  /**
   * Delete product (admin only)
   * 
   * @param {string} productId - Product ID
   * @returns {Promise} Promise with success status
   */
  deleteProduct: (productId) => {
    return api.delete(`/products/${productId}`);
  },
  
  /**
   * Upload product image (admin only)
   * 
   * @param {string} productId - Product ID
   * @param {FormData} formData - Form data with image
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Promise with image URL
   */
  uploadProductImage: (productId, formData, onProgress) => {
    return api.upload(`/products/${productId}/image`, formData, onProgress);
  },
};

export default productService; 