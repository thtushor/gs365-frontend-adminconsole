import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL, API_LIST } from "../api/ApiList";
import { useGetRequest, useUpdateRequest } from "../Utils/apiClient";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import ExpandableDataTable from "./ExpandableDataTable";
import { MdToggleOff, MdToggleOn } from "react-icons/md";
import BaseModal from "./shared/BaseModal";
import StatusChangePopup from "./inner_component/StatusChangePopup";

const DropdownList = () => {
  const getRequest = useGetRequest();
  const updateDropdownStatus = useUpdateRequest();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    name: "",
    status: "",
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dropdowns", filters],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_DROPDOWN,
        params: filters,
        errorMessage: "Failed to fetch dropdown list",
      }),
    keepPreviousData: true,
  });

  const dropdowns = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = Math.ceil(total / filters.pageSize) || 1;

  const columns = [
    {
      field: "dropdown_id",
      headerName: "ID",
      width: 80,
      render: (_, row) => row.dropdown_id,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      render: (_, row) => row.name,
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 180,
      render: (_, row) =>
        row.created_at ? new Date(row.created_at).toLocaleString() : "N/A",
    },
    {
      field: "total_options",
      headerName: "Total Options",
      width: 150,
      render: (_, row) => (
        <span className="bg-green-500 text-white font-bold px-3 py-[2px] inline-block rounded-full">
          {Array.isArray(row.options) ? row.options.length : 0} Options
        </span>
      ),
    },
  ];

  // status change function
  const [children, setChildren] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleChangeStatus = async (data) => {
    const newStatus = data.status === "active" ? "inactive" : "active";

    try {
      const response = await updateDropdownStatus({
        url: `${BASE_URL + API_LIST.UPDATE_DROPDOWN_OPTION}/${data.id}`,
        body: { status: newStatus },
      });

      // Refresh dropdowns
      await queryClient.invalidateQueries({ queryKey: ["dropdowns"] });

      // Close modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleStatusToggle = (row) => {
    console.log(row);
    setIsModalOpen(true);
    setChildren(
      <StatusChangePopup
        row={row}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleChangeStatus}
      />
    );
  };

  const subTableConfig = {
    field: "options",
    columns: [
      {
        field: "index",
        headerName: "SL",
        render: (_, __, index) => index + 1,
      },
      {
        field: "title",
        headerName: "Title",
      },
      {
        field: "status",
        headerName: "Status",
        render: (value, row) => (
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent row toggle
              handleStatusToggle(row);
            }}
            className="cursor-pointer"
          >
            {value === "active" ? (
              <MdToggleOn className="text-green-500" size={33} />
            ) : (
              <MdToggleOff className="text-red-500" size={33} />
            )}
          </button>
        ),
      },
      {
        field: "created_by",
        headerName: "Created By",
      },
      {
        field: "created_at",
        headerName: "Created At",
        render: (value) => new Date(value).toLocaleString(),
      },
    ],
    expandableCheck: (row) =>
      Array.isArray(row.options) && row.options.length > 0,
  };

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
    <div className="bg-white rounded-lg overflow-auto max-w-full shadow p-4 mt-6 min-h-[200px] flex flex-col justify-center items-center">
      <div className="text-left mb-4 w-full">
        <h2 className="text-lg font-semibold text-left">Dropdown List</h2>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center mb-4 w-full">
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
          Loading dropdowns...
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">
          Failed to load dropdowns: {error?.message || "Unknown error"}
        </div>
      ) : dropdowns.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No dropdowns found.
        </div>
      ) : (
        <>
          <ExpandableDataTable
            columns={columns}
            data={dropdowns}
            subTableConfig={subTableConfig}
          />
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

      <BaseModal
        children={children}
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
      />
    </div>
  );
};

export default DropdownList;
