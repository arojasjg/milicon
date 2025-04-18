import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import userService from '../services/userService';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

/**
 * Registration page component
 * Implements user registration with form validation
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    agreedToTerms: false
  });
  
  // Form errors state
  const [errors, setErrors] = useState({});
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested object (shipping address)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      // Handle regular fields
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
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
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate date of birth (must be 18+ years old)
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      
      if (isNaN(dob.getTime())) {
        newErrors.dateOfBirth = 'Invalid date format';
      } else if (dob > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      } else if (dob > eighteenYearsAgo) {
        newErrors.dateOfBirth = 'You must be at least 18 years old to register';
      }
    }
    
    // Validate shipping address
    if (!formData.shippingAddress.street.trim()) {
      newErrors['shippingAddress.street'] = 'Street address is required';
    }
    
    if (!formData.shippingAddress.city.trim()) {
      newErrors['shippingAddress.city'] = 'City is required';
    }
    
    if (!formData.shippingAddress.state.trim()) {
      newErrors['shippingAddress.state'] = 'State is required';
    }
    
    if (!formData.shippingAddress.zipCode.trim()) {
      newErrors['shippingAddress.zipCode'] = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.shippingAddress.zipCode)) {
      newErrors['shippingAddress.zipCode'] = 'Invalid ZIP code format';
    }
    
    // Validate terms agreement
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms of Service';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for API
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        address: {
          street: formData.shippingAddress.street,
          city: formData.shippingAddress.city,
          state: formData.shippingAddress.state,
          zipCode: formData.shippingAddress.zipCode,
          country: formData.shippingAddress.country,
          isDefault: true
        }
      };
      
      // Call registration API
      const response = await userService.register(userData);
      
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle API errors
      if (error.response && error.response.data) {
        if (error.response.data.email) {
          setErrors({
            ...errors,
            email: error.response.data.email
          });
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Registration failed. Please try again.');
        }
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join MiliconStore to shop the best sports gear</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className={`form-group ${errors.firstName ? 'has-error' : ''}`}>
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            </div>
            
            <div className={`form-group ${errors.lastName ? 'has-error' : ''}`}>
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            </div>
          </div>
          
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-row">
            <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
              <label htmlFor="password">Password*</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
            
            <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
              <label htmlFor="confirmPassword">Confirm Password*</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>
          </div>
          
          <div className={`form-group ${errors.dateOfBirth ? 'has-error' : ''}`}>
            <label htmlFor="dateOfBirth">Date of Birth*</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
            {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth}</div>}
          </div>
          
          <h2 className="form-section-title">Shipping Address</h2>
          
          <div className={`form-group ${errors['shippingAddress.street'] ? 'has-error' : ''}`}>
            <label htmlFor="street">Street Address*</label>
            <input
              type="text"
              id="street"
              name="shippingAddress.street"
              value={formData.shippingAddress.street}
              onChange={handleInputChange}
            />
            {errors['shippingAddress.street'] && (
              <div className="error-message">{errors['shippingAddress.street']}</div>
            )}
          </div>
          
          <div className="form-row">
            <div className={`form-group ${errors['shippingAddress.city'] ? 'has-error' : ''}`}>
              <label htmlFor="city">City*</label>
              <input
                type="text"
                id="city"
                name="shippingAddress.city"
                value={formData.shippingAddress.city}
                onChange={handleInputChange}
              />
              {errors['shippingAddress.city'] && (
                <div className="error-message">{errors['shippingAddress.city']}</div>
              )}
            </div>
            
            <div className={`form-group ${errors['shippingAddress.state'] ? 'has-error' : ''}`}>
              <label htmlFor="state">State*</label>
              <input
                type="text"
                id="state"
                name="shippingAddress.state"
                value={formData.shippingAddress.state}
                onChange={handleInputChange}
              />
              {errors['shippingAddress.state'] && (
                <div className="error-message">{errors['shippingAddress.state']}</div>
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className={`form-group ${errors['shippingAddress.zipCode'] ? 'has-error' : ''}`}>
              <label htmlFor="zipCode">ZIP Code*</label>
              <input
                type="text"
                id="zipCode"
                name="shippingAddress.zipCode"
                value={formData.shippingAddress.zipCode}
                onChange={handleInputChange}
              />
              {errors['shippingAddress.zipCode'] && (
                <div className="error-message">{errors['shippingAddress.zipCode']}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country*</label>
              <select
                id="country"
                name="shippingAddress.country"
                value={formData.shippingAddress.country}
                onChange={handleInputChange}
              >
                <option value="USA">United States</option>
                <option value="CAN">Canada</option>
                <option value="MEX">Mexico</option>
              </select>
            </div>
          </div>
          
          <div className={`form-group checkbox ${errors.agreedToTerms ? 'has-error' : ''}`}>
            <input
              type="checkbox"
              id="agreedToTerms"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleInputChange}
            />
            <label htmlFor="agreedToTerms">
              I agree to the <a href="/terms" target="_blank">Terms of Service</a> and{' '}
              <a href="/privacy" target="_blank">Privacy Policy</a>
            </label>
            {errors.agreedToTerms && <div className="error-message">{errors.agreedToTerms}</div>}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="auth-alt-action">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 