import React from "react";

const StatCard = ({
  title,
  value,
  color = "blue",
  icon,
  className = "",
  size = "md",
}) => {
  const colorClasses = {
    primary: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-cyan-50 text-cyan-700 border-cyan-200",
    secondary: "bg-gray-50 text-gray-700 border-gray-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    red: "bg-red-50 text-red-700 border-red-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const sizeClasses = {
    sm: "p-2 text-xs",
    md: "p-3 text-sm",
    lg: "p-4 text-base",
  };

  return (
    <div
      className={`border rounded-lg ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-500 uppercase tracking-wide font-medium">
            {title}
          </div>
          <div className="font-bold text-lg">{value}</div>
        </div>
        {icon && <div className="text-2xl opacity-70">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
