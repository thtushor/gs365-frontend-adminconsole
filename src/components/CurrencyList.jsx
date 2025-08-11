import React, { useState } from "react";
import DataTable from "./DataTable";
import { useCountryData } from "../hooks/useCountryData";

const CurrencyList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  const { useCurrencies } = useCountryData();

  // Get currencies with filters
  const {
    data: currenciesResponse,
    isLoading,
    error,
  } = useCurrencies({
    status: statusFilter,
    searchKey: search,
  });

  // Extract currencies array from API response
  const currencies = currenciesResponse?.data || [];

  const columns = [
    {
      field: "symbol",
      headerName: "SYMBOL",
      width: 120,
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="text-lg font-bold">{value}</span>
          {row.symbol_native && (
            <span className="text-xs text-gray-500">{row.symbol_native}</span>
          )}
        </div>
      ),
    },
    {
      field: "name",
      headerName: "CURRENCY NAME",
      width: 180,
    },
    {
      field: "code",
      headerName: "CODE",
      width: 100,
      render: (value) => (
        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
          {value}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 100,
      render: (value, row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "ACTION",
      width: 120,
      align: "center",
      render: (value, row, idx) => (
        <div className="flex gap-2">
          <button
            className="text-green-600 hover:bg-green-50 p-1 rounded"
            title="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.788l-4 1 1-4 14.362-14.3z"
              />
            </svg>
          </button>
          <button
            className="text-red-500 hover:bg-red-50 p-1 rounded"
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] p-6">
        <div className="border border-red-400 rounded-md bg-white p-6 max-w-4xl mx-auto">
          <div className="text-center text-red-600">
            <h2 className="text-lg font-semibold mb-2">
              Error Loading Currencies
            </h2>
            <p>{error.message || "Failed to load currencies"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="flex justify-end mb-4">
        <button
          className="border border-green-400 text-green-700 px-6 py-1 rounded hover:bg-green-50 transition font-medium"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>

      <div className="border border-green-400 rounded-md bg-white p-6 overflow-x-auto max-w-5xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">CURRENCY LIST</h2>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Search currencies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <select
              className="border rounded px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="">All</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Loading currencies...</p>
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={currencies} />
            {currencies.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No currencies found.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CurrencyList;
