import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesReport, fetchTopProducts, fetchActiveUsers } from '../../redux/slices/analyticsSlice';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import { fetchAllProducts, updateProduct, deleteProduct } from '../../redux/slices/productSlice';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import './Dashboard.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { salesReport, topProducts, activeUsers, loading: analyticsLoading } = useSelector((state) => state.analytics);
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { products, loading: productsLoading } = useSelector((state) => state.products);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  useEffect(() => {
    if (user?.id && user?.role === 'ADMIN') {
      dispatch(fetchSalesReport(dateRange));
      dispatch(fetchTopProducts());
      dispatch(fetchActiveUsers());
      dispatch(fetchAllOrders());
      dispatch(fetchAllProducts());
    }
  }, [dispatch, user]);
  
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };
  
  const handleApplyDateRange = () => {
    dispatch(fetchSalesReport(dateRange));
  };
  
  const handleOrderStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }))
      .then(() => {
        toast.success(`Order #${orderId} status updated to ${newStatus}`);
      });
  };
  
  const handleProductUpdate = (productId, productData) => {
    dispatch(updateProduct({ productId, productData }))
      .then(() => {
        toast.success(`Product #${productId} updated successfully`);
      });
  };
  
  const handleProductDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(productId))
        .then(() => {
          toast.success(`Product #${productId} deleted successfully`);
        });
    }
  };
  
  if (!user || user.role !== 'ADMIN') {
    return <div className="unauthorized">You are not authorized to access this page</div>;
  }
  
  // Prepare chart data
  const salesChartData = {
    labels: salesReport?.dailySales ? Object.keys(salesReport.dailySales) : [],
    datasets: [
      {
        label: 'Daily Sales ($)',
        data: salesReport?.dailySales ? Object.values(salesReport.dailySales) : [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };
  
  const categoryChartData = {
    labels: salesReport?.categorySales ? Object.keys(salesReport.categorySales) : [],
    datasets: [
      {
        label: 'Sales by Category',
        data: salesReport?.categorySales ? Object.values(salesReport.categorySales) : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ]
      }
    ]
  };
  
  const topProductsChartData = {
    labels: topProducts?.map(p => p.productName) || [],
    datasets: [
      {
        label: 'Views',
        data: topProducts?.map(p => p.viewCount) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      },
      {
        label: 'Sales',
        data: topProducts?.map(p => p.salesCount) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      }
    ]
  };
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="date-range-selector">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <button className="apply-btn" onClick={handleApplyDateRange}>Apply</button>
            </div>
            
            {analyticsLoading ? (
              <div className="loading">Loading analytics data...</div>
            ) : (
              <>
                <div className="stats-cards">
                  <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{salesReport?.totalOrders || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Sales</h3>
                    <p className="stat-value">${salesReport?.totalSales?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Average Order Value</h3>
                    <p className="stat-value">
                      ${salesReport?.totalOrders ? (salesReport.totalSales / salesReport.totalOrders).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="stat-card">
                    <h3>Active Users</h3>
                    <p className="stat-value">{activeUsers?.length || 0}</p>
                  </div>
                </div>
                
                <div className="charts-container">
                  <div className="chart-card">
                    <h3>Sales Trend</h3>
                    <div className="chart">
                      <Line data={salesChartData} />
                    </div>
                  </div>
                  
                  <div className="chart-card">
                    <h3>Category Distribution</h3>
                    <div className="chart">
                      <Pie data={categoryChartData} />
                    </div>
                  </div>
                  
                  <div className="chart-card">
                    <h3>Top Products</h3>
                    <div className="chart">
                      <Bar data={topProductsChartData} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="orders-tab">
            <h2>Order Management</h2>
            {ordersLoading ? (
              <div className="loading">Loading orders...</div>
            ) : (
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.userId}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>${order.totalAmount.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'products' && (
          <div className="products-tab">
            <h2>Product Management</h2>
            {productsLoading ? (
              <div className="loading">Loading products...</div>
            ) : (
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          <img
                            src={product.imageUrl || '/images/placeholder.jpg'}
                            alt={product.name}
                            className="product-thumbnail"
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.category.name}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => {/* Open edit modal */}}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleProductDelete(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="users-tab">
            <h2>User Management</h2>
            {/* User management UI */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 