import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuthLoading, selectAuthError, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

/**
 * Login page component
 * Implements user login with form validation
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  // Get auth state from Redux
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  // Show error toast if there's an auth error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    
    // Check if session expired message is in URL
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('session_expired') === 'true') {
      toast.info('Your session has expired. Please log in again.');
    }
  }, [error, location]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Dispatch login action
      const resultAction = await dispatch(login(formData)).unwrap();
      
      // Success message
      toast.success('Login successful!');
      
      // Redirect to previous page or home
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the slice and shown via useEffect
      console.error('Login failed:', err);
      
      // Set form-specific errors if available
      if (err.fieldErrors) {
        setFormErrors(err.fieldErrors);
      }
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Log In</h1>
        <p className="auth-subtitle">Welcome back to MiliconStore</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className={`form-group ${formErrors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
            />
            {formErrors.email && <div className="error-message">{formErrors.email}</div>}
          </div>
          
          <div className={`form-group ${formErrors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="current-password"
            />
            {formErrors.password && <div className="error-message">{formErrors.password}</div>}
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>
        
        <div className="social-login">
          <div className="social-login-divider">
            <span>Or log in with</span>
          </div>
          
          <button type="button" className="social-btn">
            <img src="/images/google-icon.svg" alt="Google" />
            Google
          </button>
          
          <button type="button" className="social-btn">
            <img src="/images/facebook-icon.svg" alt="Facebook" />
            Facebook
          </button>
        </div>
        
        <div className="auth-alt-action">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 