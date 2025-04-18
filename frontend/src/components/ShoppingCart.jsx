import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
  selectCartLoading,
  removeItem,
  updateQuantity,
  clearCart
} from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import './ShoppingCart.css';

/**
 * Shopping Cart component
 */
const ShoppingCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const itemsCount = useSelector(selectCartItemsCount);
  const cartTotal = useSelector(selectCartTotal);
  const loading = useSelector(selectCartLoading);
  const { isAuthenticated } = useSelector(state => state.auth || { isAuthenticated: false });
  
  const [localQuantities, setLocalQuantities] = useState(
    cartItems.reduce((obj, item) => ({ ...obj, [item.productId]: item.quantity }), {})
  );
  
  // Handle quantity change input
  const handleQuantityChange = (productId, value) => {
    const newQuantity = parseInt(value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setLocalQuantities({
        ...localQuantities,
        [productId]: newQuantity
      });
    }
  };
  
  // Update quantity in store when input is blurred or Enter is pressed
  const handleQuantityUpdate = (productId) => {
    const newQuantity = localQuantities[productId];
    if (newQuantity) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };
  
  // Handle keypress in quantity input (Enter)
  const handleKeyPress = (e, productId) => {
    if (e.key === 'Enter') {
      e.target.blur();
      handleQuantityUpdate(productId);
    }
  };
  
  // Remove item from cart
  const handleRemoveItem = (productId) => {
    dispatch(removeItem(productId));
    toast.info('Item removed from cart');
  };
  
  // Clear entire cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to empty your cart?')) {
      dispatch(clearCart());
      toast.info('Cart has been emptied');
    }
  };
  
  // Proceed to checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.warning('Please log in to checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    navigate('/checkout');
  };
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  // If cart is empty, show empty message
  if (cartItems.length === 0) {
    return (
      <div className="shopping-cart empty-cart">
        <h2>Your Cart</h2>
        <div className="empty-cart-message">
          <i className="cart-icon">🛒</i>
          <p>Your cart is empty</p>
          <p className="empty-cart-subtext">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h2>Your Cart ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})</h2>
        <button 
          className="btn-text"
          onClick={handleClearCart}
          disabled={loading}
        >
          Empty Cart
        </button>
      </div>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="item-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="image-placeholder"></div>
                )}
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">{formatPrice(item.price)}</p>
                
                {item.options && (
                  <div className="item-options">
                    {Object.entries(item.options).map(([key, value]) => (
                      <span key={key} className="item-option">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="item-quantity">
                <label htmlFor={`quantity-${item.productId}`}>Quantity:</label>
                <input
                  type="number"
                  id={`quantity-${item.productId}`}
                  min="1"
                  value={localQuantities[item.productId] || item.quantity}
                  onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                  onBlur={() => handleQuantityUpdate(item.productId)}
                  onKeyPress={(e) => handleKeyPress(e, item.productId)}
                  aria-label="Quantity"
                />
              </div>
              
              <div className="item-subtotal">
                {formatPrice(item.price * item.quantity)}
              </div>
              
              <div className="item-actions">
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.productId)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          
          <div className="summary-row">
            <span>Taxes</span>
            <span>Calculated at checkout</span>
          </div>
          
          <div className="summary-row total">
            <span>Estimated Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          
          <button 
            className="btn-primary checkout-btn"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          
          <div className="cart-actions">
            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart; 