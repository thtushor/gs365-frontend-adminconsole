import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdEdit } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { TbBrandTelegram } from "react-icons/tb";
import { useGetRequest } from "../../Utils/apiClient";
import { API_LIST, BASE_URL } from "../../api/ApiList";
import DataTable from "../DataTable";
import Pagination from "../Pagination";
import { useAuth } from "../../hooks/useAuth";

const ChildProviderList = () => {
  const { gameProviderId } = useParams();
  const navigate = useNavigate();
  const getRequest = useGetRequest();

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    name: "",
    status: "",
    parentId: gameProviderId,
  });

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
      render: (_, row) => (
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

  const { gameProviderInfo } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Game Sub Provider List of{" "}
          <span className="text-green-500">{gameProviderInfo?.name}</span>
        </h2>
        <button
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
          onClick={() =>
            navigate(`/add-game-provider?ref_parent_id=${gameProviderInfo?.id}`)
          }
        >
          + Add Sub Provider
        </button>
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
          No game sub providers found.
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

export default ChildProviderList;
