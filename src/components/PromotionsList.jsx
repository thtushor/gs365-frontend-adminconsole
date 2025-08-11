import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL, API_LIST } from "../api/ApiList";
import { useGetRequest } from "../Utils/apiClient";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";

const PromotionsList = () => {
  const navigate = useNavigate();
  const getRequest = useGetRequest();

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    name: "",
    status: "",
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["promotions", filters],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_PROMOTION,
        params: filters,
        errorMessage: "Failed to fetch promotions list",
      }),
    keepPreviousData: true,
  });

  const promotions = data?.data || [];
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
      field: "bannerImg",
      headerName: "Banner",
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
      field: "promotionName",
      headerName: "Name",
      width: 180,
      render: (_, row) => row.promotionName,
    },
    {
      field: "promotionType",
      headerName: "Promotion Type",
      width: 150,
      render: (_, row) =>
        row.promotionType?.data?.length > 0
          ? row?.promotionType?.data?.map((p) => (
              <span key={p?.id}>{p?.title || "N/A"}</span>
            ))
          : "N/A",
    },
    {
      field: "dateRange",
      headerName: "Date Range",
      width: 170,
    },
    {
      field: "minimumDepositAmount",
      headerName: "Min. Deposit",
      width: 120,
    },
    {
      field: "maximumDepositAmount",
      headerName: "Max. Deposit",
      width: 120,
    },
    {
      field: "turnoverMultiply",
      headerName: "T. Multiply",
      width: 110,
    },
    {
      field: "bonus",
      headerName: "Bonus",
      width: 80,
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      render: (value) =>
        typeof value === "string" ? (
          <span
            dangerouslySetInnerHTML={{
              __html: value.length > 50 ? `${value.slice(0, 50)}...` : value,
            }}
          />
        ) : (
          "N/A"
        ),
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 120,
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
          onClick={() => navigate(`/create-promotion?promotionId=${row.id}`)}
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
    <div className="bg-white rounded-lg shadow p-4 mt-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Promotion List</h2>
        <button
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
          onClick={() => navigate("/create-promotion")}
        >
          Create Promotion
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
          Loading promotions...
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">
          Failed to load promotions: {error?.message || "Unknown error"}
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No promotions found.
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={promotions} />
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

export default PromotionsList;
