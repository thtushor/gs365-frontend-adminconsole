import React, { useState } from "react";
import DataTable from "./DataTable";
import ReportCard from "./ReportCard";

const mockSummary = {
  totalBets: 120000,
  totalWins: 95000,
  totalDeposits: 150000,
  totalWithdrawals: 80000,
  providerPayments: 10000,
  netProfitLoss: 15000,
};

const mockBreakdown = [
  {
    product: "Sportsbook",
    bets: 50000,
    wins: 40000,
    deposits: 60000,
    withdrawals: 30000,
    providerPayments: 4000,
    netPL: 6000,
  },
  {
    product: "Slots",
    bets: 40000,
    wins: 35000,
    deposits: 50000,
    withdrawals: 25000,
    providerPayments: 3000,
    netPL: 2000,
  },
  {
    product: "Poker",
    bets: 30000,
    wins: 20000,
    deposits: 40000,
    withdrawals: 25000,
    providerPayments: 3000,
    netPL: 7000,
  },
];

const NetProfitLossPage = () => {
  const [dateRange, setDateRange] = useState({
    from: "2024-06-01",
    to: "2024-06-30",
  });

  const columns = [
    { field: "product", headerName: "Product", width: 140 },
    { field: "bets", headerName: "Total Bets", width: 120 },
    { field: "wins", headerName: "Total Wins", width: 120 },
    { field: "deposits", headerName: "Deposits", width: 120 },
    { field: "withdrawals", headerName: "Withdrawals", width: 120 },
    { field: "providerPayments", headerName: "Provider Payments", width: 140 },
    {
      field: "netPL",
      headerName: "Net Profit/Loss",
      width: 140,
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
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Net Profit / Loss</h2>
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
          title="Total Bets"
          value={mockSummary.totalBets.toLocaleString()}
        />
        <ReportCard
          title="Total Wins"
          value={mockSummary.totalWins.toLocaleString()}
        />
        <ReportCard
          title="Deposits"
          value={mockSummary.totalDeposits.toLocaleString()}
        />
        <ReportCard
          title="Withdrawals"
          value={mockSummary.totalWithdrawals.toLocaleString()}
        />
        <ReportCard
          title="Provider Payments"
          value={mockSummary.providerPayments.toLocaleString()}
        />
        <ReportCard
          title="Net Profit/Loss"
          value={`${
            mockSummary.netProfitLoss >= 0 ? "+" : ""
          }${mockSummary.netProfitLoss.toLocaleString()}`}
          highlight={
            mockSummary.netProfitLoss >= 0 ? "text-green-600" : "text-red-600"
          }
        />
      </div>
      {/* Breakdown Table */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Breakdown by Product</h3>
        <DataTable columns={columns} data={mockBreakdown} />
      </div>
    </div>
  );
};

export default NetProfitLossPage;
