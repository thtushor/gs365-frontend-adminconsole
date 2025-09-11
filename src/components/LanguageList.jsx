import React, { useState } from "react";
import DataTable from "./DataTable";
import ThumbnailImage from "./ThumbnailImage";
import { useCountryData } from "../hooks/useCountryData";
import AssignCountryLanguageModal from "./AssignCountryLanguageModal";
import { useAuth } from "../hooks/useAuth";

const LanguageList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const { useLanguages, updateLanguageStatus, isUpdatingLanguageStatus } =
    useCountryData();

  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];

  const canManageLanguages =
    isSuperAdmin || permissions.includes("country_manage_languages");
  const canUpdateLanguageStatus =
    isSuperAdmin || permissions.includes("country_update_language_status");
  const canAssignCountryLanguages =
    isSuperAdmin || permissions.includes("country_assign_country_languages");

  // Get languages with filters
  const {
    data: languagesResponse,
    isLoading,
    error,
  } = useLanguages({
    status: statusFilter,
    searchKey: search,
  });

  // Extract languages array from API response
  const languages = languagesResponse?.data || [];

  const handleStatusToggle = (languageId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    updateLanguageStatus({
      id: languageId,
      status: newStatus,
    });
  };

  const columns = [
    {
      field: "code",
      headerName: "CODE",
      width: 80,
      render: (value) => (
        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm font-medium">
          {value}
        </span>
      ),
    },
    {
      field: "name",
      headerName: "LANGUAGE NAME",
      width: 200,
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
          {(canUpdateLanguageStatus || canManageLanguages) && (
            <button
              className="text-blue-600 hover:bg-blue-50 p-1 rounded"
              title="Toggle Status"
              onClick={() => handleStatusToggle(row.id, row.status)}
              disabled={isUpdatingLanguageStatus}
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
          )}
          {canManageLanguages && (
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
          )}
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
              Error Loading Languages
            </h2>
            <p>{error.message || "Failed to load languages"}</p>
          </div>
        </div>
      </div>
    );
  }

  console.log({ languages });

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            className="border border-green-400 text-green-700 px-6 py-1 rounded hover:bg-green-50 transition font-medium"
            onClick={() => window.print()}
          >
            Print
          </button>
          {(canAssignCountryLanguages || canManageLanguages) && (
            <button
              className="bg-green-600 text-white px-6 py-1 rounded hover:bg-green-700 transition font-medium"
              onClick={() => setIsAssignModalOpen(true)}
            >
              Assign Language
            </button>
          )}
        </div>
      </div>

      <div className="border border-green-400 rounded-md bg-white p-6 overflow-x-auto max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">LANGUAGE LIST</h2>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Search languages..."
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
            <p className="mt-2 text-gray-600">Loading languages...</p>
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={languages} />
            {languages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No languages found.
              </div>
            )}
          </>
        )}
      </div>

      <AssignCountryLanguageModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={() => {
          // Data will be automatically refreshed by React Query
        }}
      />
    </div>
  );
};

export default LanguageList;
