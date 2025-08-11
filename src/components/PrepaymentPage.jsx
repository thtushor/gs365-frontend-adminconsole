import React, { useState } from "react";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";

const mockPrepayments = [
  {
    agent: "John Doe",
    amount: "৳1000",
    date: "2024-06-01",
    status: "Completed",
  },
  {
    agent: "Jane Smith",
    amount: "৳2000",
    date: "2024-06-02",
    status: "Pending",
  },
];

const defaultForm = { agent: "", amount: "", date: "", status: "Completed" };

const PrepaymentPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editIndex, setEditIndex] = useState(null);
  const [prepayments, setPrepayments] = useState(mockPrepayments);

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
      const updated = prepayments.map((item, idx) =>
        idx === editIndex ? form : item
      );
      setPrepayments(updated);
    } else {
      setPrepayments([{ ...form }, ...prepayments]);
    }
    setModalOpen(false);
  };

  const columns = [
    { field: "agent", headerName: "Agent", width: 140 },
    { field: "amount", headerName: "Amount", width: 100 },
    { field: "date", headerName: "Date", width: 120 },
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
        <h2 className="text-lg font-semibold">Prepayment</h2>
        <button
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
          onClick={handleCreate}
        >
          Create Prepayment
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <DataTable columns={columns} data={prepayments} />
      </div>
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editIndex !== null ? "Edit Prepayment" : "Create Prepayment"}
        onSave={handleSave}
      >
        <form className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Agent"
            value={form.agent}
            onChange={(e) => setForm({ ...form, agent: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </form>
      </ReusableModal>
    </div>
  );
};

export default PrepaymentPage;
