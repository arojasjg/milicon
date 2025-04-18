import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, selectIsAuthenticated } from './redux/slices/authSlice';
import { NotificationProvider } from './context/NotificationContext';
import NotificationDemo from './pages/NotificationDemo';
import UserProfile from './components/UserProfile';
// Import auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
// Import cart components
import ShoppingCart from './components/ShoppingCart';
// Import checkout page
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
// Import product pages
import ProductPage from './pages/ProductPage';
import ProductDetail from './components/ProductDetail';
// Import protected route component
import ProtectedRoute from './components/common/ProtectedRoute';
// Import react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import additional components here as needed

import './App.css';

/**
 * Main App component
 */
const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Initialize app - fetch user profile if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);
  
  return (
    <NotificationProvider>
      <Router>
        <div className="app">
          <nav className="app-nav">
            <div className="nav-logo">MiliconStore</div>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/products" className="nav-link">Products</Link>
              <Link to="/profile" className="nav-link">User Profile</Link>
              <Link to="/notifications" className="nav-link">Notification Demo</Link>
              <Link to="/cart" className="nav-link">Cart</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </div>
          </nav>
          
          <main className="main-content">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              
              {/* Product Routes */}
              <Route path="/products" element={<ProductPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              
              {/* Cart Routes */}
              <Route path="/cart" element={<ShoppingCart />} />
              
              {/* Checkout Routes (Protected) */}
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/order-confirmation" element={
                <ProtectedRoute>
                  <OrderConfirmationPage />
                </ProtectedRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              
              {/* Add other protected routes here */}
              
              {/* Other Routes */}
              <Route path="/notifications" element={<NotificationDemo />} />
              <Route path="/" element={<div className="welcome-page">
                <h1>Welcome to MiliconStore!</h1>
                <p>Your one-stop shop for premium sports equipment</p>
                <div className="welcome-links">
                  <Link to="/products" className="welcome-link">Browse Products</Link>
                  <Link to="/notifications" className="welcome-link">View Notification Demo</Link>
                  <Link to="/profile" className="welcome-link">Go to User Profile</Link>
                  <Link to="/cart" className="welcome-link">View Cart</Link>
                </div>
              </div>} />
            </Routes>
          </main>
          
          {/* Add ToastContainer for react-toastify */}
          <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </NotificationProvider>
  );
};

export default App; 