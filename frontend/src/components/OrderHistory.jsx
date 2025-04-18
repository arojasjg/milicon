import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/slices/orderSlice';
import './UserProfile.css';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleViewDetails = (orderId) => {
    const order = orders.find(order => order.id === orderId);
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Orders Yet</h3>
        <p>You haven't placed any orders yet.</p>
        <button className="shop-now-btn">Shop Now</button>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="order-details">
        <button className="back-button" onClick={handleBackToList}>
          ← Back to Orders
        </button>
        
        <h3>Order #{selectedOrder.id}</h3>
        
        <div className="order-details-header">
          <div className="order-detail-item">
            <span className="label">Date Placed:</span>
            <span className="value">{formatDate(selectedOrder.date)}</span>
          </div>
          <div className="order-detail-item">
            <span className="label">Status:</span>
            <span className={`value status ${getStatusClass(selectedOrder.status)}`}>
              {selectedOrder.status}
            </span>
          </div>
          <div className="order-detail-item">
            <span className="label">Total:</span>
            <span className="value">{formatCurrency(selectedOrder.total)}</span>
          </div>
        </div>
        
        <div className="order-address">
          <h4>Shipping Address</h4>
          <p>
            {selectedOrder.shippingAddress.street}<br />
            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
            {selectedOrder.shippingAddress.country}
          </p>
        </div>
        
        <h4>Items</h4>
        <div className="order-items">
          {selectedOrder.items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-name">{item.name}</div>
              <div className="item-details">
                <span className="item-price">{formatCurrency(item.price)}</span>
                <span className="item-quantity">Qty: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="order-total">
          <div className="total-label">Total</div>
          <div className="total-amount">{formatCurrency(selectedOrder.total)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history">
      <h3>Order History</h3>
      
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-id">Order #{order.id}</div>
              <div className={`order-status ${getStatusClass(order.status)}`}>
                {order.status}
              </div>
            </div>
            
            <div className="order-date">Placed on {formatDate(order.date)}</div>
            <div className="order-total">{formatCurrency(order.total)}</div>
            
            <div className="order-items-summary">
              {order.items.map((item) => (
                <div key={item.id} className="order-item-brief">
                  {item.name} × {item.quantity}
                </div>
              ))}
            </div>
            
            <button 
              className="view-details-btn"
              onClick={() => handleViewDetails(order.id)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory; 