import React, { useMemo, useState, useEffect } from "react";
import {
  useTransactions,
  useUpdateTransactionStatus,
} from "../hooks/useTransactions";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import ReusableModal from "./ReusableModal";
import { useNavigate, useParams } from "react-router-dom";
import { formatAmount } from "./BettingWagerPage";

const statusOptions = [
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

const defaultFilters = {
  page: 1,
  pageSize: 20,
  type: "",
  status: "",
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  userId: "",
  historyType: "user",
};

const TransactionsPage = ({
  playerId: propPlayerId,
  title = "Player Transactions",
}) => {
  const { playerId: paramPlayerId } = useParams();
  const playerId = propPlayerId || paramPlayerId;

  const [filters, setFilters] = useState({
    ...defaultFilters,
    userId: playerId || "",
  });
  const [selectedTx, setSelectedTx] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updatePayload, setUpdatePayload] = useState({ status: "", notes: "" });
  const navigate = useNavigate();

  // Update filters when playerId changes
  useEffect(() => {
    if (playerId) {
      setFilters((prev) => ({
        ...prev,
        userId: playerId,
        page: 1, // Reset to first page when player changes
      }));
    }
  }, [playerId]);

  const { data, isLoading } = useTransactions(filters);
  const updateMutation = useUpdateTransactionStatus();

  const items = data?.data || [];
  const pagination = data?.pagination || {};
  const total = pagination.total || 0;
  const page = filters.page;
  const pageSize = filters.pageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const formatDateTime = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    } catch (e) {
      return iso;
    }
  };

  const columns = useMemo(
    () => [
      { field: "sl", headerName: "#", width: 60, align: "center" },
      {
        field: "customTransactionId",
        headerName: "Transaction ID",
        width: 220,
      },
      {
        field: "userFullname",
        headerName: "User",
        width: 150,
        render: (value, row) => (
          <button
            onClick={() => navigate(`/players/${row.userId}/profile`)}
            className="text-green-500 hover:text-green-700 font-medium cursor-pointer hover:underline"
          >
            {value}
          </button>
        ),
      },
      { field: "type", headerName: "Type", width: 120 },
      {
        field: "amount",
        headerName: "Amount",
        width: 140,
        render: (value, row) => (
          <span className="font-medium">
            {value != null ? `${formatAmount(value)}` : "-"}
          </span>
        ),
      },
      {
        field: "givenTransactionId",
        headerName: "Given Trx. ID",
        width: 150,
        align: "center",
        render: (value) => (
          <span className="font-medium flex items-center justify-center">
            {value ? value : "——"}
          </span>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        render: (value) => (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              value === "approved"
                ? "bg-green-100 text-green-800"
                : value === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 200,
        render: (value) => formatDateTime(value),
      },
      {
        field: "processedAt",
        headerName: "Processed At",
        width: 200,
        render: (value) => formatDateTime(value),
      },
      {
        field: "action",
        headerName: "Action",
        width: 160,
        align: "center",
        render: (value, row) => (
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs"
              onClick={() => handleViewTransaction(row)}
            >
              View
            </button>
            {row.attachment && (
              <button
                className="px-3 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100 text-xs"
                onClick={() => {
                  window.open(row.attachment, "_blank");
                }}
              >
                Attachment
              </button>
            )}
            <button
              className="px-3 py-1 rounded bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs"
              onClick={() => handleOpenModal(row)}
            >
              Update
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  const handleOpenModal = (row) => {
    setSelectedTx(row);
    setUpdatePayload({
      status: row?.status || "pending",
      notes: row?.notes || "",
    });
    setModalOpen(true);
  };

  const handleViewTransaction = (row) => {
    setSelectedTx(row);
    setViewModalOpen(true);
  };

  const handleUpdate = async () => {
    await updateMutation.mutateAsync({
      id: selectedTx.id,
      status: updatePayload.status,
      notes: updatePayload.notes,
    });
    setModalOpen(false);
  };

  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {playerId && (
          <button
            onClick={() => navigate(`/players/${playerId}/profile`)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Back to Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder={
              playerId ? "Search by transaction ID" : "Search by id/user"
            }
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
            }
          />
          <select
            className="border rounded px-3 py-2"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))
            }
          >
            <option value="">All Status</option>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-3 py-2"
            value={filters.type}
            onChange={(e) =>
              setFilters((f) => ({ ...f, type: e.target.value, page: 1 }))
            }
          >
            <option value="">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
            <option value="transfer">Transfer</option>
          </select>
          {!playerId && (
            <input
              className="border rounded px-3 py-2"
              placeholder="User ID"
              value={filters.userId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, userId: e.target.value, page: 1 }))
              }
            />
          )}
          <div className="flex gap-2">
            <select
              className="border rounded px-3 py-2"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((f) => ({ ...f, sortBy: e.target.value, page: 1 }))
              }
            >
              <option value="createdAt">Created At</option>
              <option value="amount">Amount</option>
            </select>
            <select
              className="border rounded px-3 py-2"
              value={filters.sortOrder}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  sortOrder: e.target.value,
                  page: 1,
                }))
              }
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <DataTable columns={columns} data={items} isLoading={isLoading} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          onPageSizeChange={(ps) =>
            setFilters((f) => ({ ...f, pageSize: ps, page: 1 }))
          }
        />
      </div>

      {/* Transaction Details Modal */}
      <ReusableModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={`Transaction Details #${selectedTx?.id}`}
        onSave={null}
        size="lg"
        className="max-h-[80vh] !max-w-[80vw] overflow-y-auto"
      >
        {selectedTx && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedTx.givenTransactionId}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Transaction ID: {selectedTx.id}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTx.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : selectedTx.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedTx.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Transaction Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">
                        {selectedTx.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-lg text-green-600">
                        {selectedTx.amount} {selectedTx.currencySymbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currency:</span>
                      <span className="font-medium">
                        {selectedTx.currencyName} ({selectedTx.currencyCode})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {formatDateTime(selectedTx.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processed:</span>
                      <span className="font-medium">
                        {formatDateTime(selectedTx.processedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                {(selectedTx.accountNumber ||
                  selectedTx.bankName ||
                  selectedTx.walletAddress) && (
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Payment Information
                    </h4>
                    <div className="space-y-3">
                      {selectedTx.accountNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Number:</span>
                          <span className="font-medium">
                            {selectedTx.accountNumber}
                          </span>
                        </div>
                      )}
                      {selectedTx.accountHolderName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Holder:</span>
                          <span className="font-medium">
                            {selectedTx.accountHolderName}
                          </span>
                        </div>
                      )}
                      {selectedTx.bankName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bank:</span>
                          <span className="font-medium">
                            {selectedTx.bankName}
                          </span>
                        </div>
                      )}
                      {selectedTx.walletAddress && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wallet Address:</span>
                          <span className="font-medium text-xs break-all">
                            {selectedTx.walletAddress}
                          </span>
                        </div>
                      )}
                      {selectedTx.network && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Network:</span>
                          <span className="font-medium">
                            {selectedTx.network}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* User Information */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    User Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <button
                        onClick={() => {
                          setViewModalOpen(false);
                          navigate(`/players/${selectedTx.userId}/profile`);
                        }}
                        className="font-medium text-green-600 hover:text-green-800 hover:underline"
                      >
                        {selectedTx.userFullname}
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Username:</span>
                      <span className="font-medium">
                        @{selectedTx.userUsername}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">
                        {selectedTx.userEmail}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">
                        {selectedTx.userPhone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedTx.userStatus === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedTx.userStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verified:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedTx.userIsVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedTx.userIsVerified ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Game Information */}
                {selectedTx.gameName && (
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Game Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Game:</span>
                        <span className="font-medium">
                          {selectedTx.gameName}
                        </span>
                      </div>
                      {selectedTx.gameStatus && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Game Status:</span>
                          <span className="font-medium">
                            {selectedTx.gameStatus}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                {selectedTx.notes && (
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Notes
                    </h4>
                    <p className="text-gray-700 text-sm">{selectedTx.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Attachment Section */}
            {selectedTx.attachment && (
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Attachment
                </h4>
                <button
                  onClick={() => window.open(selectedTx.attachment, "_blank")}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  View Attachment
                </button>
              </div>
            )}
          </div>
        )}
      </ReusableModal>

      {/* Update Status Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Update Transaction #${selectedTx?.id}`}
        onSave={handleUpdate}
        isLoading={updateMutation.isPending}
        loadingText="Updating..."
      >
        <div className="space-y-3">
          <select
            className="w-full border rounded px-3 py-2"
            value={updatePayload.status}
            onChange={(e) =>
              setUpdatePayload((p) => ({ ...p, status: e.target.value }))
            }
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Notes"
            value={updatePayload.notes}
            onChange={(e) =>
              setUpdatePayload((p) => ({ ...p, notes: e.target.value }))
            }
          />
        </div>
      </ReusableModal>
    </div>
  );
};

export default TransactionsPage;
