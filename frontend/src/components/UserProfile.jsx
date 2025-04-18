import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import notificationService from '../services/notificationService';
import './UserProfile.css';

/**
 * UserProfile component demonstrating form handling with notification integration
 */
const UserProfile = () => {
  const { success, error, info, notify } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Initial user data state
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  });
  
  // Form error state
  const [formErrors, setFormErrors] = useState({});
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!userData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!userData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!userData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error('Please fix the errors in the form', {
        title: 'Validation Error',
        autoClose: true,
        duration: 5000
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    const updateProfileApi = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.2) { // 80% success rate for demo
            resolve({
              success: true,
              data: userData,
              message: 'Profile updated successfully'
            });
          } else {
            reject({
              response: {
                data: {
                  message: 'Server error occurred',
                  error: 'Internal server error'
                },
                status: 500
              }
            });
          }
        }, 1500);
      });
    };
    
    try {
      // Use notificationService to handle API call with notifications
      const notifications = { success, error, info, notify };
      await notificationService.handleApiCall(
        updateProfileApi,
        notifications,
        {
          successOptions: {
            title: 'Profile Updated',
            message: 'Your profile has been updated successfully',
            duration: 5000
          },
          errorOptions: {
            title: 'Update Failed',
            duration: 7000
          }
        }
      );
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle address submission with loading notification
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate API call with loading notification
      const updateAddressApi = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              message: 'Address updated successfully'
            });
          }, 3000);
        });
      };
      
      const notifications = { success, error, info, notify };
      await notificationService.handleLoadingOperation(
        updateAddressApi,
        notifications,
        {
          loadingTitle: 'Updating Address',
          loadingMessage: 'Please wait while we update your address...',
          successTitle: 'Address Updated',
          successMessage: 'Your address has been successfully updated'
        }
      );
    } catch (error) {
      console.error('Address update error:', error);
    }
  };
  
  // Delete address with confirmation
  const handleDeleteAddress = () => {
    notify({
      type: 'warning',
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this address?',
      autoClose: false,
      actions: [
        {
          label: 'Delete',
          onClick: (close) => {
            // Close this notification
            close();
            
            // Show success notification after "deletion"
            setTimeout(() => {
              success('Address has been deleted', {
                title: 'Address Deleted',
                duration: 5000
              });
            }, 500);
          },
          variant: 'primary'
        },
        {
          label: 'Cancel',
          onClick: (close) => close(),
          variant: 'secondary'
        }
      ]
    });
  };
  
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
          <div className="profile-tab">
            <div className="profile-header">
              <h2>Profile Information</h2>
            </div>
            
            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <div className={`form-group ${formErrors.firstName ? 'has-error' : ''}`}>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  className={formErrors.firstName ? 'input-error' : ''}
                />
                {formErrors.firstName && (
                  <div className="error-message">{formErrors.firstName}</div>
                )}
              </div>
              
              <div className={`form-group ${formErrors.lastName ? 'has-error' : ''}`}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  className={formErrors.lastName ? 'input-error' : ''}
                />
                {formErrors.lastName && (
                  <div className="error-message">{formErrors.lastName}</div>
                )}
              </div>
              
              <div className={`form-group ${formErrors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? 'input-error' : ''}
                />
                {formErrors.email && (
                  <div className="error-message">{formErrors.email}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={userData.bio}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    info('Changes discarded', {
                      title: 'Cancelled',
                      duration: 3000
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {activeTab === 'addresses' && (
          <div className="addresses-tab">
            <div className="profile-header">
              <h2>Your Addresses</h2>
            </div>
            
            <div className="address-container">
              <div className="address-card">
                <h3>Home</h3>
                <p>123 Main Street</p>
                <p>Apt 4B</p>
                <p>New York, NY 10001</p>
                <div className="address-actions">
                  <button className="edit-address-btn" onClick={handleAddressSubmit}>
                    Edit
                  </button>
                  <button className="delete-address-btn" onClick={handleDeleteAddress}>
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="address-card">
                <h3>Work</h3>
                <p>456 Office Plaza</p>
                <p>Suite 300</p>
                <p>New York, NY 10018</p>
                <div className="address-actions">
                  <button className="edit-address-btn" onClick={handleAddressSubmit}>
                    Edit
                  </button>
                  <button className="delete-address-btn" onClick={handleDeleteAddress}>
                    Delete
                  </button>
                </div>
              </div>
              
              <button className="add-address-btn" onClick={() => {
                info('This feature is coming soon!', {
                  title: 'Not Implemented',
                  duration: 3000
                });
              }}>
                Add New Address
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="orders-tab">
            <div className="profile-header">
              <h2>Your Orders</h2>
            </div>
            
            <div className="empty-state">
              <p>You don't have any orders yet.</p>
              <button className="shop-now-btn" onClick={() => {
                info('Shop page coming soon!', {
                  title: 'Not Implemented',
                  duration: 3000
                });
              }}>
                Shop Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 