import React from 'react';
import './LoadingSpinner.css';

/**
 * A reusable loading spinner component.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='medium'] - Size of the spinner: 'small', 'medium', or 'large'
 * @param {string} [props.color='primary'] - Color theme: 'primary', 'secondary', or 'light'
 * @param {string} [props.message] - Optional message to display below the spinner
 * @param {boolean} [props.fullPage=false] - Whether the spinner should take up the full page
 * @returns {JSX.Element} The loading spinner component
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  message, 
  fullPage = false 
}) => {
  const spinnerClass = `spinner spinner-${size} spinner-${color}`;
  
  const containerClass = fullPage 
    ? 'spinner-container full-page' 
    : 'spinner-container';

  return (
    <div className={containerClass}>
      <div className={spinnerClass}>
        <div className="spinner-inner"></div>
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner; 