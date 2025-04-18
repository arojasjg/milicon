import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

/**
 * Forgot Password page component
 * Implements password recovery request form
 */
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Handle input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };
  
  // Form validation
  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Call password reset API
      await userService.requestPasswordReset(email);
      
      setSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
      
      // Handle API errors
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to request password reset. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Forgot Password</h1>
        <p className="auth-subtitle">Enter your email to reset your password</p>
        
        {submitted ? (
          <div className="success-message">
            <h3>Check Your Email</h3>
            <p>
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your email and follow the instructions to reset your password.
            </p>
            <p>If you don't see the email, check your spam folder.</p>
            
            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <Link to="/login" className="btn-primary">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className={`form-group ${error ? 'has-error' : ''}`}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
              />
              {error && <div className="error-message">{error}</div>}
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sending...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
        
        <div className="auth-alt-action">
          Remember your password? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 