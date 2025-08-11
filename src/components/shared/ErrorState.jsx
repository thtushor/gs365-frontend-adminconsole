import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorState = ({
  title = "Error",
  message,
  onRetry,
  onBack,
  className = "",
}) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-red-500 mb-4">
          <FaExclamationTriangle className="text-4xl mx-auto mb-2" />
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm text-red-600 mt-1">{message}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {onBack && (
            <button
              onClick={onBack}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
