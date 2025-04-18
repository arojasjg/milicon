import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../redux/slices/productSlice';
import { addItem } from '../redux/slices/cartSlice';
import { fetchProductReviews, submitReview } from '../redux/slices/reviewSlice';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { toast } from 'react-toastify';
import './ProductDetail.css';
import ProductRecommendations from './ProductRecommendations';
import { trackProductInteraction } from '../redux/slices/recommendationSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchProductReviews(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product && user?.id) {
      dispatch(trackProductInteraction({
        userId: user.id,
        productId: product.id,
        interactionType: 'view'
      }));
    }
  }, [dispatch, product, user]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addItem({ ...product, quantity }));
      toast.success(`${product.name} added to cart!`);
      
      if (user?.id) {
        dispatch(trackProductInteraction({
          userId: user.id,
          productId: product.id,
          interactionType: 'cart',
          value: quantity
        }));
      }
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleReviewSubmit = (reviewData) => {
    dispatch(submitReview({
      productId: id,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      ...reviewData
    }));
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image">
          <img src={product.imageUrl || '/images/placeholder.jpg'} alt={product.name} />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="product-rating">
            {product.averageRating ? (
              <>
                <span className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star ${star <= Math.round(product.averageRating) ? 'filled' : ''}`}
                    ></i>
                  ))}
                </span>
                <span className="rating-value">({product.averageRating.toFixed(1)})</span>
              </>
            ) : (
              <span>No ratings yet</span>
            )}
          </div>
          <p className="product-category">Category: {product.category.name}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>
          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={product.stock === 0}
              />
            </div>
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="product-reviews">
        <h2>Customer Reviews</h2>
        <ReviewList productId={id} />
        
        {isAuthenticated ? (
          <div className="review-form-container">
            <h3>Write a Review</h3>
            <ReviewForm onSubmit={handleReviewSubmit} />
          </div>
        ) : (
          <div className="login-to-review">
            <p>Please <Link to="/login">login</Link> to write a review</p>
          </div>
        )}
      </div>

      <div className="product-recommendations-section">
        {isAuthenticated && (
          <ProductRecommendations 
            type="personalized" 
            userId={user.id} 
            limit={4} 
          />
        )}
        
        <ProductRecommendations 
          type="similar" 
          productId={id} 
          limit={4} 
        />
        
        <ProductRecommendations 
          type="frequently-bought-together" 
          productId={id} 
          limit={4} 
        />
      </div>
    </div>
  );
};

export default ProductDetail; 