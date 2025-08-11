import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThumbnailImage from "./ThumbnailImage";
import DataTable from "./DataTable";

// Updated mock data for demonstration
const sportsData = [
  {
    name: "Cricket",
    image: "https://via.placeholder.com/40",
    coverImage: "https://via.placeholder.com/80x40?text=Cover",
    sid: "###",
    theme: "###",
    status: "Active",
  },
  {
    name: "Cricket",
    image: "https://via.placeholder.com/40",
    coverImage: "https://via.placeholder.com/80x40?text=Cover",
    sid: "###",
    theme: "###",
    status: "Inactive",
  },
  {
    name: "Cricket",
    image: "https://via.placeholder.com/40",
    coverImage: "https://via.placeholder.com/80x40?text=Cover",
    sid: "###",
    theme: "###",
    status: "Blocked",
  },
  {
    name: "Cricket",
    image: "https://via.placeholder.com/40",
    coverImage: "https://via.placeholder.com/80x40?text=Cover",
    sid: "###",
    theme: "###",
    status: "Active",
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
    field: "sid",
    headerName: "SID",
    width: 80,
  },
  {
    field: "theme",
    headerName: "THEME",
    width: 80,
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

const SportsListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: "",
    apiSportId: "",
    scoreboardBgColor: "",
    apiKey: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredSports = sportsData.filter((sport) => {
    return (
      (sport.name || "")
        .toLowerCase()
        .includes((filters.name || "").toLowerCase()) &&
      (sport.sid || "")
        .toLowerCase()
        .includes((filters.apiSportId || "").toLowerCase()) &&
      (sport.theme || "")
        .toLowerCase()
        .includes((filters.scoreboardBgColor || "").toLowerCase()) &&
      (sport.status || "")
        .toLowerCase()
        .includes((filters.apiKey || "").toLowerCase())
    );
  });

  return (
    <div className="bg-[#f5f5f5] min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">SPORTS LIST</h2>
        <button
          className="border border-green-400 text-green-700 px-6 py-2 rounded hover:bg-green-50 transition font-medium"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
      {/* Filters */}
      <div className="border border-green-200 rounded-md bg-white p-4 mb-4">
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className="border rounded px-3 py-2 w-full"
            name="name"
            placeholder="Filter by Name"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            className="border rounded px-3 py-2 w-full"
            name="apiSportId"
            placeholder="Filter by API Sport ID"
            value={filters.apiSportId}
            onChange={handleFilterChange}
          />
          <input
            className="border rounded px-3 py-2 w-full"
            name="scoreboardBgColor"
            placeholder="Filter by BG Color"
            value={filters.scoreboardBgColor}
            onChange={handleFilterChange}
          />
          <input
            className="border rounded px-3 py-2 w-full"
            name="apiKey"
            placeholder="Filter by API Key"
            value={filters.apiKey}
            onChange={handleFilterChange}
          />
        </form>
      </div>
      <div className="border border-green-400 rounded-md bg-white p-6 overflow-x-auto">
        <DataTable columns={columns} data={filteredSports} />
        {filteredSports.length === 0 && (
          <div className="text-center text-gray-500 py-8">No sports found.</div>
        )}
      </div>
    </div>
  );
};

export default SportsListPage;
