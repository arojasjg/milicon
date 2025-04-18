import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRecommendations } from '../redux/slices/recommendationSlice';
import './ProductRecommendations.css';

const ProductRecommendations = ({ type, productId, userId, limit = 4 }) => {
  const dispatch = useDispatch();
  const { recommendations, loading, error } = useSelector((state) => state.recommendations);
  
  useEffect(() => {
    if (type === 'personalized' && userId) {
      dispatch(fetchRecommendations({ type, userId, limit }));
    } else if (type === 'popular') {
      dispatch(fetchRecommendations({ type, limit }));
    } else if ((type === 'similar' || type === 'frequently-bought-together') && productId) {
      dispatch(fetchRecommendations({ type, productId, limit }));
    }
  }, [dispatch, type, productId, userId, limit]);
  
  if (loading) return <div className="recommendations-loading">Loading recommendations...</div>;
  if (error) return <div className="recommendations-error">Error loading recommendations</div>;
  if (!recommendations || recommendations.length === 0) return null;
  
  return (
    <div className="product-recommendations">
      <h3 className="recommendations-title">
        {type === 'personalized' && 'Recommended for You'}
        {type === 'popular' && 'Popular Products'}
        {type === 'similar' && 'Similar Products'}
        {type === 'frequently-bought-together' && 'Frequently Bought Together'}
      </h3>
      <div className="recommendations-container">
        {recommendations.map((recommendation) => (
          <div key={recommendation.product.id} className="recommendation-card">
            <Link to={`/products/${recommendation.product.id}`}>
              <div className="recommendation-image">
                <img 
                  src={recommendation.product.imageUrl || '/images/placeholder.jpg'} 
                  alt={recommendation.product.name} 
                />
              </div>
              <div className="recommendation-info">
                <h4 className="recommendation-name">{recommendation.product.name}</h4>
                <p className="recommendation-price">${recommendation.product.price.toFixed(2)}</p>
                {recommendation.product.averageRating > 0 && (
                  <div className="recommendation-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fas fa-star ${star <= Math.round(recommendation.product.averageRating) ? 'filled' : ''}`}
                      ></i>
                    ))}
                    <span>({recommendation.product.averageRating.toFixed(1)})</span>
                  </div>
                )}
                <p className="recommendation-reason">{recommendation.reason}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations; 