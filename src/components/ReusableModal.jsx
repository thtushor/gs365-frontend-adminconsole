import React from "react";

const ReusableModal = ({
  open,
  onClose,
  title,
  children,
  onSave,
  containerClassName,
  className,
  isLoading = false,
  loadingText = "Saving...",
}) => {
  if (!open) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center overflow-auto justify-center bg-black/60 ${containerClassName}`}
    >
      <div
        className={`bg-white overflow-auto max-h-[90vh] rounded-lg shadow-lg w-full max-w-md p-6 relative ${className}`}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div>{children}</div>
        {onSave && (
          <div className="mt-6 flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={onSave}
              disabled={isLoading}
            >
              {isLoading ? loadingText : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReusableModal;
