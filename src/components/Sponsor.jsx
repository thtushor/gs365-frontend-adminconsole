import React, { useState } from "react";
import { useGetRequest } from "../Utils/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { FaRegEdit } from "react-icons/fa";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import BaseModal from "./shared/BaseModal";
import DeleteConfirmationPopup from "./inner_component/DeleteConfirmationPopup";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import CreateSponsor from "./CreateSponsor";

const Sponsor = () => {
  const queryClient = useQueryClient();
  const getRequest = useGetRequest();

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    title: "",
    status: "",
  });

  const [sponsorToEdit, setSponsorToEdit] = useState(null);
  const [sponsorToDelete, setSponsorToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sponsors", filters],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_SPONSOR,
        params: filters,
        errorMessage: "Failed to fetch sponsor list",
      }),
    keepPreviousData: true,
  });

  const sponsors = data?.data || [];
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
    setSponsorToEdit(announcement);
    const scrollableDiv = document.getElementById("layout-scroll");
    scrollableDiv?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["sponsors"] });
    setSponsorToEdit(null);
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
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "logo",
      headerName: "Logo",
      align: "center",
      width: 200,
      render: (value) => (
        <div>
          <img
            src={value}
            className="w-[150px] mx-auto max-w-[50px] max-h-[30px] border border-gray-200 object-cover rounded-md"
          />
        </div>
      ),
    },
    {
      field: "companyType",
      headerName: "Company Type",
      width: 200,
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 200,
      align: "center",
      render: (value) => (
        <span
          className={`px-2 pt-[2px] pb-[3px] text-center block font-semibold rounded-full text-xs capitalize text-green-600 bg-green-50 border-green-600 border `}
        >
          {value || "No Duration"}
        </span>
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
              setSponsorToDelete(row);
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
      <CreateSponsor
        sponsorToEdit={sponsorToEdit}
        onSuccess={handleSuccess}
        onCancel={() => setSponsorToEdit(null)}
      />

      <div className="mt-6 border border-gray-300 p-5 rounded-lg">
        <h2 className="text-[20px] font-semibold mb-4 text-left">
          Sponsor List
        </h2>

        {isLoading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : isError ? (
          <p className="text-red-500 text-center">{error?.message}</p>
        ) : sponsors.length === 0 ? (
          <p className="text-center text-gray-500">No sponsors found.</p>
        ) : (
          <>
            <DataTable columns={columns} data={sponsors} />
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
        {sponsorToDelete && (
          <DeleteConfirmationPopup
            apiUrl={`${BASE_URL}${API_LIST.DELETE_SPONSOR}/${sponsorToDelete.id}`}
            payload={{}} // optional
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["sponsors"] });
              setIsModalOpen(false);
              setSponsorToDelete(null);
            }}
            onCancel={() => {
              setIsModalOpen(false);
              setSponsorToDelete(null);
            }}
            message={`Are you sure you want to delete the sponsor "${sponsorToDelete.title}"?`}
          />
        )}
      </BaseModal>
    </div>
  );
};

export default Sponsor;
