import React from 'react';
import ProductList from '../components/ProductList';
import ProductSearch from '../components/ProductSearch';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFilters } from '../redux/slices/productSlice';
import './ProductPage.css';

/**
 * Product Page component
 * Container for the product catalog/list view
 */
const ProductPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Check if we have search params from navigation state
  useEffect(() => {
    if (location.state?.searchQuery) {
      dispatch(setFilters({ searchQuery: location.state.searchQuery }));
    }
  }, [location.state, dispatch]);
  
  return (
    <div className="product-page">
      <div className="product-search-container">
        <ProductSearch />
      </div>
      <ProductList />
    </div>
  );
};

export default ProductPage; 