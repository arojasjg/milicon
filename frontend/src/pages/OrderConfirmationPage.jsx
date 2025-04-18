import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/authSlice';
import './OrderConfirmation.css';

/**
 * Order Confirmation Page
 * Displayed after successful checkout
 */
const OrderConfirmationPage = () => {
  const currentUser = useSelector(selectCurrentUser);
  const orderNumber = `ORDER-${Date.now().toString().slice(-6)}`;
  
  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-container">
        <div className="order-success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        
        <h1>Thank You for Your Order!</h1>
        
        <div className="order-details">
          <p className="order-message">
            Your order has been successfully placed and is being processed. You will 
            receive a confirmation email shortly.
          </p>
          
          <div className="order-info">
            <div className="order-info-item">
              <span className="label">Order Number:</span>
              <span className="value">{orderNumber}</span>
            </div>
            
            <div className="order-info-item">
              <span className="label">Date:</span>
              <span className="value">{new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="order-info-item">
              <span className="label">Email:</span>
              <span className="value">{currentUser?.email || 'Your registered email'}</span>
            </div>
          </div>
        </div>
        
        <div className="order-next-steps">
          <p className="next-steps-message">
            What happens next? We'll send you a confirmation email with your order details and 
            tracking information once your order ships. You can also view your order status 
            in your account.
          </p>
        </div>
        
        <div className="order-actions">
          <Link to="/orders" className="btn-primary">View Your Orders</Link>
          <Link to="/products" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 