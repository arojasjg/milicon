import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchProducts, setFilters, selectProductsLoading } from '../redux/slices/productSlice';
import './ProductSearch.css';

/**
 * Product Search component
 * Provides search functionality for products
 */
const ProductSearch = ({ className }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectProductsLoading);
  
  // Local state for search query
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  // Input and suggestions refs for click outside detection
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Debounced search for suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const delayDebounceFn = setTimeout(() => {
      // Call search API to get suggestions
      dispatch(searchProducts({ query, limit: 5 }))
        .unwrap()
        .then((result) => {
          setSuggestions(result.items || []);
          setShowSuggestions(true);
        })
        .catch(() => {
          setSuggestions([]);
        });
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, query]);
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) && 
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Set the search query in the filter state
    dispatch(setFilters({ searchQuery: query.trim() }));
    
    // Navigate to products page with the search query
    navigate('/products', { state: { searchQuery: query.trim() } });
    
    // Close suggestions
    setShowSuggestions(false);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`);
    setShowSuggestions(false);
  };
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  return (
    <div className={`product-search ${className || ''}`}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim() && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          aria-label="Search products"
          className={`search-input ${isFocused ? 'focused' : ''}`}
        />
        
        <button 
          type="submit" 
          className="search-button"
          aria-label="Search"
          disabled={loading}
        >
          <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-search'}`}></i>
        </button>
      </form>
      
      {/* Search suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="search-suggestions">
          <ul>
            {suggestions.map((product) => (
              <li 
                key={product.id}
                onClick={() => handleSuggestionClick(product.id)}
              >
                <div className="suggestion-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div className="image-placeholder"></div>
                  )}
                </div>
                
                <div className="suggestion-details">
                  <span className="suggestion-name">{product.name}</span>
                  <span className="suggestion-category">
                    {product.category?.name || 'Product'}
                  </span>
                  <span className="suggestion-price">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </li>
            ))}
            
            <li className="view-all" onClick={handleSubmit}>
              View all results for "<strong>{query}</strong>"
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductSearch; 