import React, { useState } from "react";
import DataTable from "./DataTable";
import ReportCard from "./ReportCard";

const mockProviders = [
  {
    provider: "Evolution",
    paid: 50000,
    pending: 5000,
    failed: 0,
    lastPayment: "2024-06-25",
    status: "Active",
  },
  {
    provider: "Pragmatic",
    paid: 30000,
    pending: 2000,
    failed: 1000,
    lastPayment: "2024-06-20",
    status: "Active",
  },
  {
    provider: "NetEnt",
    paid: 20000,
    pending: 0,
    failed: 2000,
    lastPayment: "2024-06-15",
    status: "Inactive",
  },
];

const totalPaid = mockProviders.reduce((sum, p) => sum + p.paid, 0);
const totalPending = mockProviders.reduce((sum, p) => sum + p.pending, 0);
const totalFailed = mockProviders.reduce((sum, p) => sum + p.failed, 0);
const mostPaid = mockProviders.reduce(
  (max, p) => (p.paid > max.paid ? p : max),
  mockProviders[0]
);
const leastPaid = mockProviders.reduce(
  (min, p) => (p.paid < min.paid ? p : min),
  mockProviders[0]
);

const ProviderPaymentsPage = () => {
  const [dateRange, setDateRange] = useState({
    from: "2024-06-01",
    to: "2024-06-30",
  });

  const columns = [
    { field: "provider", headerName: "Provider", width: 140 },
    {
      field: "paid",
      headerName: "Total Paid",
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
      field: "failed",
      headerName: "Failed",
      width: 100,
      render: (value) => value.toLocaleString(),
    },
    { field: "lastPayment", headerName: "Last Payment Date", width: 140 },
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
      <h2 className="text-2xl font-bold mb-4">Provider Payments</h2>
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
        <ReportCard title="Total Providers" value={mockProviders.length} />
        <ReportCard title="Total Paid" value={totalPaid.toLocaleString()} />
        <ReportCard
          title="Total Pending"
          value={totalPending.toLocaleString()}
          highlight="text-yellow-600"
        />
        <ReportCard
          title="Total Failed"
          value={totalFailed.toLocaleString()}
          highlight="text-red-600"
        />
        <ReportCard
          title="Most Paid"
          value={mostPaid.provider}
          highlight="text-green-600"
        />
        <ReportCard
          title="Least Paid"
          value={leastPaid.provider}
          highlight="text-gray-600"
        />
      </div>
      {/* Breakdown Table */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Breakdown by Provider</h3>
        <DataTable columns={columns} data={mockProviders} />
      </div>
    </div>
  );
};

export default ProviderPaymentsPage;
