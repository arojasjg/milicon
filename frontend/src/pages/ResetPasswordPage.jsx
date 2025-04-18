import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import userService from '../services/userService';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

/**
 * Reset Password page component
 * Implements password reset form with token validation
 */
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get('email');
  
  const [formData, setFormData] = useState({
    email: emailFromQuery || '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }
      
      try {
        // Call API to validate token
        await userService.validateResetToken(token);
      } catch (error) {
        console.error('Token validation error:', error);
        setTokenValid(false);
      }
    };
    
    validateToken();
  }, [token]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // Call password reset API
      await userService.resetPassword({
        email: formData.email,
        token: token,
        newPassword: formData.password
      });
      
      setResetSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      
      // Handle API errors
      if (error.response && error.response.status === 400) {
        if (error.response.data.token) {
          setTokenValid(false);
        } else if (error.response.data.email) {
          setErrors({
            ...errors,
            email: error.response.data.email
          });
        } else if (error.response.data.password) {
          setErrors({
            ...errors,
            password: error.response.data.password
          });
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // If token is invalid, show error message
  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>Invalid or Expired Link</h1>
          <p className="auth-subtitle">
            The password reset link is invalid or has expired.
          </p>
          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <Link to="/forgot-password" className="btn-primary">
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // If reset was successful, show success message
  if (resetSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>Password Reset Successful</h1>
          <p className="auth-subtitle">
            Your password has been successfully reset.
          </p>
          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <Link to="/login" className="btn-primary">
              Log In with New Password
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Reset Password</h1>
        <p className="auth-subtitle">Create a new password for your account</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              readOnly={!!emailFromQuery}
              autoComplete="email"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </div>
        </form>
        
        <div className="auth-alt-action">
          Remember your password? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 