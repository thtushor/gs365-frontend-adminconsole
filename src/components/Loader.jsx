import React from 'react';
import './Loader.css'; // We'll create this CSS file next

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p className="loader-text">Loading user data...</p>
    </div>
  );
};

export default Loader;
