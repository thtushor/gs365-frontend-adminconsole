import React, { useState } from "react";
import { useGetRequest } from "../Utils/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { FaRegEdit } from "react-icons/fa";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import CreateAnnouncement from "./CreateAnnouncement";
import BaseModal from "./shared/BaseModal";
import DeleteConfirmationPopup from "./inner_component/DeleteConfirmationPopup";
import { MdDeleteOutline } from "react-icons/md";
import CreateAdvertisement from "./CreateAdvertisement";
import { Link } from "react-router-dom";

const Advertisement = () => {
  const queryClient = useQueryClient();
  const getRequest = useGetRequest();

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    title: "",
    status: "",
  });

  const [advertisementToEdit, setAnnouncementToEdit] = useState(null);
  const [advertisementToDelete, setAdvertisementToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["advertisements", filters],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_ADVERTISEMENT,
        params: filters,
        errorMessage: "Failed to fetch advertisement list",
      }),
    keepPreviousData: true,
  });

  const advertisements = data?.data || [];
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

  const handleEditClick = (announcement) => {
    setAnnouncementToEdit(announcement);
    const scrollableDiv = document.getElementById("layout-scroll");
    scrollableDiv?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["advertisements"] });
    setAnnouncementToEdit(null);
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
      field: "title",
      headerName: "Title",
      width: 200,
    },
    {
      field: "videoUrl",
      headerName: "Video URL",
      align: "center",
      width: 200,
      render: (value) => (
        <Link
          to={value}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-300 hover:bg-green-400 w-fit mx-auto font-medium px-2 rounded-full pb-[2px] text-[13px]"
          onClick={(e) => e.stopPropagation()}
        >
          Watch Now
        </Link>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      render: (value) =>
        typeof value === "string" && value ? (
          <span
            title={value || "description"}
            dangerouslySetInnerHTML={{
              __html: value.length > 50 ? `${value.slice(0, 50)}...` : value,
            }}
          />
        ) : (
          <span className="opacity-50 select-none pointer-events-none">
            N/A
          </span>
        ),
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
      align: "center",
      width: 100,
      render: (value) => (
        <span
          className={`px-2 pt-[2px] pb-[3px] text-center block font-semibold rounded-full text-xs capitalize ${
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
      width: 100,
      render: (_, row) => (
        <div className="flex gap-3 items-center">
          <div
            onClick={() => handleEditClick(row)}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <FaRegEdit size={18} />
          </div>
          <button
            onClick={() => {
              setAdvertisementToDelete(row);
              setIsModalOpen(true);
            }}
            className="text-red-600 hover:text-red-800 cursor-pointer text-[20px]"
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-5 bg-white rounded-xl border border-green-300">
      <CreateAdvertisement
        advertisementToEdit={advertisementToEdit}
        onSuccess={handleSuccess}
        onCancel={() => setAnnouncementToEdit(null)}
      />

      <div className="mt-6 border border-gray-300 p-5 rounded-lg">
        <h2 className="text-[20px] font-semibold mb-4 text-left">
          Advertisement List
        </h2>

        {isLoading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : isError ? (
          <p className="text-red-500 text-center">{error?.message}</p>
        ) : advertisements.length === 0 ? (
          <p className="text-center text-gray-500">No advertisements found.</p>
        ) : (
          <>
            <DataTable columns={columns} data={advertisements} />
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              pageSize={filters.pageSize}
              pageSizeOptions={[10, 20, 50]}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
      <BaseModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {advertisementToDelete && (
          <DeleteConfirmationPopup
            apiUrl={`${BASE_URL}${API_LIST.DELETE_ADVERTISEMENT}/${advertisementToDelete.id}`}
            payload={{}} // optional
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["advertisements"] });
              setIsModalOpen(false);
              setAdvertisementToDelete(null);
            }}
            onCancel={() => {
              setIsModalOpen(false);
              setAdvertisementToDelete(null);
            }}
            message={`Are you sure you want to delete the advertisement "${advertisementToDelete.title}"?`}
          />
        )}
      </BaseModal>
    </div>
  );
};

export default Advertisement;
