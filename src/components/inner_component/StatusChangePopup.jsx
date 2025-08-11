import React from "react";
import { IoWarning } from "react-icons/io5";

const StatusChangePopup = ({ onConfirm, onCancel, row }) => {
  return (
    <div className="bg-white rounded-lg p-5 pt-2 shadow-lg ">
      <div className="">
        <div className="text-[60px] text-red-500">
          <IoWarning />
        </div>
        <h2 className="text-xl font-bold mt-3 text-gray-800">
          Confirm Status Change
        </h2>
        <p className="text-sm text-gray-600">
          This action might affect visibility or behavior in the system.
          <br />
          <span className="block  mt-2 font-medium text-red-500">
            Are you sure you want to continue?
          </span>
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => onConfirm(row)}
            className="px-5 py-2 bg-green-500 cursor-pointer hover:bg-green-600 text-white text-sm font-medium rounded-lg"
          >
            Yes, Change
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 border cursor-pointer border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusChangePopup;
