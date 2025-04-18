import React, { useState, useEffect } from 'react';
import './ProductFilters.css';

/**
 * Product Filters component
 * Provides UI controls for filtering products by category, price range, and rating
 */
const ProductFilters = ({ 
  categories = [], 
  loading = false, 
  selectedCategory = null,
  filters = {},
  onCategoryChange,
  onFilterChange
}) => {
  // Local state for filter values (to avoid constant Redux updates)
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });
  
  const [minRating, setMinRating] = useState(filters.rating || 0);
  
  // Update local state when filters change
  useEffect(() => {
    setPriceRange({
      min: filters.minPrice || '',
      max: filters.maxPrice || ''
    });
    setMinRating(filters.rating || 0);
  }, [filters]);
  
  // Handle price range change
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    
    // Validate input is a number or empty
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setPriceRange({
        ...priceRange,
        [name]: value
      });
    }
  };
  
  // Apply price range filter
  const applyPriceFilter = () => {
    onFilterChange({
      minPrice: priceRange.min === '' ? null : Number(priceRange.min),
      maxPrice: priceRange.max === '' ? null : Number(priceRange.max)
    });
  };
  
  // Reset price range filter
  const resetPriceFilter = () => {
    setPriceRange({ min: '', max: '' });
    onFilterChange({
      minPrice: null,
      maxPrice: null
    });
  };
  
  // Handle rating change
  const handleRatingChange = (rating) => {
    const newRating = rating === minRating ? 0 : rating;
    setMinRating(newRating);
    onFilterChange({ rating: newRating });
  };
  
  // Render star rating filter
  const renderRatingFilter = () => {
    return (
      <div className="rating-filter">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div 
            key={rating} 
            className={`rating-option ${minRating === rating ? 'active' : ''}`}
            onClick={() => handleRatingChange(rating)}
          >
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fas fa-star ${star <= rating ? 'filled' : ''}`}
                ></i>
              ))}
            </div>
            <span className="rating-label">& Up</span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="product-filters">
      <h2>Filters</h2>
      
      {/* Category filter */}
      <div className="filter-section">
        <h3>Categories</h3>
        
        {loading ? (
          <div className="category-loading">Loading categories...</div>
        ) : (
          <ul className="category-list">
            <li 
              className={`category-item ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => onCategoryChange(null)}
            >
              All Categories
            </li>
            
            {categories.map((category) => (
              <li 
                key={category.id}
                className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(category.id)}
              >
                {category.name}
                {category.productCount && (
                  <span className="category-count">({category.productCount})</span>
                )}
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
            <label htmlFor="min-price">Min:</label>
            <input 
              type="text"
              id="min-price"
              name="min"
              value={priceRange.min}
              onChange={handlePriceChange}
              placeholder="Min $"
            />
          </div>
          
          <div className="price-input">
            <label htmlFor="max-price">Max:</label>
            <input 
              type="text"
              id="max-price"
              name="max"
              value={priceRange.max}
              onChange={handlePriceChange}
              placeholder="Max $"
            />
          </div>
        </div>
        
        <div className="price-range-actions">
          <button 
            className="apply-btn"
            onClick={applyPriceFilter}
            disabled={priceRange.min === '' && priceRange.max === ''}
          >
            Apply
          </button>
          
          <button 
            className="reset-btn"
            onClick={resetPriceFilter}
            disabled={!filters.minPrice && !filters.maxPrice}
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Rating filter */}
      <div className="filter-section">
        <h3>Customer Rating</h3>
        {renderRatingFilter()}
      </div>
      
      {/* Clear all filters button */}
      <button 
        className="clear-all-btn"
        onClick={() => {
          setPriceRange({ min: '', max: '' });
          setMinRating(0);
          onFilterChange({
            category: null,
            minPrice: null,
            maxPrice: null,
            rating: null,
            searchQuery: ''
          });
        }}
        disabled={!selectedCategory && !filters.minPrice && !filters.maxPrice && !filters.rating}
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default ProductFilters; 