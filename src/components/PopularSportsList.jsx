import React from "react";
import ThumbnailImage from "./ThumbnailImage";
import { useNavigate } from "react-router-dom";
import DataTable from "./DataTable";

const mockPopularSports = [
  {
    name: "Football",
    image: "https://via.placeholder.com/40?text=FB",
    coverImage: "https://via.placeholder.com/80x40?text=Cover",
    status: "Active",
  },
  {
    name: "Tennis",
    image: "https://via.placeholder.com/40?text=TN",
    coverImage: "https://via.placeholder.com/80x40?text=Cover",
    status: "Inactive",
  },
];

const columns = [
  {
    field: "image",
    headerName: "IMAGE",
    width: 60,
    render: (value) => (
      <ThumbnailImage className="!w-24 !h-8" src={value} size={40} />
    ),
  },
  {
    field: "coverImage",
    headerName: "COVER IMAGE",
    width: 100,
    render: (value) => (
      <ThumbnailImage
        src={value}
        size={40}
        className="!w-24 !h-8"
        rounded={false}
      />
    ),
  },
  {
    field: "name",
    headerName: "NAME",
    width: 120,
  },
  {
    field: "status",
    headerName: "STATUS",
    width: 100,
    render: (value) => (
      <span
        className={
          value === "Active"
            ? "text-green-600 font-semibold"
            : "text-gray-500 font-semibold"
        }
      >
        {value}
      </span>
    ),
  },
  {
    field: "action",
    headerName: "ACTION",
    width: 120,
    align: "center",
    render: (value, row, idx) => (
      <div className="flex gap-2">
        <button
          className="text-green-600 hover:bg-green-50 p-1 rounded"
          title="Edit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.788l-4 1 1-4 14.362-14.3z"
            />
          </svg>
        </button>
        <button
          className="text-red-500 hover:bg-red-50 p-1 rounded"
          title="Delete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    ),
  },
];

const PopularSportsList = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Popular Sports List</h2>
        <button
          onClick={() => navigate("/add-popular-sports")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition font-medium"
        >
          Add Popular Sport
        </button>
      </div>
      <div className="border border-green-400 rounded-md bg-white p-6 overflow-x-auto">
        <DataTable columns={columns} data={mockPopularSports} />
        {mockPopularSports.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No popular sports found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularSportsList;
