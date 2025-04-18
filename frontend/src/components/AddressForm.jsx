import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addAddress, updateAddress } from '../redux/slices/addressSlice';
import './UserProfile.css';

const AddressForm = ({ address = null, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    isDefault: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        id: address.id,
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zipCode: address.zipCode || '',
        country: address.country || 'USA',
        isDefault: address.isDefault || false
      });
    }
  }, [address]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code format';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (address) {
        // Update existing address
        await dispatch(updateAddress(formData)).unwrap();
      } else {
        // Add new address
        await dispatch(addAddress(formData)).unwrap();
      }
      
      setLoading(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setLoading(false);
      setErrors({
        form: error.message || 'Failed to save address'
      });
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h3>{address ? 'Edit Address' : 'Add New Address'}</h3>
      
      {errors.form && (
        <div className="error-message">{errors.form}</div>
      )}
      
      <div className={`form-group ${errors.street ? 'has-error' : ''}`}>
        <label htmlFor="street">Street Address*</label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          placeholder="123 Main St"
        />
        {errors.street && <div className="error-message">{errors.street}</div>}
      </div>
      
      <div className={`form-group ${errors.city ? 'has-error' : ''}`}>
        <label htmlFor="city">City*</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="Anytown"
        />
        {errors.city && <div className="error-message">{errors.city}</div>}
      </div>
      
      <div className={`form-group ${errors.state ? 'has-error' : ''}`}>
        <label htmlFor="state">State*</label>
        <input
          type="text"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          placeholder="CA"
        />
        {errors.state && <div className="error-message">{errors.state}</div>}
      </div>
      
      <div className={`form-group ${errors.zipCode ? 'has-error' : ''}`}>
        <label htmlFor="zipCode">ZIP Code*</label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          placeholder="12345"
        />
        {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
      </div>
      
      <div className={`form-group ${errors.country ? 'has-error' : ''}`}>
        <label htmlFor="country">Country*</label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          placeholder="USA"
        />
        {errors.country && <div className="error-message">{errors.country}</div>}
      </div>
      
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
          />
          Set as default address
        </label>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Address'}
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm; 