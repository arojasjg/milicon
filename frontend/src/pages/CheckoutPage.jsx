import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../redux/slices/cartSlice';
import { selectCurrentUser } from '../redux/slices/authSlice';
import { createOrder } from '../redux/slices/orderSlice';
import { toast } from 'react-toastify';
import './Checkout.css';

/**
 * Checkout Page component
 * Simple implementation for demonstration purposes
 */
const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get cart and user data from Redux
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const currentUser = useSelector(selectCurrentUser);
  
  // Checkout form state
  const [formData, setFormData] = useState({
    shippingAddress: {
      fullName: currentUser?.name || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    shippingMethod: 'standard'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.info('Your cart is empty. Add some items before checkout.');
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('shipping.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        shippingAddress: {
          ...formData.shippingAddress,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate shipping address
    if (!formData.shippingAddress.fullName) {
      newErrors['shipping.fullName'] = 'Full name is required';
    }
    
    if (!formData.shippingAddress.addressLine1) {
      newErrors['shipping.addressLine1'] = 'Address is required';
    }
    
    if (!formData.shippingAddress.city) {
      newErrors['shipping.city'] = 'City is required';
    }
    
    if (!formData.shippingAddress.state) {
      newErrors['shipping.state'] = 'State is required';
    }
    
    if (!formData.shippingAddress.zipCode) {
      newErrors['shipping.zipCode'] = 'ZIP Code is required';
    }
    
    // Validate payment information
    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      if (!formData.cardName) {
        newErrors.cardName = 'Cardholder name is required';
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Use MM/YY format';
      }
      
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create order data
      const orderData = {
        items: cartItems,
        total: cartTotal,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.shippingAddress, // Same as shipping for simplicity
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod
      };
      
      // Dispatch create order action
      await dispatch(createOrder(orderData)).unwrap();
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Redirect to order confirmation
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-container">
            <form className="checkout-form" onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <section className="checkout-section">
                <h2>Shipping Information</h2>
                
                <div className="form-group">
                  <label htmlFor="shipping.fullName">Full Name</label>
                  <input
                    type="text"
                    id="shipping.fullName"
                    name="shipping.fullName"
                    value={formData.shippingAddress.fullName}
                    onChange={handleInputChange}
                    className={errors['shipping.fullName'] ? 'error' : ''}
                  />
                  {errors['shipping.fullName'] && (
                    <div className="error-message">{errors['shipping.fullName']}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="shipping.addressLine1">Address Line 1</label>
                  <input
                    type="text"
                    id="shipping.addressLine1"
                    name="shipping.addressLine1"
                    value={formData.shippingAddress.addressLine1}
                    onChange={handleInputChange}
                    className={errors['shipping.addressLine1'] ? 'error' : ''}
                  />
                  {errors['shipping.addressLine1'] && (
                    <div className="error-message">{errors['shipping.addressLine1']}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="shipping.addressLine2">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    id="shipping.addressLine2"
                    name="shipping.addressLine2"
                    value={formData.shippingAddress.addressLine2}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="shipping.city">City</label>
                    <input
                      type="text"
                      id="shipping.city"
                      name="shipping.city"
                      value={formData.shippingAddress.city}
                      onChange={handleInputChange}
                      className={errors['shipping.city'] ? 'error' : ''}
                    />
                    {errors['shipping.city'] && (
                      <div className="error-message">{errors['shipping.city']}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="shipping.state">State</label>
                    <input
                      type="text"
                      id="shipping.state"
                      name="shipping.state"
                      value={formData.shippingAddress.state}
                      onChange={handleInputChange}
                      className={errors['shipping.state'] ? 'error' : ''}
                    />
                    {errors['shipping.state'] && (
                      <div className="error-message">{errors['shipping.state']}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="shipping.zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="shipping.zipCode"
                      name="shipping.zipCode"
                      value={formData.shippingAddress.zipCode}
                      onChange={handleInputChange}
                      className={errors['shipping.zipCode'] ? 'error' : ''}
                    />
                    {errors['shipping.zipCode'] && (
                      <div className="error-message">{errors['shipping.zipCode']}</div>
                    )}
                  </div>
                </div>
              </section>
              
              {/* Payment Information */}
              <section className="checkout-section">
                <h2>Payment Information</h2>
                
                <div className="form-group">
                  <label htmlFor="paymentMethod">Payment Method</label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
                
                {formData.paymentMethod === 'credit_card' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className={errors.cardNumber ? 'error' : ''}
                      />
                      {errors.cardNumber && (
                        <div className="error-message">{errors.cardNumber}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cardName">Cardholder Name</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className={errors.cardName ? 'error' : ''}
                      />
                      {errors.cardName && (
                        <div className="error-message">{errors.cardName}</div>
                      )}
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className={errors.expiryDate ? 'error' : ''}
                        />
                        {errors.expiryDate && (
                          <div className="error-message">{errors.expiryDate}</div>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className={errors.cvv ? 'error' : ''}
                        />
                        {errors.cvv && (
                          <div className="error-message">{errors.cvv}</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </section>
              
              {/* Shipping Method */}
              <section className="checkout-section">
                <h2>Shipping Method</h2>
                
                <div className="shipping-methods">
                  <div className="shipping-method">
                    <input
                      type="radio"
                      id="standard"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="standard">
                      <div className="shipping-method-name">Standard Shipping</div>
                      <div className="shipping-method-price">Free</div>
                      <div className="shipping-method-time">5-7 Business Days</div>
                    </label>
                  </div>
                  
                  <div className="shipping-method">
                    <input
                      type="radio"
                      id="express"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="express">
                      <div className="shipping-method-name">Express Shipping</div>
                      <div className="shipping-method-price">$12.99</div>
                      <div className="shipping-method-time">2-3 Business Days</div>
                    </label>
                  </div>
                  
                  <div className="shipping-method">
                    <input
                      type="radio"
                      id="overnight"
                      name="shippingMethod"
                      value="overnight"
                      checked={formData.shippingMethod === 'overnight'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="overnight">
                      <div className="shipping-method-name">Overnight Shipping</div>
                      <div className="shipping-method-price">$24.99</div>
                      <div className="shipping-method-time">Next Business Day</div>
                    </label>
                  </div>
                </div>
              </section>
              
              <div className="checkout-actions">
                <button type="button" className="btn-secondary" onClick={() => navigate('/cart')}>
                  Back to Cart
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-summary-item">
                  <div className="item-quantity">{item.quantity}x</div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="order-subtotal">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="order-shipping">
                <span>Shipping</span>
                <span>
                  {formData.shippingMethod === 'standard' && 'Free'}
                  {formData.shippingMethod === 'express' && '$12.99'}
                  {formData.shippingMethod === 'overnight' && '$24.99'}
                </span>
              </div>
              
              <div className="order-tax">
                <span>Tax</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              
              <div className="order-total">
                <span>Total</span>
                <span>
                  $
                  {(
                    cartTotal +
                    (formData.shippingMethod === 'express' ? 12.99 : 0) +
                    (formData.shippingMethod === 'overnight' ? 24.99 : 0) +
                    cartTotal * 0.08
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 