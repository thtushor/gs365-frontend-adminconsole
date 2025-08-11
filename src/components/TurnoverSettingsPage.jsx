import React, { useState } from "react";
import DataTable from "./DataTable";
import ReportCard from "./ReportCard";
import ReusableModal from "./ReusableModal";

const mockTurnover = [
  {
    product: "Sportsbook",
    multiplier: 5,
    minBet: 10,
    maxBet: 10000,
    lastUpdated: "2024-06-20",
  },
  {
    product: "Slots",
    multiplier: 10,
    minBet: 5,
    maxBet: 5000,
    lastUpdated: "2024-06-18",
  },
  {
    product: "Poker",
    multiplier: 3,
    minBet: 20,
    maxBet: 20000,
    lastUpdated: "2024-06-15",
  },
];

const defaultForm = { product: "", multiplier: 1, minBet: 0, maxBet: 0 };

const TurnoverSettingsPage = () => {
  const [turnover, setTurnover] = useState(mockTurnover);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editIndex, setEditIndex] = useState(null);

  // Summary values
  const totalProducts = turnover.length;
  const avgMultiplier = (
    turnover.reduce((sum, t) => sum + t.multiplier, 0) / totalProducts
  ).toFixed(2);

  // Table columns
  const columns = [
    { field: "product", headerName: "Product", width: 140 },
    { field: "multiplier", headerName: "Turnover Multiplier", width: 160 },
    { field: "minBet", headerName: "Min Bet", width: 100 },
    { field: "maxBet", headerName: "Max Bet", width: 100 },
    { field: "lastUpdated", headerName: "Last Updated", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
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

  function handleEdit(row, idx) {
    setForm(row);
    setEditIndex(idx);
    setModalOpen(true);
  }

  function handleSave() {
    const updated = turnover.map((item, idx) =>
      idx === editIndex ? form : item
    );
    setTurnover(updated);
    setModalOpen(false);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Turnover Settings</h2>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <ReportCard title="Total Products" value={totalProducts} />
        <ReportCard title="Avg. Multiplier" value={avgMultiplier} />
        <ReportCard
          title="Highest Multiplier"
          value={Math.max(...turnover.map((t) => t.multiplier))}
        />
        <ReportCard
          title="Lowest Multiplier"
          value={Math.min(...turnover.map((t) => t.multiplier))}
        />
      </div>
      {/* Turnover Table */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Turnover Configuration</h3>
        <DataTable columns={columns} data={turnover} />
      </div>
      {/* Edit Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Turnover"
        onSave={handleSave}
      >
        <form className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Product</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.product}
              disabled
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Turnover Multiplier
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={form.multiplier}
              min={1}
              onChange={(e) =>
                setForm({ ...form, multiplier: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Min Bet</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={form.minBet}
              min={0}
              onChange={(e) =>
                setForm({ ...form, minBet: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Bet</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={form.maxBet}
              min={0}
              onChange={(e) =>
                setForm({ ...form, maxBet: Number(e.target.value) })
              }
            />
          </div>
        </form>
      </ReusableModal>
    </div>
  );
};

export default TurnoverSettingsPage;
