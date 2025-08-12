import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { useGetRequest } from "../../Utils/apiClient";
import { API_LIST, BASE_URL } from "../../api/ApiList";
import DataTable from "../DataTable";
import Pagination from "../Pagination";
import { toast } from "react-toastify";

const GameList = ({ providerId }) => {
  const navigate = useNavigate();
  const getRequest = useGetRequest();

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    name: "",
    status: "",
    providerId: providerId,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["games", filters],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_GAMES,
        params: filters,
        errorMessage: "Failed to fetch games list",
      }),
    keepPreviousData: true,
  });

  const games = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = Math.ceil(total / filters.pageSize) || 1;

  const columns = [
    {
      field: "sl",
      headerName: "SL",
      width: 60,
      render: (_, __, index) =>
        (filters.page - 1) * filters.pageSize + index + 1,
    },
    {
      field: "gameLogo",
      headerName: "Game Thumbnail",
      width: 120,
      render: (value) => {
        const imageUrl = value?.replace(/^"+|"+$/g, ""); // Remove extra quotes
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Banner"
            className="w-20 h-10 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400">N/A</span>
        );
      },
    },
    {
      field: "name",
      headerName: "Game Name",
      width: 120,
    },
    {
      field: "gameUrl",
      headerName: "Game Url",
      width: 80,
      render: (_, row) =>
        row.gameUrl ? (
          <button
            onClick={() => {
              navigator.clipboard
                .writeText(row.gameUrl)
                .then(() => toast.success("Game URL copied!"))
                .catch((err) => console.log(err));
            }}
            className="text-blue-500 text-sm bg-blue-100 border border-blue-500 hover:border-blue-700 hover:text-blue-700 font-medium px-3 cursor-pointer pb-[2px] rounded-full"
          >
            Copy Game URL
          </button>
        ) : (
          "N/A"
        ),
    },
    {
      field: "providerName",
      headerName: "Provider Name",
      width: 180,
      render: (_, row) =>
        row.providerInfo?.id ? (
          <Link
            to={`/game-provider-list/${row.providerInfo?.id}`}
            className="text-green-500 cursor-pointer font-semibold"
          >
            {row.providerInfo?.name}
          </Link>
        ) : (
          "N/A"
        ),
    },
    {
      field: "providerKey",
      headerName: "Provider License Key",
      width: 80,
      render: (_, row) => row.providerInfo?.licenseKey || "N/A",
    },
    {
      field: "categoryName",
      headerName: "Category Name",
      width: 150,
      render: (_, row) => row?.categoryInfo?.name || "N/A",
    },
    {
      field: "apiKey",
      headerName: "Game Api Key",
      width: 120,
    },
    {
      field: "licenseKey",
      headerName: "Game License Key",
      width: 110,
    },
    {
      field: "secretPin",
      headerName: "Game Secret Pin",
      width: 80,
    },
    {
      field: "ggrPercent",
      headerName: "GGR%",
      width: 80,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      render: (value) => (
        <span
          className={`py-[2px] pb-[4px] rounded-full px-4 capitalize block text-xs font-medium ${
            value === "active"
              ? "text-green-500 bg-green-100 text-center border border-green-500"
              : "text-red-500   bg-red-100 text-center border border-red-500"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      field: "isFavorite",
      headerName: "Is Favorite",
      width: 150,
      render: (value) => (
        <span
          className={`py-[2px] pb-[4px] rounded-full px-4 capitalize block text-xs font-medium ${
            value
              ? "text-green-500 bg-green-100 text-center border border-green-500"
              : "text-red-500   bg-red-100 text-center border border-red-500"
          }`}
        >
          {value ? "Favorite" : "Not Favorite"}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      render: (_, row) => (
        <button
          onClick={() => navigate(`/add-game?gameId=${row.id}`)}
          className="text-blue-600 hover:text-blue-800 cursor-pointer w-full flex items-center justify-center"
        >
          <FaRegEdit size={22} />
        </button>
      ),
    },
  ];

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  return (
    <div
      className={`${
        !providerId ? "bg-white rounded-lg shadow p-4 mt-6 w-full" : "w-full"
      }`}
    >
      {!providerId && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Game List</h2>
          <button
            className="bg-green-500 text-white cursor-pointer px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
            onClick={() => navigate("/add-game")}
          >
            Create Game
          </button>
        </div>
      )}
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <input
          type="text"
          name="name"
          placeholder="Search by Name"
          value={filters.name}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded text-sm w-48 focus:ring-2 focus:ring-green-200"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded text-sm w-48 focus:ring-2 focus:ring-green-200"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center text-gray-500 py-8">Loading games...</div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">
          Failed to load games: {error?.message || "Unknown error"}
        </div>
      ) : games.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No games found.</div>
      ) : (
        <>
          <DataTable columns={columns} data={games} />
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            pageSize={filters.pageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </div>
  );
};

export default GameList;
