import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  fetchProducts, 
  fetchCategories,
  setCurrentPage,
  setSortBy,
  setSortOrder,
  setFilters,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectCategories,
  selectCategoriesLoading,
  selectCurrentPage,
  selectTotalPages,
  selectSortBy,
  selectSortOrder,
  selectFilters,
  selectPageSize
} from '../redux/slices/productSlice';
import { addItem } from '../redux/slices/cartSlice';
import ProductFilters from './ProductFilters';
import Pagination from './common/Pagination';
import { toast } from 'react-toastify';
import './ProductList.css';

/**
 * Product List component
 * Displays products in a grid/list view with filtering and sorting options
 */
const ProductList = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux store
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const sortBy = useSelector(selectSortBy);
  const sortOrder = useSelector(selectSortOrder);
  const filters = useSelector(selectFilters);
  const pageSize = useSelector(selectPageSize);
  
  // Local state for view mode (grid or list)
  const [viewMode, setViewMode] = useState('grid');
  
  // Fetch products and categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Fetch products when filters, sort, or pagination changes
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
      sortBy,
      sortOrder,
      ...filters
    };
    
    dispatch(fetchProducts(params));
  }, [dispatch, currentPage, pageSize, sortBy, sortOrder, filters]);
  
  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    
    if (value === 'price-asc') {
      dispatch(setSortBy('price'));
      dispatch(setSortOrder('asc'));
    } else if (value === 'price-desc') {
      dispatch(setSortBy('price'));
      dispatch(setSortOrder('desc'));
    } else if (value === 'name-asc') {
      dispatch(setSortBy('name'));
      dispatch(setSortOrder('asc'));
    } else if (value === 'name-desc') {
      dispatch(setSortBy('name'));
      dispatch(setSortOrder('desc'));
    } else if (value === 'rating-desc') {
      dispatch(setSortBy('rating'));
      dispatch(setSortOrder('desc'));
    }
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle category filter change
  const handleCategoryChange = (categoryId) => {
    dispatch(setFilters({ category: categoryId }));
    dispatch(setCurrentPage(1)); // Reset to first page
  };
  
  // Handle add to cart
  const handleAddToCart = (product) => {
    dispatch(addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    }));
    
    toast.success(`${product.name} added to cart!`);
  };
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  // Render product rating stars
  const renderRatingStars = (rating) => {
    return (
      <div className="product-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fas fa-star ${star <= Math.round(rating) ? 'filled' : ''}`}
          ></i>
        ))}
        <span className="rating-value">({rating.toFixed(1)})</span>
      </div>
    );
  };
  
  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Shop Products</h1>
        <p className="product-count">
          {products.length > 0 ? `Showing ${products.length} products` : 'No products found'}
        </p>
      </div>
      
      <div className="product-list-layout">
        {/* Filters sidebar */}
        <div className="product-filters-sidebar">
          <ProductFilters 
            categories={categories}
            loading={categoriesLoading}
            selectedCategory={filters.category}
            onCategoryChange={handleCategoryChange}
            filters={filters}
            onFilterChange={(newFilters) => {
              dispatch(setFilters(newFilters));
              dispatch(setCurrentPage(1)); // Reset to first page
            }}
          />
        </div>
        
        {/* Product grid/list */}
        <div className="product-list-main">
          <div className="product-list-controls">
            <div className="view-options">
              <button 
                className={`view-option ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <i className="fas fa-th"></i>
              </button>
              <button 
                className={`view-option ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
            
            <div className="sort-options">
              <label htmlFor="sort-select">Sort By:</label>
              <select 
                id="sort-select" 
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="rating-desc">Top Rated</option>
              </select>
            </div>
          </div>
          
          {/* Loading state */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && !loading && (
            <div className="error-container">
              <p className="error-message">Error: {error}</p>
              <button 
                className="retry-button"
                onClick={() => {
                  const params = {
                    page: currentPage,
                    limit: pageSize,
                    sortBy,
                    sortOrder,
                    ...filters
                  };
                  dispatch(fetchProducts(params));
                }}
              >
                Retry
              </button>
            </div>
          )}
          
          {/* Empty state */}
          {!loading && !error && products.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <h2>No products found</h2>
              <p>Try adjusting your filters or search criteria.</p>
              <button 
                className="btn-primary"
                onClick={() => {
                  dispatch(setFilters({
                    category: null,
                    minPrice: null,
                    maxPrice: null,
                    rating: null,
                    searchQuery: '',
                  }));
                  dispatch(setCurrentPage(1));
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
          
          {/* Product grid/list */}
          {!loading && !error && products.length > 0 && (
            <div className={`product-list ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
              {products.map(product => (
                <div key={product.id} className="product-item">
                  <div className="product-image">
                    <Link to={`/products/${product.id}`}>
                      <img 
                        src={product.imageUrl || '/images/placeholder.jpg'} 
                        alt={product.name} 
                      />
                    </Link>
                  </div>
                  
                  <div className="product-details">
                    <Link to={`/products/${product.id}`} className="product-name">
                      {product.name}
                    </Link>
                    
                    {product.category && (
                      <div className="product-category">
                        {product.category.name}
                      </div>
                    )}
                    
                    <div className="product-price">
                      {formatPrice(product.price)}
                    </div>
                    
                    {product.averageRating && renderRatingStars(product.averageRating)}
                    
                    {viewMode === 'list' && (
                      <div className="product-description">
                        {product.description ? (
                          <p>{product.description.substring(0, 150)}...</p>
                        ) : (
                          <p>No description available.</p>
                        )}
                      </div>
                    )}
                    
                    <div className="product-actions">
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      
                      <Link to={`/products/${product.id}`} className="view-details-btn">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList; 