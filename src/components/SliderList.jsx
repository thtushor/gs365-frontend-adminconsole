import React, { useState } from "react";
import DataTable from "./DataTable";
import ThumbnailImage from "./ThumbnailImage";

const mockSliders = [
  {
    image: "https://via.placeholder.com/40",
    url: "https://www.glorybet.com",
    status: "Active",
  },
  {
    image: "https://via.placeholder.com/40",
    url: "https://www.glorybet.com",
    status: "Inactive",
  },
  {
    image: "https://via.placeholder.com/40",
    url: "https://www.glorybet.com",
    status: "Blocked",
  },
  {
    image: "https://via.placeholder.com/40",
    url: "https://www.glorybet.com",
    status: "Active",
  },
];

const columns = [
  {
    field: "image",
    headerName: "IMAGE",
    width: 60,
    render: (value) => (
      <ThumbnailImage className="!w-12 !h-8" src={value} size={40} />
    ),
  },
  {
    field: "url",
    headerName: "TARGET URL",
    width: 220,
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
            : value === "Inactive"
            ? "text-gray-500 font-semibold"
            : "text-red-500 font-semibold"
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

const SliderList = () => {
  const [search, setSearch] = useState("");
  const filteredSliders = mockSliders.filter((slider) =>
    slider.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="flex justify-end mb-2">
        <button
          className="border border-green-400 text-green-700 px-6 py-1 rounded hover:bg-green-50 transition font-medium"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
      <div className="border border-green-400 rounded-md bg-white p-6 overflow-x-auto max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">SLIDER LIST</h2>
        <div className="mb-4">
          <input
            className="border rounded px-3 py-2 w-full max-w-xs"
            placeholder="Search keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DataTable columns={columns} data={filteredSliders} />
        {filteredSliders.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No sliders found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderList;
