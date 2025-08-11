import React, { useState } from "react";
import DataTable from "./DataTable";
import ReportCard from "./ReportCard";

const mockAffiliates = [
  {
    affiliate: "John Doe",
    email: "john@affiliatesite.com",
    players: 120,
    bets: 50000,
    totalCommission: 3000,
    pending: 500,
    paid: 2500,
    status: "Active",
    lastPayout: "2024-06-25",
    joined: "2024-06-01",
  },
  {
    affiliate: "Jane Smith",
    email: "jane@affiliatesite.com",
    players: 80,
    bets: 30000,
    totalCommission: 2000,
    pending: 200,
    paid: 1800,
    status: "Active",
    lastPayout: "2024-06-20",
    joined: "2024-06-10",
  },
  {
    affiliate: "Bob Lee",
    email: "bob@affiliatesite.com",
    players: 30,
    bets: 10000,
    totalCommission: 500,
    pending: 100,
    paid: 400,
    status: "Inactive",
    lastPayout: "2024-06-15",
    joined: "2024-05-15",
  },
];

const totalAffiliates = mockAffiliates.length;
const totalPlayers = mockAffiliates.reduce((sum, a) => sum + a.players, 0);
const totalCommission = mockAffiliates.reduce(
  (sum, a) => sum + a.totalCommission,
  0
);
const totalPending = mockAffiliates.reduce((sum, a) => sum + a.pending, 0);
const topAffiliate = mockAffiliates.reduce(
  (max, a) => (a.totalCommission > max.totalCommission ? a : max),
  mockAffiliates[0]
);
const newAffiliates = mockAffiliates.filter(
  (a) => a.joined >= "2024-06-01"
).length;

const AffiliatePanelPage = () => {
  const [dateRange, setDateRange] = useState({
    from: "2024-06-01",
    to: "2024-06-30",
  });

  const columns = [
    { field: "affiliate", headerName: "Affiliate", width: 140 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "players", headerName: "Players Referred", width: 120 },
    {
      field: "bets",
      headerName: "Total Bets",
      width: 120,
      render: (value) => value.toLocaleString(),
    },
    {
      field: "totalCommission",
      headerName: "Total Commission",
      width: 120,
      render: (value) => value.toLocaleString(),
    },
    {
      field: "pending",
      headerName: "Pending",
      width: 100,
      render: (value) => value.toLocaleString(),
    },
    {
      field: "paid",
      headerName: "Paid",
      width: 100,
      render: (value) => value.toLocaleString(),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      render: (value) => (
        <span
          className={value === "Active" ? "text-green-600" : "text-gray-400"}
        >
          {value}
        </span>
      ),
    },
    { field: "lastPayout", headerName: "Last Payout", width: 120 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Affiliate Panel</h2>
      {/* Date Range Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>
        <button className="self-end bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Apply
        </button>
        <button className="self-end ml-2 border border-green-500 text-green-600 px-4 py-2 rounded hover:bg-green-50 transition">
          Export CSV
        </button>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <ReportCard title="Total Affiliates" value={totalAffiliates} />
        <ReportCard title="Players Referred" value={totalPlayers} />
        <ReportCard
          title="Commission Paid"
          value={(totalCommission - totalPending).toLocaleString()}
        />
        <ReportCard
          title="Commission Pending"
          value={totalPending.toLocaleString()}
          highlight="text-yellow-600"
        />
        <ReportCard
          title="Top Affiliate"
          value={topAffiliate.affiliate}
          highlight="text-green-600"
        />
        <ReportCard title="New Affiliates" value={newAffiliates} />
      </div>
      {/* Breakdown Table */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Breakdown by Affiliate</h3>
        <DataTable columns={columns} data={mockAffiliates} />
      </div>
    </div>
  );
};

export default AffiliatePanelPage;
