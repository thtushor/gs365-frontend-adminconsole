import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL, API_LIST } from "../api/ApiList";
import { useGetRequest } from "../Utils/apiClient";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import { MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { TbBrandTelegram } from "react-icons/tb";
import { useAuth } from "../hooks/useAuth";
import { hasPermission } from "../Utils/permissions";

const initialFilters = {
  page: 1,
  pageSize: 20,
  name: "",
  status: "",
  parentId: "",
};

const GameProvidersList = () => {
  const navigate = useNavigate();
  const getRequest = useGetRequest();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";
  const userPermissions = user?.designation?.permissions || [];
  const canManageGameProviders =
    isSuperAdmin ||
    hasPermission(userPermissions, "game_manage_game_providers");
  const canViewGameProviderList =
    isSuperAdmin ||
    hasPermission(userPermissions, "game_view_game_provider_list");
  // const canViewSubGameProviderList = hasPermission(userPermissions, "game_view_sub_game_provider_list");
  // const canManageGameProviderProfile = hasPermission(userPermissions, "game_manage_game_provider_profile");
  // const canViewGameProviderDeposits = hasPermission(userPermissions, "game_view_game_provider_deposits");
  // const canViewGameProviderExpenses = hasPermission(userPermissions, "game_view_game_provider_expenses");
  // const canManageFeaturedGames = hasPermission(userPermissions, "game_manage_featured_games");

  const [filters, setFilters] = useState(initialFilters);
  const handleReset = () => {
    setFilters(initialFilters);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["game_providers", filters],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_GAME_PROVIDER,
        params: filters,
        errorMessage: "Failed to fetch promotions list",
      }),
    keepPreviousData: true,
  });

  // ✅ Fetch parentProviders
  const { data: parentProvider, isLoading: parentLoading } = useQuery({
    queryKey: ["game_providers", { publicList: true, isParent: true }],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_GAME_PROVIDER,
        params: { publicList: true, isParent: true },
        errorMessage: "Failed to fetch parent provider list",
      }),
    keepPreviousData: true,
  });
  const parentProviderList = parentProvider?.data || [];

  const game_providers = data?.data || [];
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
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
    },
    {
      field: "logo",
      headerName: "Provider Logo",
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
      headerName: "Provider Name",
      width: 180,
      render: (_, row) => (
        <Link
          to={`/game-provider-list/${row?.id}`}
          className="text-green-500 cursor-pointer font-semibold"
        >
          {row.name}
        </Link>
      ),
    },
    {
      field: "parentName",
      headerName: "Parent Provider Name",
      width: 180,
      render: (_, row) => row.parentName || "N/A",
    },
    {
      field: "providerIp",
      headerName: "Provider IP",
      width: 180,
      render: (_, row) => row.providerIp,
    },
    {
      field: "licenseKey",
      headerName: "License Key",
      width: 180,
      render: (_, row) => row.licenseKey,
    },
    // {
    //   field: "country",
    //   headerName: "Country",
    //   width: 180,
    //   render: (_, row) => row.country,
    // },
    {
      field: "promotionName",
      headerName: "Social Links",
      width: 180,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          {row.whatsapp && (
            <Link
              to={`https://wa.me/${row.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 bg-green-200 border-green-600 cursor-pointer border w-[25px] h-[25px] flex items-center justify-center rounded-full"
            >
              <BsWhatsapp />
            </Link>
          )}
          {row.telegram && (
            <Link
              to={`https://t.me/${row.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 bg-sky-200 border-sky-600 cursor-pointer border w-[25px] h-[25px] flex items-center justify-center rounded-full"
            >
              <TbBrandTelegram />
            </Link>
          )}
        </div>
      ),
    },
    {
      field: "isMenu",
      headerName: "Is Menu ?",
      width: 100,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full pb-1 capitalize block text-xs font-medium ${
            value ? "text-green-500" : "text-red-500"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full pb-1 capitalize block text-xs font-medium ${
            value === "active" ? "text-green-500" : "text-red-500"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      render: (_, row) =>
        canManageGameProviders && (
          <button
            onClick={() =>
              navigate(
                row?.parentId
                  ? `/add-game-provider?providerId=${row.id}`
                  : `/add-parent-game-provider?providerId=${row.id}`
              )
            }
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
  // Check if the user has permission to view the game provider list at all
  if (!canViewGameProviderList) {
    return (
      <div className="text-center text-red-500 py-8">
        You do not have permission to view game providers.
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Game Provider List</h2>
        {canManageGameProviders && (
          <button
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
            onClick={() => navigate("/add-parent-game-provider")}
          >
            + Parent Provider
          </button>
        )}
      </div>
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

        {/* Parent Provider Select */}
        {parentProviderList.length > 0 && (
          <div className={`flex flex-col `}>
            <select
              className="border px-3 py-2 rounded text-sm w-48 focus:ring-2 focus:ring-green-200"
              name="parentId"
              value={filters.parentId}
              onChange={handleFilterChange}
              required
            >
              <option value="">Select Parent Provider</option>
              {parentProviderList.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleReset}
          className="bg-gray-300 text-gray-700 px-4 font-medium cursor-pointer py-[9px] rounded hover:bg-gray-400 transition text-sm"
          type="button"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center text-gray-500 py-8">
          Loading game providers...
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">
          Failed to load game providers: {error?.message || "Unknown error"}
        </div>
      ) : game_providers.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No game providers found.
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={game_providers} />
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

export default GameProvidersList;
