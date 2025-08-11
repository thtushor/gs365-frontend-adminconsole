import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const PageHeader = ({
  title,
  subtitle,
  onBack,
  actionButton,
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
        {actionButton && <div className="flex-shrink-0">{actionButton}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
