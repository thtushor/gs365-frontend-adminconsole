import React, { useMemo, useState } from "react";
import { useTransactions, useUpdateTransactionStatus } from "../hooks/useTransactions";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import ReusableModal from "./ReusableModal";

const statusOptions = [
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

const defaultFilters = {
  page: 1,
  pageSize: 10,
  type: "",
  status: "",
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  userId: "",
};

const TransactionsPage = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedTx, setSelectedTx] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatePayload, setUpdatePayload] = useState({ status: "", notes: "" });

  const { data, isLoading } = useTransactions(filters);
  const updateMutation = useUpdateTransactionStatus();

  const items = data?.data || data?.items || [];
  const total = data?.total || data?.meta?.total || 0;
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
      { field: "userId", headerName: "User", width: 120 },
      { field: "type", headerName: "Type", width: 120 },
      {
        field: "amount",
        headerName: "Amount",
        width: 140,
        render: (value) => (value != null ? `${value}` : "-"),
      },
      { field: "notes", headerName: "Trx Number", width: 120 },
      { field: "status", headerName: "Status", width: 120 },
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
            className="px-3 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100"
            onClick={() => {
                window.open(row?.attachment, "_blank");
            }}
          >
            View Attachment
          </button>
            <button
            className="px-3 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100"
            onClick={() => handleOpenModal(row)}
          >
            Update Status
          </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleOpenModal = (row) => {
    setSelectedTx(row);
    setUpdatePayload({ status: row?.status || "pending", notes: row?.notes || "" });
    setModalOpen(true);
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
        <h2 className="text-lg font-semibold">Transactions</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Search by id/user"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
          />
          <select
            className="border rounded px-3 py-2"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}
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
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value, page: 1 }))}
          >
            <option value="">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
            <option value="transfer">Transfer</option>
          </select>
          <input
            className="border rounded px-3 py-2"
            placeholder="User ID"
            value={filters.userId}
            onChange={(e) => setFilters((f) => ({ ...f, userId: e.target.value, page: 1 }))}
          />
          <div className="flex gap-2">
            <select
              className="border rounded px-3 py-2"
              value={filters.sortBy}
              onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value, page: 1 }))}
            >
              <option value="createdAt">Created At</option>
              <option value="amount">Amount</option>
            </select>
            <select
              className="border rounded px-3 py-2"
              value={filters.sortOrder}
              onChange={(e) => setFilters((f) => ({ ...f, sortOrder: e.target.value, page: 1 }))}
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
          onPageSizeChange={(ps) => setFilters((f) => ({ ...f, pageSize: ps, page: 1 }))}
        />
      </div>

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
            onChange={(e) => setUpdatePayload((p) => ({ ...p, status: e.target.value }))}
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
            onChange={(e) => setUpdatePayload((p) => ({ ...p, notes: e.target.value }))}
          />
        </div>
      </ReusableModal>
    </div>
  );
};

export default TransactionsPage;


