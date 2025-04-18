import React from 'react';
import { useSelector } from 'react-redux';
import './ReviewList.css';

/**
 * Review List component
 * Displays product reviews
 */
const ReviewList = ({ productId }) => {
  // In a real implementation, this would use data from Redux or props
  // For now we'll use dummy data
  const reviews = [
    {
      id: 1,
      userId: 'user1',
      userName: 'John Doe',
      rating: 4,
      title: 'Great product, highly recommended',
      review: 'I\'ve been using this for a month and it\'s been fantastic. Quality is excellent.',
      date: '2023-03-15',
      verified: true
    },
    {
      id: 2,
      userId: 'user2',
      userName: 'Jane Smith',
      rating: 5,
      title: 'Exceeded my expectations',
      review: 'This product is everything I hoped for and more. The build quality is excellent and it works perfectly.',
      date: '2023-02-22',
      verified: true
    }
  ];
  
  const loading = false;
  const error = null;
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`review-star ${star <= rating ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }
  
  if (error) {
    return <div className="reviews-error">Error loading reviews: {error}</div>;
  }
  
  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>This product has no reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }
  
  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <div className="review-user-info">
              <span className="review-user-name">{review.userName}</span>
              {review.verified && (
                <span className="verified-badge">Verified Purchase</span>
              )}
            </div>
            <div className="review-date">{formatDate(review.date)}</div>
          </div>
          
          <div className="review-rating">
            {renderStars(review.rating)}
            <span className="review-title">{review.title}</span>
          </div>
          
          <div className="review-content">
            {review.review}
          </div>
          
          <div className="review-actions">
            <button className="review-helpful-btn">
              <i className="far fa-thumbs-up"></i> Helpful
            </button>
            <button className="review-report-btn">Report</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 