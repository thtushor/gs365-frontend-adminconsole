import React, { useState } from "react";
import { IoWarning } from "react-icons/io5";
import { usePostRequest } from "../../Utils/apiClient";

const DeleteConfirmationPopup = ({
  apiUrl, // API endpoint
  payload = {}, // { id } or more
  onSuccess, // Callback after success
  onCancel, // Callback on cancel
  message = "Are you sure you want to delete this item?", // Optional custom message
}) => {
  const [loading, setLoading] = useState(false);
  const postRequest = usePostRequest();

  const handleDelete = async () => {
    try {
      await postRequest({
        url: apiUrl,
        body: payload,
        successMessage: "Deleted successfully!",
        errorMessage: "Failed to delete.",
        setLoading,
        onSuccessFn: onSuccess,
      });
    } catch (err) {
      // Error is already handled inside usePostRequest
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 pt-2 shadow-lg">
      <div className="text-[60px] text-red-500">
        <IoWarning />
      </div>
      <h2 className="text-xl font-bold mt-3 text-gray-800">Confirm Deletion</h2>
      <p className="text-sm text-gray-600 mt-2">
        {message}
        <br />
        <span className="block mt-2 font-medium text-red-500">
          This action cannot be undone.
        </span>
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-5 py-2 bg-green-500 cursor-pointer hover:bg-green-600 text-white text-sm font-medium rounded-lg"
        >
          {loading ? "Deleting..." : "Yes, Delete"}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2 border border-gray-300 cursor-pointer hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;
