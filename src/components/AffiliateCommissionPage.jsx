import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import Pagination from "./Pagination";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { CreateAgentForm } from "./shared/CreateAgentForm";
import { formatDateTime } from "../Utils/dateUtils";

const defaultFilters = {
  search: "",
  adminUserId: "",
  playerId: "",
  page: 1,
  pageSize: 10,
};

const AffiliateCommissionListPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAgent, setEditAgent] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [API_LIST.AFFILIATE_COMMISSION_LIST, filters],
    queryFn: async () => {
      const params = {
        search: filters.search,
        page: filters.page,
        pageSize: filters.pageSize,
      };
      
      if (filters.adminUserId) {
        params.adminUserId = Number(filters.adminUserId);
      }
      
      if (filters.playerId) {
        params.playerId = Number(filters.playerId);
      }
      
      const res = await Axios.get(API_LIST.AFFILIATE_COMMISSION_LIST, { params });
      if (!res.data.status) throw new Error("Failed to fetch affiliate commissions");
      return res.data;
    },
    keepPreviousData: true,
  });

  const commissions = data?.data || [];
  const pagination = data?.pagination || {};
  const total = pagination.total || 0;
  const pageSize = filters.pageSize;
  const currentPage = filters.page;
  const totalPages = pagination.totalPages || Math.ceil(total / pageSize) || 1;

  const columns = [
    {
      field: "sl",
      headerName: "SL",
      width: 60,
      render: (_, __, index) =>
        (filters.page - 1) * filters.pageSize + index + 1,
    },
    {
      field: "affiliate",
      headerName: "Affiliate",
      width: 200,
      render: (_, row) => (
        <div>
          <Link
            to={`/affiliate-list/${row?.adminUser?.id}`}
            className="text-green-500 cursor-pointer font-semibold"
          >
            {row?.adminUser?.username}
          </Link>
          <p className="text-sm text-gray-600">
            {row?.adminUser?.fullname}
          </p>
          <p className="text-xs text-gray-500">
            Role: {row?.adminUser?.role === "affiliate" ? "Sub Affiliate" : row?.adminUser?.role === "superAffiliate" ? "Super Affiliate" : row?.adminUser?.role}
          </p>
        </div>
      ),
    },
    {
      field: "player",
      headerName: "Player",
      width: 180,
      render: (_, row) => (
        <div>
          <Link
            to={`/players/${row?.user?.id}/profile`}
            className="text-green-500 cursor-pointer font-semibold"
          >
            {row?.user?.username}
          </Link>
          <p className="text-sm text-gray-600">
            {row?.user?.fullname}
          </p>
        </div>
      ),
    },
    {
      field: "bet",
      headerName: "Bet Details",
      width: 200,
      render: (_, row) => (
        <div>
          <p className="text-sm">
            <span className="font-semibold">ID:</span> {row?.betResults?.id}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Status:</span> 
            <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
              row?.betResults?.betStatus === "win" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {row?.betResults?.betStatus}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-semibold">Amount:</span> {row?.betResults?.betAmount}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Result:</span> {row?.betResults?.betStatus === "win" ? row?.betResults?.winAmount : row?.betResults?.lossAmount}
          </p>
        </div>
      ),
    },
    {
      field: "commission",
      headerName: "Commission",
      width: 150,
      render: (_, row) => (
        <div>
          <p className="text-sm">
            <span className="font-semibold">Amount:</span> 
            <span className={`ml-1 ${parseFloat(row?.commissionAmount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {row?.commissionAmount}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-semibold">Percentage:</span> {row?.percentage}%
          </p>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      align: "center",
      render: (_, row) => (
        <span
          className={`px-2 py-1 text-center pb-[5px] font-semibold block rounded-full capitalize text-xs ${
            row.status === "approved" ? "bg-green-100 text-green-800" : 
            row.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
            "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 120,
      render: (_, row) => row.createdBy || "System",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 160,
      render: (_, row) => formatDateTime(row.createdAt),
    }
  ];

  const handleEdit = (row) => {
    console.log(row);
    setEditAgent(row);
    setEditModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size) => {
    setFilters((prev) => ({ ...prev, pageSize: size, page: 1 }));
  };

  function handleDelete() {
    if (selectedAgent) {
      // Implement delete functionality
      toast.success("Commission record deleted successfully!");
      setDeleteModalOpen(false);
      setSelectedAgent(null);
    }
  }

  return (
    <div className="bg-[#f5f5f5] w-full min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Affiliate Commission List</h2>
      </div>
      
      {/* Filter Bar */}
      <form className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          value={filters.search}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <input
          type="number"
          name="adminUserId"
          placeholder="Affiliate ID"
          value={filters.adminUserId}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <input
          type="number"
          name="playerId"
          placeholder="Player ID"
          value={filters.playerId}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
      </form>
      
      <div className="bg-white rounded-lg overflow-auto max-w-full shadow p-4 min-h-[200px] flex flex-col justify-center items-center">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">
            Loading commission records...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-8">
            Failed to load commission records: {error?.message || "Unknown error"}
          </div>
        ) : commissions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No commission records found.
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={commissions} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 50, 100]}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
      
      {/* Edit Modal */}
      <ReusableModal
        open={editModalOpen}
        className={"min-w-[80vw] min-h-[60vh] overflow-auto"}
        onClose={() => setEditModalOpen(false)}
        title="Edit Commission Record"
      >
        <div className="p-4">
          <p>Edit functionality for commission records will be implemented here.</p>
        </div>
      </ReusableModal>
      
      {/* Delete Modal */}
      <ReusableModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Commission Record"
        onSave={handleDelete}
      >
        <div>
          <p>
            Are you sure you want to <b>delete</b> this commission record?
          </p>
          <p className="text-xs text-red-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
      </ReusableModal>
    </div>
  );
};

export default AffiliateCommissionListPage;
