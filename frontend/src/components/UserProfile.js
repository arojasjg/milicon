import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../redux/slices/profileSlice';
import { fetchAddresses } from '../redux/slices/addressSlice';
import { fetchOrders } from '../redux/slices/orderSlice';
import AddressForm from './AddressForm';
import OrderHistory from './OrderHistory';
import notify from '../utils/notificationHelper';
import './UserProfile.css';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { data: profile, loading: profileLoading, error: profileError } = useSelector(state => state.profile);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });
  const [errors, setErrors] = useState({});

  // Load profile data when component mounts
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchAddresses());
    dispatch(fetchOrders());
  }, [dispatch]);

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.phone && !/^\+?[\d\s-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (isNaN(dob.getTime())) {
        newErrors.dateOfBirth = 'Invalid date format';
      } else if (dob > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
      notify.success('Profile updated successfully');
    } catch (error) {
      notify.error('Failed to update profile: ' + (error.message || 'Unknown error'));
    }
  };

  const renderProfileForm = () => {
    return (
      <form className="profile-form" onSubmit={handleProfileSubmit}>
        <div className={`form-group ${errors.firstName ? 'has-error' : ''}`}>
          <label htmlFor="firstName">First Name*</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
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
            disabled={!isEditing}
          />
          {errors.lastName && <div className="error-message">{errors.lastName}</div>}
        </div>
        
        <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>
        
        <div className={`form-group ${errors.dateOfBirth ? 'has-error' : ''}`}>
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
        
        {isEditing && (
          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setIsEditing(false);
                // Reset form data to original profile data
                if (profile) {
                  setFormData({
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    dateOfBirth: profile.dateOfBirth || '',
                    gender: profile.gender || ''
                  });
                }
                setErrors({});
              }}
              disabled={profileLoading}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    );
  };

  const handleAddressSubmit = (addressData) => {
    notify.success('Address saved successfully');
  };

  const handleDeleteAddress = () => {
    notify.info('Address deleted successfully');
  };

  if (profileLoading && !profile) {
    return <div className="loading">Loading profile...</div>;
  }

  if (profileError) {
    return <div className="error-message">Error: {profileError}</div>;
  }

  return (
    <div className="user-profile-container">
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          Addresses
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'profile' && (
          <>
            <div className="profile-header">
              <h2>My Profile</h2>
              {!isEditing && (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>
            {renderProfileForm()}
          </>
        )}
        
        {activeTab === 'addresses' && (
          <div className="addresses-tab">
            <h2>My Addresses</h2>
            <AddressForm 
              onSuccess={handleAddressSubmit} 
              onCancel={() => {}} 
              onDelete={handleDeleteAddress}
            />
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="orders-tab">
            <h2>Order History</h2>
            <OrderHistory />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 