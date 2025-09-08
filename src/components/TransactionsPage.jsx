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
import { useSettings } from "../hooks/useSettings";

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
  params = {},
}) => {
  const [conversionRate, setConversionRate] = useState(0);
  const {
    data: settingsData,
    isLoading: settingsLoading,
    isError,
  } = useSettings();

  useEffect(() => {
    if (settingsData) {
      setConversionRate(
        settingsData?.data?.length > 0
          ? settingsData?.data[0]?.conversionRate
          : 0
      );
    }
  }, [settingsData]);

  console.log(conversionRate);
  const { playerId: paramPlayerId } = useParams();
  const playerId = propPlayerId || paramPlayerId;

  const [filters, setFilters] = useState({
    ...defaultFilters,
    ...(params || {}),
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
  const formatUSD = (amount, rate) => {
    if (!rate || rate <= 0 || !amount) return "-";
    return `${(amount / rate).toFixed(2)} USD`;
  };
  const columns = useMemo(
    () => [
      { field: "sl", headerName: "#", width: 60, align: "center" },
      { field: "id", headerName: "User ID", width: 60, align: "center" },
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
        headerName: "BDT Amount",
        width: 140,
        align: "center",
        render: (value, row) => (
          <span className="font-medium text-center">
            {value != null ? `${formatAmount(value)}` : "-"}
          </span>
        ),
      },
      {
        field: "conversionRate",
        headerName: "USD Amount",
        width: 140,
        align: "center",
        render: (value, row) => (
          <span className="font-medium text-center">
            {formatUSD(row.amount, conversionRate)}
          </span>
        ),
      },
      {
        field: "bonusAmount",
        headerName: "Bonus Amount",
        width: 160,
        render: (value, row) => (
          <div className="flex flex-col">
            <span className="font-medium">
              {value != null ? `${formatAmount(value)}` : "-"}
            </span>
            <span className="font-medium text-gray-500 text-xs">
              {row?.promotionName != null
                ? `Promotion: ${row?.promotionName}`
                : "-"}
            </span>
          </div>
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
            className={`px-2 py-1 rounded capitalize text-xs font-medium ${
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
        field: "processedBy",
        headerName: "ProcessedBY",
        width: 200,
        render: (_, row) => {
          return (
            <div className="flex flex-col">
              <span className="font-medium">
                {row?.processedBy ? `${row?.processedBy}` : "-"}
              </span>
              <span className="font-medium text-gray-500 text-xs">
                {row?.processedByRoleType
                  ? `Role: ${row?.processedByRoleType}`
                  : "-"}
              </span>
            </div>
          );
        },
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
    [navigate, conversionRate]
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

  console.log(conversionRate);

  if (settingsLoading || isLoading) {
    return "Loading...";
  }
  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
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
        <DataTable
          columns={columns}
          data={items}
          isLoading={isLoading || settingsLoading}
        />
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

      {/* Transaction Receipt Modal */}
      <ReusableModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title=""
        onSave={null}
        size="lg"
        className="max-h-[90vh] !max-w-[90vw] overflow-y-auto"
        hideCloseButton={false}
      >
        {selectedTx && (
          <div className="bg-white">
            {/* Receipt Header */}
            <div className="border-b-2 border-gray-200 pb-4 mb-6">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  TRANSACTION RECEIPT
                </h1>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <span>System Trx #: {selectedTx.customTransactionId}</span>
                  <span>•</span>
                  <span>Date: {formatDateTime(selectedTx.createdAt)}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${
                    selectedTx.status === "approved"
                      ? "bg-green-100 text-green-800 border-2 border-green-300"
                      : selectedTx.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                      : "bg-red-100 text-red-800 border-2 border-red-300"
                  }`}
                >
                  {selectedTx.status}
                </span>
              </div>
            </div>

            {/* Main Receipt Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Transaction Details */}
              <div className="lg:col-span-2">
                {/* Transaction Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Transaction Summary
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-start gap-2">
                        <span className="text-gray-600 font-medium">
                          Transaction Type:
                        </span>
                        <span className="font-bold text-gray-800 capitalize">
                          {selectedTx.type}
                        </span>
                      </div>
                      <div className="flex justify-start gap-2">
                        <span className="text-gray-600 font-medium">
                          Amount:
                        </span>
                        <span className="font-bold text-2xl text-green-600">
                          {formatAmount(selectedTx.amount)}
                        </span>
                      </div>
                      <div className="flex justify-start gap-2">
                        <span className="text-gray-600 font-medium">
                          Currency:
                        </span>
                        <span className="font-semibold text-gray-800">
                          BDT (Bangladeshi Taka)
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {selectedTx.givenTransactionId && (
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            Given Trx:
                          </span>
                          <span className="font-bold text-sm text-gray-700">
                            {selectedTx.givenTransactionId}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-start gap-2">
                        <span className="text-gray-600 font-medium">
                          Created:
                        </span>
                        <span className="font-medium text-gray-800">
                          {formatDateTime(selectedTx.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Promotion Details */}
                {selectedTx.promotionId && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                      Promotion Applied
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-start gap-2 mb-2">
                          <span className="text-gray-600 font-medium">
                            Promotion:
                          </span>
                          <span className="font-bold text-purple-700">
                            {selectedTx.promotionName} <br /> (Up to{" "}
                            {selectedTx.promotionPercentage || 10}% Bonus)
                          </span>
                        </div>
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            Bonus Amount:
                          </span>
                          <span className="font-bold text-xl text-purple-600">
                            {formatAmount(selectedTx.bonusAmount)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-600 mb-1">
                          +{formatAmount(selectedTx.bonusAmount)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Bonus Credit
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Method Details */}
                {(selectedTx.accountNumber ||
                  selectedTx.bankName ||
                  selectedTx.walletAddress) && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      Payment Method Details
                    </h2>
                    <div className="space-y-3">
                      {selectedTx.paymentGateway?.id && (
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            Gateway:
                          </span>
                          <span className="font-bold font-semibold text-gray-800">
                            {selectedTx?.paymentGateway?.name}
                          </span>
                        </div>
                      )}

                      {selectedTx.accountNumber && (
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            Account Number:
                          </span>
                          <span className="font-bold font-semibold text-gray-800">
                            {selectedTx.accountNumber}
                          </span>
                        </div>
                      )}
                      {selectedTx.accountHolderName && (
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            Account Holder:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {selectedTx.accountHolderName}
                          </span>
                        </div>
                      )}
                      {selectedTx.bankName && (
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            Bank Name:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {selectedTx.bankName}
                          </span>
                        </div>
                      )}
                      {selectedTx.branchName && (
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            Branch:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {selectedTx.branchName}
                          </span>
                        </div>
                      )}
                      {selectedTx.branchAddress && (
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            Branch Address:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {selectedTx.branchAddress}
                          </span>
                        </div>
                      )}
                      {selectedTx.swiftCode && (
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            Swift Code:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {selectedTx.swiftCode}
                          </span>
                        </div>
                      )}

                      {selectedTx.iban && (
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            IBAN Code:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {selectedTx.swiftCode}
                          </span>
                        </div>
                      )}

                      {selectedTx.walletAddress && (
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            Wallet Address:
                          </span>
                          <span className="font-bold text-xs text-gray-700 break-all">
                            {selectedTx.walletAddress}
                          </span>
                        </div>
                      )}
                      {selectedTx.network && (
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            Network:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {selectedTx.network}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedTx.notes && (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                      Additional Notes
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {selectedTx.notes}
                    </p>
                  </div>
                )}

                {/* Attachment */}
                {selectedTx.attachment && (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                      Supporting Document
                    </h2>
                    <div className="flex items-center justify-start gap-2">
                      <div>
                        <p className="text-gray-700 mb-2">
                          Transaction proof or receipt image
                        </p>
                        <p className="text-sm text-gray-500">
                          Click below to view the attachment
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          window.open(selectedTx.attachment, "_blank")
                        }
                        className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Document
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - User & Processing Info */}
              <div className="space-y-6">
                {/* User Information */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                    Customer Information
                  </h2>
                  <div className="space-y-4">
                    <div className="text-center pb-4 border-b border-indigo-200">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-indigo-600">
                          {selectedTx.userFullname?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {selectedTx.userFullname}
                      </h3>
                      <p className="text-indigo-600 font-medium">
                        @{selectedTx.userUsername}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-start gap-2">
                        <span className="text-gray-600 font-medium">
                          Email:
                        </span>
                        <span className="font-semibold text-gray-800 text-sm">
                          {selectedTx.userEmail}
                        </span>
                      </div>
                      <div className="flex justify-start gap-2">
                        <span className="text-gray-600 font-medium">
                          Phone:
                        </span>
                        <span className="font-semibold text-gray-800">
                          {selectedTx.userPhone}
                        </span>
                      </div>
                      <div className="flex justify-start gap-2">
                        <span className="text-gray-600 font-medium">
                          Status:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            selectedTx.userStatus === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedTx.userStatus}
                        </span>
                      </div>
                      <div className="flex justify-start gap-2">
                        <span className="text-gray-600 font-medium">
                          Verified:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            selectedTx.userIsVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedTx.userIsVerified
                            ? "✓ Verified"
                            : "✗ Not Verified"}
                        </span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-indigo-200">
                      <button
                        onClick={() => {
                          setViewModalOpen(false);
                          navigate(`/players/${selectedTx.userId}/profile`);
                        }}
                        className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-semibold text-sm"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
                </div>

                {/* Processing Information */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                    Processing Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-start gap-2">
                      <span className="text-gray-600 font-medium">
                        Created:
                      </span>
                      <span className="font-semibold text-gray-800 text-sm">
                        {formatDateTime(selectedTx.createdAt)}
                      </span>
                    </div>
                    {selectedTx.processedAt && (
                      <div className="flex justify-start gap-2">
                        <span className="text-gray-600 font-medium">
                          Processed:
                        </span>
                        <span className="font-semibold text-gray-800 text-sm">
                          {formatDateTime(selectedTx.processedAt)}
                        </span>
                      </div>
                    )}
                    {selectedTx.processedBy && (
                      <div className="flex justify-start gap-2">
                        <span className="text-gray-600 font-medium">
                          Processed By:
                        </span>
                        <span className="font-semibold text-gray-800 text-sm">
                          {selectedTx.processedBy}
                        </span>
                      </div>
                    )}
                    {selectedTx.processedByRoleType && (
                      <div className="flex justify-start gap-2">
                        <span className="text-gray-600 font-medium">Role:</span>
                        <span className="font-semibold text-gray-800 text-sm">
                          {selectedTx.processedByRoleType}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Game Information */}
                {selectedTx.gameName && (
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                      Game Information
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-start gap-2">
                        <span className="text-gray-600 font-medium">Game:</span>
                        <span className="font-semibold text-gray-800">
                          {selectedTx.gameName}
                        </span>
                      </div>
                      {selectedTx.gameStatus && (
                        <div className="flex justify-start gap-2">
                          <span className="text-gray-600 font-medium">
                            Status:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {selectedTx.gameStatus}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="border-t-2 border-gray-200 pt-6 mt-8">
              <div className="text-center text-gray-500 text-sm">
                <p>This is an official transaction receipt from GS365</p>
                <p className="mt-1">
                  Generated on {formatDateTime(new Date())}
                </p>
                <p className="mt-1">
                  System Trx: {selectedTx.customTransactionId}
                </p>
              </div>
            </div>
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
