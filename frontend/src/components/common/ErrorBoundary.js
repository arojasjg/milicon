import React, { Component } from 'react';
import './ErrorBoundary.css';

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree.
 * It displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for development
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Here you could also send the error to a logging service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    // Reset the error state and attempt to re-render
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Something went wrong</h2>
            {this.props.fallback ? (
              this.props.fallback
            ) : (
              <>
                <p>We're sorry - something has gone wrong.</p>
                <p>Our team has been notified and we're working to fix the issue.</p>
                {this.state.error && process.env.NODE_ENV === 'development' && (
                  <div className="error-details">
                    <h3>Error Details (Development Only):</h3>
                    <p>{this.state.error.toString()}</p>
                    <div className="error-stack">
                      <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    </div>
                  </div>
                )}
                <button className="retry-button" onClick={this.handleRetry}>
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 