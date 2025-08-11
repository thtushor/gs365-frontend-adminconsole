import React, { useState } from "react";
import DataTable from "./DataTable";
import ReportCard from "./ReportCard";

const mockSummary = {
  produced: 1000000,
  burned: 200000,
  circulation: 800000,
  awarded: 500000,
  bet: 300000,
  withdrawn: 100000,
};

const mockBreakdown = [
  {
    type: "Mint",
    amount: 500000,
    date: "2024-06-01",
    reference: "Initial Mint",
  },
  {
    type: "Award",
    amount: 200000,
    date: "2024-06-05",
    reference: "Promo Bonus",
  },
  { type: "Bet", amount: 100000, date: "2024-06-10", reference: "Sportsbook" },
  {
    type: "Burn",
    amount: 50000,
    date: "2024-06-15",
    reference: "Expired Coins",
  },
  {
    type: "Withdraw",
    amount: 50000,
    date: "2024-06-20",
    reference: "Player Withdraw",
  },
  {
    type: "Mint",
    amount: 500000,
    date: "2024-06-25",
    reference: "Monthly Mint",
  },
  {
    type: "Award",
    amount: 300000,
    date: "2024-06-26",
    reference: "Tournament Prize",
  },
  { type: "Bet", amount: 200000, date: "2024-06-27", reference: "Slots" },
  {
    type: "Burn",
    amount: 150000,
    date: "2024-06-28",
    reference: "System Burn",
  },
  {
    type: "Withdraw",
    amount: 50000,
    date: "2024-06-29",
    reference: "Player Withdraw",
  },
];

const CoinAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState({
    from: "2024-06-01",
    to: "2024-06-30",
  });

  const columns = [
    { field: "type", headerName: "Type", width: 100 },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      render: (value) => value.toLocaleString(),
    },
    { field: "date", headerName: "Date", width: 120 },
    { field: "reference", headerName: "Reference", width: 200 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Coin Analytics</h2>
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
        <ReportCard
          title="Total Produced"
          value={mockSummary.produced.toLocaleString()}
        />
        <ReportCard
          title="Total Burned"
          value={mockSummary.burned.toLocaleString()}
          highlight="text-red-600"
        />
        <ReportCard
          title="In Circulation"
          value={mockSummary.circulation.toLocaleString()}
          highlight="text-blue-600"
        />
        <ReportCard
          title="Awarded to Players"
          value={mockSummary.awarded.toLocaleString()}
        />
        <ReportCard
          title="Used for Bets"
          value={mockSummary.bet.toLocaleString()}
        />
        <ReportCard
          title="Withdrawn"
          value={mockSummary.withdrawn.toLocaleString()}
        />
      </div>
      {/* Breakdown Table */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Coin Transactions</h3>
        <DataTable columns={columns} data={mockBreakdown} />
      </div>
    </div>
  );
};

export default CoinAnalyticsPage;
