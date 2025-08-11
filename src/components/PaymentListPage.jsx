import React, { useState } from "react";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";

const mockPayments = [
  { name: "Bkash", type: "Mobile", details: "017XXXXXXXX", status: "Active" },
  { name: "Visa", type: "Card", details: "**** 1234", status: "Inactive" },
];

const defaultForm = { name: "", type: "Bank", details: "", status: "Active" };

const PaymentListPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editIndex, setEditIndex] = useState(null);
  const [payments, setPayments] = useState(mockPayments);

  const handleCreate = () => {
    setForm(defaultForm);
    setEditIndex(null);
    setModalOpen(true);
  };

  const handleEdit = (row, idx) => {
    setForm(row);
    setEditIndex(idx);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updated = payments.map((item, idx) =>
        idx === editIndex ? form : item
      );
      setPayments(updated);
    } else {
      setPayments([{ ...form }, ...payments]);
    }
    setModalOpen(false);
  };

  const columns = [
    { field: "name", headerName: "Method Name", width: 140 },
    { field: "type", headerName: "Type", width: 100 },
    { field: "details", headerName: "Details", width: 180 },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      align: "center",
      render: (value, row, idx) => (
        <button
          className="inline-flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full p-2 transition"
          title="Edit"
          onClick={() => handleEdit(row, idx)}
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Payment Methods</h2>
        <button
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
          onClick={handleCreate}
        >
          Create Method
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <DataTable columns={columns} data={payments} />
      </div>
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editIndex !== null ? "Edit Method" : "Create Method"}
        onSave={handleSave}
      >
        <form className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Method Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Details"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="Bank">Bank</option>
            <option value="Card">Card</option>
            <option value="Mobile">Mobile</option>
          </select>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </form>
      </ReusableModal>
    </div>
  );
};

export default PaymentListPage;
