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

/*
 * Main App component - the root of our UI
 * AR - 2023-03-15 
 * 
 * TODOS:
 * - Add error boundaries
 * - Implement proper loading states
 * - Fix mobile menu positioning issues 
 * - Dark mode toggle
 */
const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Initialize app - fetch user profile if token exists
  useEffect(() => {
    // Only fetch user data if we're logged in to avoid 401s
    if (isAuthenticated) {
      // FIXME: sometimes we get 401 here even with valid token
      // might be race condition with token refresh
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);
  
  // Debugging - remove before prod
  // console.log('App render, auth state:', isAuthenticated);
  
  // funcion para renderizar la homepage
  // podria moverla a un componente aparte pero por ahora la dejo aqui
  const renderHome = () => {
    return (
      <div className="welcome-page">
        <h1>¡Bienvenido a MiliconStore!</h1>
        <p>Tu tienda de artículos deportivos</p>
        <div className="welcome-links">
          <Link to="/products" className="welcome-link">Ver Productos</Link>
          <Link to="/notifications" className="welcome-link">Notificaciones</Link>
          <Link to="/profile" className="welcome-link">Mi Perfil</Link>
          <Link to="/cart" className="welcome-link">Carrito</Link>
        </div>
      </div>
    );
  };
  
  return (
    <NotificationProvider>
      <Router>
        <div className="app">
          {/* Main navigation - might break out to component later */}
          <nav className="app-nav">
            <div className="nav-logo">MiliconStore</div>
            <div className="nav-links">
              <Link to="/" className="nav-link">Inicio</Link>
              <Link to="/products" className="nav-link">Productos</Link>
              <Link to="/profile" className="nav-link">Mi Perfil</Link>
              <Link to="/notifications" className="nav-link">Notificaciones</Link>
              <Link to="/cart" className="nav-link">Carrito</Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="nav-link">Iniciar Sesión</Link>
                  <Link to="/register" className="nav-link">Registrarse</Link>
                </>
              ) : (
                <Link to="/logout" className="nav-link">Cerrar Sesión</Link>
              )}
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
              
              {/* Checkout Routes - protected */}
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/order-confirmation" 
                element={
                  <ProtectedRoute>
                    <OrderConfirmationPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* User Routes - protected */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Demo Routes */}
              <Route path="/notifications" element={<NotificationDemo />} />
              
              {/* Homepage */}
              <Route path="/" element={renderHome()} />

              {/* 404 - keep as last route */}
              <Route path="*" element={
                <div className="not-found">
                  <h2>404 - Página no encontrada</h2>
                  <p>La página que buscas no existe o fue movida.</p>
                  <Link to="/" className="home-link">Volver al inicio</Link>
                </div>
              } />
            </Routes>
          </main>
          
          {/* Toast notifications container */}
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