import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons'; // Assuming Ant Design icons are available
import '../../App.css'; // Assuming App.css contains some basic styling or can be extended

const ServerError = () => {
  return (
    <div className="server-error-wrapper">
      <div className="server-error-container">
        <ExclamationCircleOutlined className="server-error-icon" />
        <h1 className="server-error-title">500 - Server Error</h1>
        <p className="server-error-message">
          Oops! Something went wrong on our end. We're working to fix it.
        </p>
        <p className="server-error-message">
          Please try again later or contact support if the issue persists.
        </p>
        <Link to="/" className="server-error-home-link">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ServerError;
