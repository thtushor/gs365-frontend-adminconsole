import React from "react";
import { IoWarning } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
  itemName = "",
  isLoading = false,
  loadingText = "Deleting...",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  icon = "warning", // "warning" or "trash"
  variant = "danger", // "danger" or "warning"
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    if (icon === "trash") {
      return <FaTrash className="text-4xl" />;
    }
    return <IoWarning className="text-4xl" />;
  };

  const getVariantClasses = () => {
    if (variant === "warning") {
      return {
        icon: "text-yellow-500",
        button: "bg-yellow-500 hover:bg-yellow-600",
        accent: "text-yellow-600",
      };
    }
    return {
      icon: "text-red-500",
      button: "bg-red-500 hover:bg-red-600",
      accent: "text-red-500",
    };
  };

  const variantClasses = getVariantClasses();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Icon */}
          <div className={`flex justify-center mb-4 ${variantClasses.icon}`}>
            {getIcon()}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 text-center mb-4">
            {message}
            {itemName && (
              <span className="block mt-1 font-medium text-gray-800">
                "{itemName}"
              </span>
            )}
            <span className={`block mt-2 font-medium ${variantClasses.accent}`}>
              This action cannot be undone.
            </span>
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses.button}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {loadingText}
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
