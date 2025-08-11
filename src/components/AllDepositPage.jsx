import React, { useState } from "react";
import AllDepositFilter from "./AllDepositFilter";
import AllDepositTable from "./AllDepositTable";
import ReusableModal from "./ReusableModal";

const mockDeposits = [
  {
    player: "#123",
    date: "13 Jan 2025",
    trxid: "#########",
    amount: "৳500",
    coverage: "৳500",
    from: "#########",
    to: "#########",
    method: "VISA",
    status: "Paid",
  },
  {
    player: "#123",
    date: "13 Jan 2025",
    trxid: "#########",
    amount: "৳500",
    coverage: "৳500",
    from: "#########",
    to: "#########",
    method: "VISA",
    status: "Unpaid",
  },
  {
    player: "#123",
    date: "13 Jan 2025",
    trxid: "#########",
    amount: "৳500",
    coverage: "৳500",
    from: "#########",
    to: "#########",
    method: "VISA",
    status: "Paid",
  },
  {
    player: "#123",
    date: "13 Jan 2025",
    trxid: "#########",
    amount: "৳500",
    coverage: "৳500",
    from: "#########",
    to: "#########",
    method: "VISA",
    status: "Cancel",
  },
];

const defaultForm = {
  player: "",
  date: "",
  trxid: "",
  amount: "",
  coverage: "",
  from: "",
  to: "",
  method: "",
  status: "Paid",
};

const AllDepositPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editIndex, setEditIndex] = useState(null);
  const [deposits, setDeposits] = useState(mockDeposits);

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
      // Edit
      const updated = deposits.map((item, idx) =>
        idx === editIndex ? form : item
      );
      setDeposits(updated);
    } else {
      // Create
      setDeposits([{ ...form }, ...deposits]);
    }
    setModalOpen(false);
  };

  // Pass handleEdit to the table via a custom prop
  const columns = [
    { field: "player", headerName: "PLAYER", width: 100 },
    { field: "date", headerName: "DATE", width: 120 },
    { field: "trxid", headerName: "TRXID", width: 120 },
    { field: "amount", headerName: "AMOUNT", width: 100 },
    { field: "coverage", headerName: "COVERAGE AMOUNT", width: 150 },
    { field: "from", headerName: "FROM ACCOUNT", width: 150 },
    { field: "to", headerName: "TO ACCOUNT", width: 150 },
    { field: "method", headerName: "METHOD", width: 100 },
    { field: "status", headerName: "STATUS", width: 100 },
    {
      field: "action",
      headerName: "ACTION",
      width: 120,
      align: "center",
      render: (value, row, idx) => (
        <div className="flex justify-center gap-2">
          <button
            className="inline-flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full p-2 transition md:p-1 mr-2"
            title="Edit"
            onClick={() => handleEdit(row, idx)}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">ALL DEPOSIT LIST</h2>
        <div className="flex gap-2">
          <button
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
            onClick={handleCreate}
          >
            Create Deposit
          </button>
          <button className="border border-green-400 text-green-500 px-4 py-1 rounded hover:bg-green-50 transition text-sm font-medium">
            Print
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <AllDepositFilter />
      </div>
      <div className="bg-white rounded-lg overflow-auto max-w-full shadow p-4">
        <AllDepositTable deposits={deposits} columns={columns} />
      </div>
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editIndex !== null ? "Edit Deposit" : "Create Deposit"}
        onSave={handleSave}
      >
        <form className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Player"
            value={form.player}
            onChange={(e) => setForm({ ...form, player: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="TRXID"
            value={form.trxid}
            onChange={(e) => setForm({ ...form, trxid: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Coverage"
            value={form.coverage}
            onChange={(e) => setForm({ ...form, coverage: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="From Account"
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="To Account"
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Method"
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Cancel">Cancel</option>
          </select>
        </form>
      </ReusableModal>
    </div>
  );
};

export default AllDepositPage;
