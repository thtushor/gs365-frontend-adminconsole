import React, { useState } from "react";
import DataTable from "./DataTable";
import ReportCard from "./ReportCard";

const mockProducts = [
  {
    product: "Sportsbook",
    bets: 50000,
    wins: 40000,
    rtp: 80,
    profit: 10000,
    percent: 40,
    status: "Active",
  },
  {
    product: "Slots",
    bets: 40000,
    wins: 35000,
    rtp: 87.5,
    profit: 5000,
    percent: 20,
    status: "Active",
  },
  {
    product: "Poker",
    bets: 30000,
    wins: 20000,
    rtp: 66.7,
    profit: 10000,
    percent: 40,
    status: "Inactive",
  },
];

const totalBets = mockProducts.reduce((sum, p) => sum + p.bets, 0);
const totalWins = mockProducts.reduce((sum, p) => sum + p.wins, 0);
const totalProfit = mockProducts.reduce((sum, p) => sum + p.profit, 0);
const mostProfitable = mockProducts.reduce(
  (max, p) => (p.profit > max.profit ? p : max),
  mockProducts[0]
);
const leastProfitable = mockProducts.reduce(
  (min, p) => (p.profit < min.profit ? p : min),
  mockProducts[0]
);

const ProductAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState({
    from: "2024-06-01",
    to: "2024-06-30",
  });

  const columns = [
    { field: "product", headerName: "Product", width: 140 },
    { field: "bets", headerName: "Total Bets", width: 120 },
    { field: "wins", headerName: "Total Wins", width: 120 },
    {
      field: "rtp",
      headerName: "RTP (%)",
      width: 100,
      render: (value) => <span>{value.toFixed(1)}%</span>,
    },
    {
      field: "profit",
      headerName: "Profit/Loss",
      width: 120,
      render: (value) => (
        <span
          className={
            value >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"
          }
        >
          {value >= 0 ? "+" : ""}
          {value.toLocaleString()}
        </span>
      ),
    },
    {
      field: "percent",
      headerName: "% of Total Profit",
      width: 120,
      render: (value) => <span>{value}%</span>,
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
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Product Analytics</h2>
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
        <ReportCard title="Total Products" value={mockProducts.length} />
        <ReportCard title="Total Bets" value={totalBets.toLocaleString()} />
        <ReportCard title="Total Wins" value={totalWins.toLocaleString()} />
        <ReportCard
          title="Total Profit/Loss"
          value={`${
            totalProfit >= 0 ? "+" : ""
          }${totalProfit.toLocaleString()}`}
          highlight={totalProfit >= 0 ? "text-green-600" : "text-red-600"}
        />
        <ReportCard
          title="Most Profitable"
          value={mostProfitable.product}
          highlight="text-green-600"
        />
        <ReportCard
          title="Least Profitable"
          value={leastProfitable.product}
          highlight="text-red-600"
        />
      </div>
      {/* Breakdown Table */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Breakdown by Product</h3>
        <DataTable columns={columns} data={mockProducts} />
      </div>
    </div>
  );
};

export default ProductAnalyticsPage;
