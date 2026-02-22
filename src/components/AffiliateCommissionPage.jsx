import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import Pagination from "./Pagination";
import { FaTrash, FaEdit, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CreateAgentForm } from "./shared/CreateAgentForm";
import { formatDateTime } from "../Utils/dateUtils";
import { useUsers } from "../hooks/useBetResults";
import { useAffiliates } from "../hooks/useAffiliates";
import { useAuth } from "../hooks/useAuth";
import { hasPermission } from "../Utils/permissions";
import { staticAffiliatePermission } from "../Utils/staticAffiliatePermission";
import { useDetailedAffiliateStats } from "../hooks/useDetailedAffiliateStats";
import { HighlightBox } from "./shared/HighlightBox";
import { Spin } from "antd";

const defaultFilters = {
  search: "",
  adminUserId: "",
  playerId: "",
  page: 1,
  pageSize: 20,
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
  const { affiliateId } = useParams();
  const { user } = useAuth();
  const permissions = user?.designation?.permissions || [];
  // Check if the user has the specific permission to view affiliate commissions.
  // The staticAffiliatePermission function checks roles first, then permissions.
  const canViewAffiliateCommissions = staticAffiliatePermission(user.role, permissions, "affiliate_view_affiliate_commissions");

  // Fetch users and affiliates for filters
  const { data: usersData } = useUsers();
  const { data: affiliatesData } = useAffiliates();

  const users = usersData?.users?.data || [];
  const affiliates = affiliatesData?.data || [];

  // Check if the user has the permission to link to affiliate details.
  // Using the same permission key for now as no other specific key was provided for this context.
  const canLinkToAffiliateDetails = staticAffiliatePermission(user.role, permissions, "affiliate_view_affiliate_commissions");

  // Set adminUserId from affiliateId parameter if available
  useEffect(() => {
    if (affiliateId) {
      setFilters((prev) => ({
        ...prev,
        adminUserId: affiliateId,
      }));
    }
  }, [affiliateId]);

  const { data: detailedStats, isLoading: statsLoading } = useDetailedAffiliateStats(affiliateId);

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

      const res = await Axios.get(API_LIST.AFFILIATE_COMMISSION_LIST, {
        params,
      });
      if (!res.data.status)
        throw new Error("Failed to fetch affiliate commissions");
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
      render: (_, row) =>
        canLinkToAffiliateDetails ? (
          <div>
            <Link
              to={`/affiliate-list/${row?.adminUser?.id}`}
              className="text-green-500 cursor-pointer font-semibold"
            >
              {row?.adminUser?.username}
            </Link>
            <p className="text-sm text-gray-600">{row?.adminUser?.fullname}</p>
            <p className="text-xs text-gray-500">
              Role:{" "}
              {row?.adminUser?.role === "affiliate"
                ? "Sub Affiliate"
                : row?.adminUser?.role === "superAffiliate"
                  ? "Super Affiliate"
                  : row?.adminUser?.role}
            </p>
          </div>
        ) : (
          <div>
            <span className="text-black cursor-default font-semibold">
              {row?.adminUser?.username}
            </span>
            <p className="text-sm text-gray-600">{row?.adminUser?.fullname}</p>
            <p className="text-xs text-gray-500">
              Role:{" "}
              {row?.adminUser?.role === "affiliate"
                ? "Sub Affiliate"
                : row?.adminUser?.role === "superAffiliate"
                  ? "Super Affiliate"
                  : row?.adminUser?.role}
            </p>
          </div>
        ),
    },
    {
      field: "player",
      headerName: "Player",
      width: 180,
      render: (_, row) =>
        canLinkToAffiliateDetails ? (
          <div>
            <Link
              to={`/players/${row?.user?.id}/profile`}
              className="text-green-500 cursor-pointer font-semibold"
            >
              {row?.user?.username}
            </Link>
            <p className="text-sm text-gray-600">{row?.user?.fullname}</p>
            <Link
              to={`/affiliate-list/${row?.referredUser?.id}`}
              className="text-green-500 cursor-pointer font-semibold"
            >
              {row?.referredUser?.fullname}
            </Link>
          </div>
        ) : (
          <div>
            <span className="text-black cursor-default font-semibold">
              {row?.user?.username}
            </span>
            <p className="text-sm text-gray-600">{row?.user?.fullname}</p>
            <span className="text-black cursor-default font-semibold">
              {row?.referredUser?.fullname}
            </span>
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
            <span
              className={`ml-1 px-2 py-1 text-xs rounded-full ${row?.betResults?.betStatus === "win"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
                }`}
            >
              {row?.betResults?.betStatus}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-semibold">Amount:</span>{" "}
            {row?.betResults?.betAmount}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Result:</span>{" "}
            {row?.betResults?.betStatus === "win"
              ? row?.betResults?.winAmount
              : row?.betResults?.lossAmount}
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
            <span
              className={`ml-1 ${parseFloat(row?.commissionAmount) >= 0
                ? "text-green-600"
                : "text-red-600"
                }`}
            >
              {row?.commissionAmount}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-semibold">Percentage:</span> {row?.percentage}
            %
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
          className={`px-2 py-1 text-center pb-[5px] font-semibold block rounded-full capitalize text-xs ${row.status === "approved"
            ? "bg-green-100 text-green-800"
            : row.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : row.status === "settled"
                ? "bg-gray-300 text-gray-700"
                : "bg-red-100 text-red-800"
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
    },
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

  const handleReset = () => {
    const resetFilters = { ...defaultFilters };
    // Preserve affiliateId if it exists in URL
    if (affiliateId) {
      resetFilters.adminUserId = affiliateId;
    }
    setFilters(resetFilters);
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

      {affiliateId && (
        <div className="flex gap-4 flex-wrap mb-6">
          {statsLoading ? (
            <div className="w-full flex justify-center py-4">
              <Spin />
            </div>
          ) : (
            <>
              {/* Lifetime Stats */}
              <HighlightBox
                label="Total Profit"
                value={detailedStats?.totalProfit?.toFixed(2)}
                color="bg-blue-600 text-white border-blue-600"
              />
              <HighlightBox
                label="Total Loss"
                value={detailedStats?.totalLoss?.toFixed(2)}
                color="bg-red-600 text-white border-red-600"
              />
              <HighlightBox
                label="Total Commission"
                value={detailedStats?.totalCommission?.toFixed(2)}
                tooltipTitle="(Total Profit - Total Loss) = Total Commission"
                color="bg-blue-500 text-white border-blue-500"
              />

              {/* Settled Stats */}
              <HighlightBox
                label="Settled Profit"
                value={detailedStats?.settledProfit?.toFixed(2)}
                color="bg-blue-300 text-white border-blue-300"
              />
              <HighlightBox
                label="Settled Loss"
                value={detailedStats?.settledLoss?.toFixed(2)}
                color="bg-red-300 text-white border-red-300"
              />
              <HighlightBox
                label="Total Settled Commission"
                value={detailedStats?.settledCommission?.toFixed(2)}
                tooltipTitle="(Settled Profit - Settled Loss) = Total Settled Commission"
                color="bg-blue-400 text-white border-blue-400"
              />
            </>
          )}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-blue-500" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="search"
              placeholder="Ex. username, email, phone etc."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {!affiliateId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Affiliate
              </label>

              <select
                name="adminUserId"
                value={filters.adminUserId}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!!affiliateId}
              >
                <option value="">All Affiliates</option>
                {affiliates.map((affiliate) => (
                  <option key={affiliate.id} value={affiliate.id}>
                    {affiliate.fullname || affiliate.username} (
                    {affiliate.role === "affiliate"
                      ? "Sub Affiliate"
                      : affiliate.role === "superAffiliate"
                        ? "Super Affiliate"
                        : affiliate.role}
                    )
                  </option>
                ))}
              </select>
            </div>
          )}

          {canLinkToAffiliateDetails && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Player
              </label>
              <select
                name="playerId"
                value={filters.playerId}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Players</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullname || user.username}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-auto max-w-full shadow p-4 min-h-[200px] flex flex-col justify-center items-center">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">
            Loading commission records...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-8">
            Failed to load commission records:{" "}
            {error?.message || "Unknown error"}
          </div>
        ) : commissions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No commission records found.
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={commissions}
              isSuperAdmin={canViewAffiliateCommissions}
              permissions={permissions}
              exportPermission="affiliate_view_affiliate_commissions"
            />
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
          <p>
            Edit functionality for commission records will be implemented here.
          </p>
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
