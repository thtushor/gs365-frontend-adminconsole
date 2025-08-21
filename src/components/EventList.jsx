import React, { useState } from "react";
import CreateBanner from "./CreateBanner";
import { useGetRequest } from "../Utils/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { FaRegEdit } from "react-icons/fa";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import CreateEvent from "./CreateEvent";

const EventList = () => {
  const queryClient = useQueryClient();

  const getRequest = useGetRequest();

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    title: "",
    status: "",
  });

  const [bannerToEdit, setBannerToEdit] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", filters],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_EVENT,
        params: filters,
        errorMessage: "Failed to fetch events list",
      }),
    keepPreviousData: true,
  });

  const events = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = Math.ceil(total / filters.pageSize) || 1;

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

  const handleEditClick = (event) => {
    setBannerToEdit(event);
    const scrollableDiv = document.getElementById("layout-scroll");
    scrollableDiv?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["events"] });
    setBannerToEdit(null);
  };
  const handleCancelEdit = () => {
    setBannerToEdit(null);
  };

  const columns = [
    {
      field: "sl",
      headerName: "SL",
      width: 60,
      render: (_, __, index) =>
        (filters.page - 1) * filters.pageSize + index + 1,
    },
    {
      field: "images",
      headerName: "Event Poster",
      width: 200,
      render: (images) => {
        return (
          <div className="flex flex-wrap gap-1">
            <img
              src={images?.original || ""}
              className="w-10 h-7 object-cover rounded"
            />
          </div>
        );
      },
    },
    {
      field: "title",
      headerName: "Event Name",
      width: 200,
    },
    {
      field: "sportName",
      headerName: "Sport Name",
      width: 200,
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
      align: "center",
      render: (value) => (
        <span
          className={`px-2 py-1 text-center pb-[5px] font-semibold block rounded-full capitalize text-xs ${
            value === "active" ? "text-green-600" : "text-red-500"
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
      align: "center",
      render: (_, row) => (
        <button
          onClick={() => handleEditClick(row)}
          className="text-blue-600 hover:text-blue-800 cursor-pointer w-full flex items-center justify-center"
        >
          <FaRegEdit size={22} />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full p-5 bg-white rounded-xl border border-green-300">
      <CreateEvent
        handleCancelEdit={handleCancelEdit}
        bannerToEdit={bannerToEdit}
        onSuccess={handleSuccess}
      />

      <div className="mt-5 border border-gray-300 p-5 rounded-lg">
        <h2 className="text-[20px] font-semibold mb-4 text-left">
          Events List
        </h2>

        {/* Table */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading events...</div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Failed to load events: {error?.message || "Unknown error"}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-500">No events found.</div>
        ) : (
          <div className="">
            <DataTable columns={columns} data={events} />
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              pageSize={filters.pageSize}
              pageSizeOptions={[10, 20, 50, 100]}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
