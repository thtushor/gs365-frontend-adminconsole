import React, { useState } from "react";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import { FaEdit } from "react-icons/fa";

const mockGames = [
  { name: "Football", type: "Sport", status: "Active" },
  { name: "Roulette", type: "Casino", status: "Inactive" },
  { name: "Cricket", type: "Sport", status: "Active" },
  { name: "Poker", type: "Card", status: "Active" },
];

const defaultForm = { name: "", type: "", status: "Active" };

const GamesPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editIndex, setEditIndex] = useState(null);
  const [games, setGames] = useState(mockGames);

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
      const updated = games.map((item, idx) =>
        idx === editIndex ? form : item
      );
      setGames(updated);
    } else {
      setGames([{ ...form }, ...games]);
    }
    setModalOpen(false);
  };

  const columns = [
    { field: "name", headerName: "Game Name", width: 180 },
    { field: "type", headerName: "Type", width: 120 },
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
          <FaEdit />
        </button>
      ),
    },
  ];

  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Games</h2>
        <button
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
          onClick={handleCreate}
        >
          Create Game
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <DataTable columns={columns} data={games} />
      </div>
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editIndex !== null ? "Edit Game" : "Create Game"}
        onSave={handleSave}
      >
        <form className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Game Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
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

export default GamesPage;
