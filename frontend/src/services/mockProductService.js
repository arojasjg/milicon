/**
 * Mock Product Service
 * Returns static data for product-related API calls
 */

// Mock categories data
const categories = [
  { id: 'cat1', name: 'Footwear', count: 10 },
  { id: 'cat2', name: 'Apparel', count: 15 },
  { id: 'cat3', name: 'Accessories', count: 8 },
  { id: 'cat4', name: 'Equipment', count: 12 },
  { id: 'cat5', name: 'Nutrition', count: 5 }
];

// Mock products data
const products = Array.from({ length: 40 }, (_, i) => ({
  id: `prod-${i + 1}`,
  name: `Product ${i + 1}`,
  price: 19.99 + (i % 10) * 10,
  description: `This is a detailed description for Product ${i + 1}. It includes information about features, benefits, and specifications.`,
  imageUrl: null, // Would be a real URL in production
  averageRating: 3 + Math.random() * 2,
  reviewCount: Math.floor(Math.random() * 50),
  category: categories[i % 5],
  stock: Math.floor(Math.random() * 50) + 1,
  featured: i < 8
}));

// Mock reviews data
const reviews = [
  {
    id: 'rev1',
    productId: 'prod-1',
    userId: 'user1',
    userName: 'John Doe',
    rating: 4,
    title: 'Great product!',
    review: 'I really enjoyed using this product. The quality is excellent.',
    date: '2023-05-15T10:00:00Z',
    verified: true
  },
  {
    id: 'rev2',
    productId: 'prod-1',
    userId: 'user2',
    userName: 'Jane Smith',
    rating: 5,
    title: 'Exceeded my expectations',
    review: 'This product is even better than I expected. Would definitely recommend!',
    date: '2023-06-02T14:30:00Z',
    verified: true
  }
];

/**
 * Helper to simulate async API calls
 */
const asyncResponse = (data, delay = 500) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

/**
 * Service for product-related API calls (MOCK VERSION)
 */
const mockProductService = {
  /**
   * Get all products with pagination and filtering
   */
  getProducts: async (params = {}) => {
    console.log('MOCK: Getting products with params:', params);
    
    let filtered = [...products];
    
    // Apply category filter
    if (params.category) {
      filtered = filtered.filter(p => p.category.id === params.category);
    }
    
    // Apply price filters
    if (params.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(params.minPrice));
    }
    if (params.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(params.maxPrice));
    }
    
    // Apply rating filter
    if (params.rating) {
      filtered = filtered.filter(p => p.averageRating >= parseFloat(params.rating));
    }
    
    // Apply search filter
    if (params.search || params.searchQuery) {
      const query = (params.search || params.searchQuery || '').toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    const sortBy = params.sortBy || 'name';
    const sortOrder = params.sortOrder || 'asc';
    
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.averageRating - b.averageRating;
          break;
        case 'name':
        default:
          comparison = a.name.localeCompare(b.name);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    // Apply pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filtered.slice(startIndex, endIndex);
    
    return asyncResponse({
      data: {
        items: paginatedProducts,
        total: filtered.length,
        currentPage: page,
        totalPages: Math.ceil(filtered.length / limit)
      }
    });
  },
  
  /**
   * Get product by ID
   */
  getProductById: async (productId) => {
    console.log('MOCK: Getting product by ID:', productId);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return Promise.reject({ response: { data: { message: 'Product not found' } } });
    }
    
    return asyncResponse({ data: product });
  },
  
  /**
   * Get products by category
   */
  getProductsByCategory: async (categoryId, params = {}) => {
    console.log('MOCK: Getting products by category:', categoryId);
    return mockProductService.getProducts({ ...params, category: categoryId });
  },
  
  /**
   * Get featured products
   */
  getFeaturedProducts: async (limit = 8) => {
    console.log('MOCK: Getting featured products');
    const featured = products.filter(p => p.featured).slice(0, limit);
    return asyncResponse({ data: featured });
  },
  
  /**
   * Search products
   */
  searchProducts: async (query, params = {}) => {
    console.log('MOCK: Searching products for:', query);
    return mockProductService.getProducts({ ...params, search: query });
  },
  
  /**
   * Get product reviews
   */
  getProductReviews: async (productId, params = {}) => {
    console.log('MOCK: Getting reviews for product:', productId);
    const productReviews = reviews.filter(r => r.productId === productId);
    
    return asyncResponse({ data: productReviews });
  },
  
  /**
   * Submit product review
   */
  submitReview: async (productId, reviewData) => {
    console.log('MOCK: Submitting review for product:', productId);
    
    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      ...reviewData,
      date: new Date().toISOString(),
      verified: true
    };
    
    // In a real app we would push to the reviews array
    // reviews.push(newReview);
    
    return asyncResponse({ data: newReview });
  },
  
  /**
   * Get all categories
   */
  getCategories: async () => {
    console.log('MOCK: Getting categories');
    return asyncResponse({ data: categories });
  },
  
  /**
   * Get category by ID
   */
  getCategoryById: async (categoryId) => {
    console.log('MOCK: Getting category by ID:', categoryId);
    const category = categories.find(c => c.id === categoryId);
    
    if (!category) {
      return Promise.reject({ response: { data: { message: 'Category not found' } } });
    }
    
    return asyncResponse({ data: category });
  },
  
  // Admin functions - just return success responses
  
  createProduct: async (productData) => {
    console.log('MOCK: Creating product:', productData);
    return asyncResponse({ data: { ...productData, id: `prod-${Date.now()}` } });
  },
  
  updateProduct: async (productId, productData) => {
    console.log('MOCK: Updating product:', productId);
    return asyncResponse({ data: { ...productData, id: productId } });
  },
  
  deleteProduct: async (productId) => {
    console.log('MOCK: Deleting product:', productId);
    return asyncResponse({ data: { success: true } });
  },
  
  uploadProductImage: async (productId, formData) => {
    console.log('MOCK: Uploading image for product:', productId);
    return asyncResponse({ data: { imageUrl: 'https://example.com/mock-image.jpg' } });
  },
};

export default mockProductService; 