import React, { useState } from "react";
import { IoWarning } from "react-icons/io5";
import { useQueryClient } from "@tanstack/react-query";
import { usePostRequest } from "../Utils/apiClient";
import { API_LIST, BASE_URL } from "../api/ApiList";

const DeleteDropdownOption = ({ onCancel, data }) => {
  const postRequest = usePostRequest();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const onConfirm = async () => {
    if (!data?.id) return;

    try {
      await postRequest({
        url: `${BASE_URL + API_LIST.DELETE_DROPDOWN_OPTION}/${data.id}`,
        setLoading,
        successMessage: "Dropdown option deleted successfully",
        errorMessage: "Failed to delete dropdown option",
      });

      // ✅ Refresh dropdowns
      await queryClient.invalidateQueries({ queryKey: ["dropdowns"] });

      // ✅ Close modal
      onCancel();
    } catch (error) {
      console.error("Failed to delete dropdown option:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 pt-2 shadow-lg">
      <div>
        <div className="text-[60px] text-red-500">
          <IoWarning />
        </div>
        <h2 className="text-xl font-bold mt-3 text-gray-800">Confirm Delete</h2>
        <p className="text-sm text-gray-600">
          This action might affect visibility or behavior in the system.
          <br />
          <span className="block mt-2 font-medium text-red-500">
            Are you sure you want to continue?
          </span>
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 cursor-pointer bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDropdownOption;
