import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ 
  message = "Memuat...", 
  size = "medium",
  fullScreen = false,
  type = "default" // "default", "product", "page"
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const spinnerClass = `spinner ${sizeClasses[size] || sizeClasses.medium}`;

  if (fullScreen) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="spinner-wrapper">
            <div className={spinnerClass}>
              <div className="spinner-ring"></div>
              <div className="spinner-ring spinner-ring-2"></div>
              <div className="spinner-ring spinner-ring-3"></div>
            </div>
          </div>
          <p className="loading-message">{message}</p>
          <div className="loading-progress">
            <div className="progress-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "product") {
    return (
      <div className="product-loading">
        <div className="loading-content">
          <div className="product-spinner">
            <div className="shoe-icon">👟</div>
            <div className="spinner-ring product-ring"></div>
            <div className="spinner-ring product-ring-2"></div>
          </div>
          <p className="product-loading-text">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (type === "page") {
    return (
      <div className="page-loading">
        <div className="page-loading-content">
          <div className="brand-spinner">
            <div className="brand-logo">AMV</div>
            <div className="spinner-circle"></div>
            <div className="spinner-dots">
              <div className="dot dot-1"></div>
              <div className="dot dot-2"></div>
              <div className="dot dot-3"></div>
            </div>
          </div>
          <p className="page-loading-text">{message}</p>
        </div>
      </div>
    );
  }

  // Default Loading
  return (
    <div className="loading-center">
      <div className="center-content">
        <div className="spinner-container">
          <div className={spinnerClass}>
            <div className="spinner-core"></div>
          </div>
          <div className="spinner-orbit">
            <div className="orbit-dot orbit-dot-1"></div>
            <div className="orbit-dot orbit-dot-2"></div>
            <div className="orbit-dot orbit-dot-3"></div>
          </div>
        </div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export const LoadingOverlay = ({ transparent = false, message = "Memuat..." }) => {
  return (
    <div className={`loading-overlay ${transparent ? 'transparent' : ''}`}>
      <div className="overlay-center">
        <div className="overlay-spinner">
          <div className="overlay-ring"></div>
          <div className="overlay-ring overlay-ring-2"></div>
          <div className="overlay-dot"></div>
        </div>
        <p className="overlay-message">{message}</p>
      </div>
    </div>
  );
};

// Keep existing ProductLoadingSkeleton and ProductsGridSkeleton components...

export default LoadingSpinner;