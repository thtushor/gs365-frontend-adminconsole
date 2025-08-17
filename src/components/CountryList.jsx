import React, { useState } from "react";
import DataTable from "./DataTable";
import ThumbnailImage from "./ThumbnailImage";
import { useCountryData } from "../hooks/useCountryData";
import Pagination from "./Pagination";
import AssignCountryLanguageModal from "./AssignCountryLanguageModal";

const defaultFilters = {
  searchKey: "",
  status: "",
  page: 1,
  pageSize: 10,
};

const CountryList = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const { useCountries, updateCountryStatus, isUpdatingCountryStatus } =
    useCountryData();
  const [selectedCountry, setSelectedCountry] = useState(null);

  console.log({ filters });
  // Get countries with filters
  const {
    data: countriesResponse,
    isLoading,
    error,
  } = useCountries({
    ...filters,
  });

  // Extract countries array from API response
  const countries = countriesResponse?.data || [];

  const pageSize = filters.pageSize;
  const currentPage = filters.page;
  const totalPages = countriesResponse?.pagination?.totalPages;

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size) => {
    setFilters((prev) => ({ ...prev, pageSize: size, page: 1 }));
  };

  const handleStatusToggle = (countryId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    updateCountryStatus({
      id: countryId,
      status: newStatus,
    });
  };

  const columns = [
    {
      field: "flagUrl",
      headerName: "FLAG",
      width: 80,
      render: (value) => (
        <div className="flex items-center justify-center">
          {value ? (
            <img
              src={`data:image/png;base64,${value}`}
              alt="Country flag"
              className="w-8 h-6 object-cover rounded border"
            />
          ) : (
            <div className="w-8 h-6 bg-gray-200 rounded border flex items-center justify-center">
              <span className="text-xs text-gray-500">No flag</span>
            </div>
          )}
        </div>
      ),
    },
    {
      field: "name",
      headerName: "COUNTRY NAME",
      width: 180,
    },
    {
      field: "currency",
      headerName: "CURRENCY",
      width: 150,
      render: (value) => (
        <div className="flex flex-col">
          <span className="font-medium">{value?.name || "N/A"}</span>
          <span className="text-xs text-gray-500">
            {value?.code} ({value?.symbol_native || value?.symbol})
          </span>
        </div>
      ),
    },
    {
      field: "languages",
      headerName: "LANGUAGES",
      width: 150,
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value && value.length > 0 ? (
            value.map((lang, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {lang.name || lang}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No languages</span>
          )}
        </div>
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
      width: 150,
      align: "center",
      render: (value, row, idx) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600 hover:bg-blue-50 p-1 rounded"
            title="Toggle Status"
            onClick={() => handleStatusToggle(row.id, row.status)}
            disabled={isUpdatingCountryStatus}
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
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
          <button
            className="text-green-600 hover:bg-green-50 p-1 rounded"
            title="Edit"
            type="button"
            onClick={() => {
              setSelectedCountry(row);
              setIsAssignModalOpen(true);
            }}
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
              Error Loading Countries
            </h2>
            <p>{error.message || "Failed to load countries"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-green-600 text-white px-[10px] cursor-pointer py-1 rounded hover:bg-green-700 transition font-medium"
          onClick={() => setIsAssignModalOpen(true)}
        >
          Assign Language
        </button>
        <button
          className="border border-green-400 text-green-700 px-6 py-1 rounded hover:bg-green-50 transition font-medium"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>

      <div className="border border-green-400 rounded-md bg-white p-6 overflow-x-auto max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">COUNTRY LIST</h2>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Search countries..."
              value={filters.searchKey}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchKey: e.target.value }))
              }
            />
          </div>
          <div>
            <select
              className="border rounded px-3 py-2"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
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
            <p className="mt-2 text-gray-600">Loading countries...</p>
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={countries} />
            {countries.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No countries found.
              </div>
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 50, 100]}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>

      <AssignCountryLanguageModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={() => {
          // Data will be automatically refreshed by React Query
        }}
        selectedCountry={selectedCountry}
      />
    </div>
  );
};

export default CountryList;
