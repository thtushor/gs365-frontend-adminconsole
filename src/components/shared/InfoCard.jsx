import React from "react";

const InfoCard = ({
  title,
  children,
  icon,
  color = "blue",
  className = "",
  headerClassName = "",
  bodyClassName = "",
}) => {
  const colorClasses = {
    blue: "border-blue-200 bg-gradient-to-br from-blue-50 to-white",
    green: "border-green-200 bg-gradient-to-br from-green-50 to-white",
    purple: "border-purple-200 bg-gradient-to-br from-purple-50 to-white",
    yellow: "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white",
    red: "border-red-200 bg-gradient-to-br from-red-50 to-white",
    gray: "border-gray-200 bg-gradient-to-br from-gray-50 to-white",
  };

  const dotColors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    gray: "bg-gray-500",
  };

  return (
    <div
      className={`border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ${colorClasses[color]} ${className}`}
    >
      <div className={`flex items-center mb-3 ${headerClassName}`}>
        <span
          className={`w-2 h-2 rounded-full mr-2 ${dotColors[color]}`}
        ></span>
        <h4 className="text-sm font-semibold text-gray-700 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h4>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

export default InfoCard;
