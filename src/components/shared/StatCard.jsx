import React from "react";

const StatCard = ({
  title,
  value,
  color = "blue",
  icon,
  className = "",
  size = "md",
  trend,
  trendValue,
}) => {
  const colorClasses = {
    primary: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-200",
      text: "text-blue-800",
      value: "text-blue-900",
      icon: "bg-blue-500",
      trend: "text-blue-600"
    },
    success: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      border: "border-green-200",
      text: "text-green-800",
      value: "text-green-900",
      icon: "bg-green-500",
      trend: "text-green-600"
    },
    warning: {
      bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      border: "border-yellow-200",
      text: "text-yellow-800",
      value: "text-yellow-900",
      icon: "bg-yellow-500",
      trend: "text-yellow-600"
    },
    danger: {
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      border: "border-red-200",
      text: "text-red-800",
      value: "text-red-900",
      icon: "bg-red-500",
      trend: "text-red-600"
    },
    info: {
      bg: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      border: "border-cyan-200",
      text: "text-cyan-800",
      value: "text-cyan-900",
      icon: "bg-cyan-500",
      trend: "text-cyan-600"
    },
    secondary: {
      bg: "bg-gradient-to-br from-gray-50 to-gray-100",
      border: "border-gray-200",
      text: "text-gray-800",
      value: "text-gray-900",
      icon: "bg-gray-500",
      trend: "text-gray-600"
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-200",
      text: "text-blue-800",
      value: "text-blue-900",
      icon: "bg-blue-500",
      trend: "text-blue-600"
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      border: "border-green-200",
      text: "text-green-800",
      value: "text-green-900",
      icon: "bg-green-500",
      trend: "text-green-600"
    },
    yellow: {
      bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      border: "border-yellow-200",
      text: "text-yellow-800",
      value: "text-yellow-900",
      icon: "bg-yellow-500",
      trend: "text-yellow-600"
    },
    red: {
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      border: "border-red-200",
      text: "text-red-800",
      value: "text-red-900",
      icon: "bg-red-500",
      trend: "text-red-600"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      border: "border-purple-200",
      text: "text-purple-800",
      value: "text-purple-900",
      icon: "bg-purple-500",
      trend: "text-purple-600"
    },
    gray: {
      bg: "bg-gradient-to-br from-gray-50 to-gray-100",
      border: "border-gray-200",
      text: "text-gray-800",
      value: "text-gray-900",
      icon: "bg-gray-500",
      trend: "text-gray-600"
    },
  };

  const sizeClasses = {
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`relative overflow-hidden border-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${colors.bg} ${colors.border} ${sizeClasses[size]} ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className={`w-full h-full ${colors.icon} rounded-full transform translate-x-8 -translate-y-8`}></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`text-sm font-semibold uppercase tracking-wider ${colors.text}`}>
            {title}
          </div>
          {/* {icon && (
            <div className={`p-1 rounded-full ${colors.icon} text-white shadow-lg`}>
              <span className="text-xl">{icon}</span>
            </div>
          )} */}
        </div>
        
        <div className="space-y-2">
          <div className={`text-xl font-bold ${colors.value}`}>
            {value}
          </div>
          
          {trend && trendValue && (
            <div className={`flex items-center text-sm font-medium ${colors.trend}`}>
              <span className="mr-1">
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
              </span>
              {trendValue}
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle border accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.icon} opacity-60`}></div>
    </div>
  );
};

export default StatCard;
