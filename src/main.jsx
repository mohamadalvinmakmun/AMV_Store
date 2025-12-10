import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Test routes
const TestRoutes = () => {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<TestRoutes />);