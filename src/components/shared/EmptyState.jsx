import React from "react";

const EmptyState = ({
  icon,
  title,
  description,
  actionButton,
  className = "",
}) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
        {icon && <div className="text-gray-400 mb-4">{icon}</div>}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        {actionButton && (
          <div className="flex justify-center">{actionButton}</div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
