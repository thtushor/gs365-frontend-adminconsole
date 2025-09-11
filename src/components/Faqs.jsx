import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import { useGetRequest } from "../Utils/apiClient";
import { API_LIST, BASE_URL } from "../api/ApiList";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import BaseModal from "./shared/BaseModal";
import DeleteConfirmationPopup from "./inner_component/DeleteConfirmationPopup";
import { MdDeleteOutline } from "react-icons/md";
import CreateFaq from "./CreateFaq";

const Faqs = () => {
  const queryClient = useQueryClient();
  const getRequest = useGetRequest();

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    title: "",
    status: "",
  });

  const [faqToEdit, setFaqToEdit] = useState(null);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["faqs", filters],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_FAQS,
        params: filters,
        errorMessage: "Failed to fetch faqs list",
      }),
    keepPreviousData: true,
  });

  const faqs = data?.data || [];
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
    setFaqToEdit(announcement);
    const scrollableDiv = document.getElementById("layout-scroll");
    scrollableDiv?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["faqs"] });
    setFaqToEdit(null);
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
      field: "category",
      headerName: "Category",
      width: 200,
      render: (value) => (
        <span
          className={`px-2 py-1 font-bold rounded-full text-xs capitalize `}
        >
          {value}
        </span>
      ),
    },
    {
      field: "title",
      headerName: "Question",
      width: 200,
    },
    {
      field: "message",
      headerName: "Answer",
      width: 250,
      render: (value) =>
        typeof value === "string" && value ? (
          <span
            title={value || "message"}
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
      width: 100,
      render: (value) => (
        <span
          className={`px-2 py-1 font-semibold rounded-full text-xs capitalize ${
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
          <button
            onClick={() => handleEditClick(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaRegEdit size={18} />
          </button>
          <button
            onClick={() => {
              setFaqToDelete(row);
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
      <CreateFaq
        onSuccess={handleSuccess}
        onCancel={() => setFaqToEdit(null)}
        faqToEdit={faqToEdit}
      />

      <div className="mt-6 border border-gray-300 p-5 rounded-lg">
        <h2 className="text-[20px] font-semibold mb-4 text-left">
          Frequently Asked Questions ({"FAQ'S"})
        </h2>

        {isLoading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : isError ? (
          <p className="text-red-500 text-center">{error?.message}</p>
        ) : faqs.length === 0 ? (
          <p className="text-center text-gray-500">No faqs found.</p>
        ) : (
          <>
            <DataTable columns={columns} data={faqs} />
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
        {faqToDelete && (
          <DeleteConfirmationPopup
            apiUrl={`${BASE_URL}${API_LIST.DELETE_FAQS}/${faqToDelete.id}`}
            payload={{}} // optional
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["faqs"] });
              setIsModalOpen(false);
              setFaqToDelete(null);
            }}
            onCancel={() => {
              setIsModalOpen(false);
              setFaqToDelete(null);
            }}
            message={`Are you sure you want to delete the faqs "${faqToDelete.title}"?`}
          />
        )}
      </BaseModal>
    </div>
  );
};

export default Faqs;
