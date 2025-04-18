import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import NotificationDemo from './pages/NotificationDemo';
import UserProfile from './components/UserProfile';
// Import react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import your application components here
// import Home from './pages/Home';
// etc.

import './App.css';

/**
 * Main App component
 */
const App = () => {
  return (
    <NotificationProvider>
      <Router>
        <div className="app">
          <nav className="app-nav">
            <div className="nav-logo">MiliconStore</div>
            <div className="nav-links">
              <Link to="/profile" className="nav-link">User Profile</Link>
              <Link to="/notifications" className="nav-link">Notification Demo</Link>
            </div>
          </nav>
          
          <main className="main-content">
            <Routes>
              {/* Define your routes here */}
              <Route path="/notifications" element={<NotificationDemo />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/" element={<div className="welcome-page">
                <h1>Welcome to MiliconStore!</h1>
                <p>This is a demo of the notification system implementation.</p>
                <div className="welcome-links">
                  <Link to="/notifications" className="welcome-link">View Notification Demo</Link>
                  <Link to="/profile" className="welcome-link">Go to User Profile</Link>
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