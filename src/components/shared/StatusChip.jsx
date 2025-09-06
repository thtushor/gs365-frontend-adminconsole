import React from "react";

// Status configurations with default styling
const STATUS_CONFIGS = {
  // Basic statuses
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800 border-green-200",
    icon: "●",
  },
  inactive: {
    label: "Inactive",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: "○",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "⏳",
  },

  // Success/Error statuses
  success: {
    label: "Success",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "✓",
  },
  error: {
    label: "Error",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: "✗",
  },
  warning: {
    label: "Warning",
    className: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "⚠",
  },

  // State statuses
  enabled: {
    label: "Enabled",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "●",
  },
  disabled: {
    label: "Disabled",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    icon: "○",
  },

  // Process statuses
  processing: {
    label: "Processing",
    className: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "⟳",
  },
  completed: {
    label: "Completed",
    className: "bg-teal-100 text-teal-800 border-teal-200",
    icon: "✓",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-600 border-slate-200",
    icon: "✗",
  },
  win: {
    label: "Win",
    className: "bg-teal-100 text-teal-800 border-teal-200",
    icon: "✓",
  },
  loss: {
    label: "loss",
    className: "bg-slate-100 text-slate-600 border-slate-200",
    icon: "✗",
  },

  // Payment statuses
  paid: {
    label: "Paid",
    className: "bg-green-100 text-green-800 border-green-200",
    icon: "💰",
  },
  unpaid: {
    label: "Unpaid",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: "💳",
  },

  // User statuses
  online: {
    label: "Online",
    className: "bg-green-100 text-green-800 border-green-200",
    icon: "●",
  },
  offline: {
    label: "Offline",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    icon: "○",
  },

  // Priority statuses
  high: {
    label: "High",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: "🔴",
  },
  medium: {
    label: "Medium",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "🟡",
  },
  low: {
    label: "Low",
    className: "bg-green-100 text-green-800 border-green-200",
    icon: "🟢",
  },
};

const StatusChip = ({
  status,
  label,
  variant = "default",
  size = "md",
  showIcon = true,
  className = "",
  customConfig = null,
  onClick = null,
  disabled = false,
}) => {
  // Get configuration based on status or use custom config
  const config = customConfig || STATUS_CONFIGS[status?.toLowerCase()];

  if (!config && !customConfig) {
    console.warn(
      `StatusChip: Unknown status "${status}". Using default styling.`
    );
  }

  // Size configurations
  const sizeConfigs = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-sm",
    xl: "px-4 py-2.5 text-base",
  };

  // Variant configurations
  const variantConfigs = {
    default: "border rounded-full font-medium",
    outlined: "border-2 rounded-full font-medium bg-transparent",
    filled: "border-0 rounded-full font-medium",
    pill: "border rounded-full font-medium px-4",
    square: "border rounded font-medium",
    minimal: "border-0 rounded font-medium",
  };

  // Custom configuration or fallback to default
  const finalConfig = customConfig ||
    config || {
      label: label || status || "Unknown",
      className: "bg-gray-100 text-gray-600 border-gray-200",
      icon: "",
    };

  const baseClasses = `
    inline-flex items-center justify-center gap-1.5
    transition-all duration-200 ease-in-out
    ${sizeConfigs[size]}
    ${variantConfigs[variant]}
    ${finalConfig.className}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${onClick && !disabled ? "cursor-pointer hover:scale-105" : ""}
    ${className}
  `.trim();

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick(status, finalConfig);
    }
  };

  return (
    <span
      className={baseClasses}
      onClick={handleClick}
      title={finalConfig.label}
    >
      {showIcon && finalConfig.icon && (
        <span className="text-xs leading-none">{finalConfig.icon}</span>
      )}
      <span className="leading-none">{finalConfig.label}</span>
    </span>
  );
};

// Export the status configs for external use
export { STATUS_CONFIGS };

// Export a helper function to create custom status configs
export const createStatusConfig = (label, className, icon = null) => ({
  label,
  className,
  icon,
});

export default StatusChip;
