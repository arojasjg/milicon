import React, { useState } from 'react';
import './ReviewForm.css';

/**
 * Review Form component
 * Allows users to submit product reviews
 */
const ReviewForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    review: ''
  });
  
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errors, setErrors] = useState({});
  
  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };
  
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
  
  const validateForm = () => {
    const newErrors = {};
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a review title';
    }
    
    if (!formData.review.trim()) {
      newErrors.review = 'Please enter your review';
    } else if (formData.review.trim().length < 10) {
      newErrors.review = 'Review must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
    
    // Reset form
    setFormData({
      rating: 0,
      title: '',
      review: ''
    });
  };
  
  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className={`form-group ${errors.rating ? 'has-error' : ''}`}>
        <label>Your Rating</label>
        <div 
          className="star-rating"
          onMouseLeave={() => setHoveredRating(0)}
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <span
              key={rating}
              className={`rating-star ${rating <= (hoveredRating || formData.rating) ? 'filled' : ''}`}
              onClick={() => handleRatingClick(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
            >
              ★
            </span>
          ))}
        </div>
        {errors.rating && <div className="error-message">{errors.rating}</div>}
      </div>
      
      <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
        <label htmlFor="review-title">Review Title</label>
        <input
          type="text"
          id="review-title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Summarize your experience"
          maxLength="100"
        />
        {errors.title && <div className="error-message">{errors.title}</div>}
      </div>
      
      <div className={`form-group ${errors.review ? 'has-error' : ''}`}>
        <label htmlFor="review-text">Your Review</label>
        <textarea
          id="review-text"
          name="review"
          value={formData.review}
          onChange={handleInputChange}
          placeholder="What did you like or dislike about this product?"
          rows="4"
          maxLength="1000"
        ></textarea>
        {errors.review && <div className="error-message">{errors.review}</div>}
      </div>
      
      <button type="submit" className="submit-review-btn">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm; 