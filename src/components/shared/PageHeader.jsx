import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const PageHeader = ({
  title,
  subtitle,
  onBack,
  actionButton,
  actions,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b border-gray-200 p-6 rounded-lg mb-6 ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:bg-white hover:text-blue-600 rounded-full transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md"
              title="Go back"
            >
              <FaArrowLeft />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              {icon && <div className="text-2xl text-blue-600">{icon}</div>}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="text-gray-600 text-sm lg:text-base">{subtitle}</p>
            )}
          </div>
        </div>
        {(actionButton || actions) && (
          <div className="flex-shrink-0">
            {actionButton}
            {actions && (
              <div className="flex space-x-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      action.variant === 'primary'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
