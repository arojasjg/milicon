import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/slices/productSlice';
import './ProductFilters.css';

const ProductFilters = ({ onFilterChange }) => {
  const dispatch = useDispatch();
  const { categories, categoriesLoading } = useSelector(state => state.products);
  
  // Local filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedRating, setSelectedRating] = useState(0);
  
  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    applyFilters({ category });
  };
  
  // Handle price input change
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle rating selection
  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
    applyFilters({ rating });
  };
  
  // Apply price range filter
  const applyPriceFilter = () => {
    applyFilters({ price: priceRange });
  };
  
  // Reset price range filter
  const resetPriceFilter = () => {
    setPriceRange({ min: '', max: '' });
    applyFilters({ price: { min: '', max: '' } });
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setSelectedRating(0);
    applyFilters({ 
      category: 'all', 
      price: { min: '', max: '' }, 
      rating: 0 
    });
  };
  
  // Apply filters helper function
  const applyFilters = (updates) => {
    const currentFilters = {
      category: selectedCategory,
      price: priceRange,
      rating: selectedRating,
      ...updates
    };
    
    onFilterChange(currentFilters);
  };
  
  // Generate star rating component
  const renderStars = (count) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={`fa fa-star ${i <= count ? 'filled' : ''}`} 
          aria-hidden="true"
        ></i>
      );
    }
    return stars;
  };
  
  // Are any filters applied?
  const isFiltering = 
    selectedCategory !== 'all' || 
    priceRange.min !== '' || 
    priceRange.max !== '' || 
    selectedRating > 0;
  
  // Is price filter applicable?
  const isPriceFilterValid = 
    (priceRange.min !== '' && !isNaN(priceRange.min)) || 
    (priceRange.max !== '' && !isNaN(priceRange.max));
  
  return (
    <div className="product-filters">
      <h2>Filter Products</h2>
      
      {/* Category filter */}
      <div className="filter-section">
        <h3>Categories</h3>
        {categoriesLoading ? (
          <div className="category-loading">Loading categories...</div>
        ) : (
          <ul className="category-list">
            <li 
              className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('all')}
            >
              <span>All Categories</span>
            </li>
            {categories.map((category) => (
              <li 
                key={category.id} 
                className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                onClick={() => handleCategorySelect(category.name)}
              >
                <span>{category.name}</span>
                <span className="category-count">{category.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Price range filter */}
      <div className="filter-section">
        <h3>Price Range</h3>
        <div className="price-range-inputs">
          <div className="price-input">
            <label htmlFor="min-price">Min ($)</label>
            <input
              id="min-price"
              type="number"
              name="min"
              value={priceRange.min}
              onChange={handlePriceChange}
              placeholder="Min"
              min="0"
            />
          </div>
          <div className="price-input">
            <label htmlFor="max-price">Max ($)</label>
            <input
              id="max-price"
              type="number"
              name="max"
              value={priceRange.max}
              onChange={handlePriceChange}
              placeholder="Max"
              min="0"
            />
          </div>
        </div>
        <div className="price-range-actions">
          <button 
            className="apply-btn" 
            onClick={applyPriceFilter}
            disabled={!isPriceFilterValid}
          >
            Apply
          </button>
          <button 
            className="reset-btn" 
            onClick={resetPriceFilter}
            disabled={priceRange.min === '' && priceRange.max === ''}
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Rating filter */}
      <div className="filter-section">
        <h3>Customer Rating</h3>
        <div className="rating-filter">
          {[4, 3, 2, 1].map((rating) => (
            <div 
              key={rating}
              className={`rating-option ${selectedRating === rating ? 'active' : ''}`}
              onClick={() => handleRatingSelect(rating)}
            >
              <div className="stars">
                {renderStars(rating)}
              </div>
              <span className="rating-label">& Up</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Clear all filters */}
      {isFiltering && (
        <button 
          className="clear-all-btn"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default ProductFilters; 