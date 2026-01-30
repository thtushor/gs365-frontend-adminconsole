import React, { useMemo, useState, useEffect } from "react";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import { useAuth } from "../hooks/useAuth";
import { BASE_URL } from "../api/ApiList";
import { formatDate } from "../Utils/dateUtils";
import { useGetRequest } from "../Utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

const defaultFilters = {
  page: 1,
  pageSize: 20,
  userId: "",
  minAmount: "",
  maxAmount: "",
  startDate: "",
  endDate: "",
};

// Helper - formats date as YYYY-MM-DD using local date parts (correct month)
const formatLocalDate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 is REQUIRED
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SpinBonusList = ({ title = "Spin Bonuses" }) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];

  const [filters, setFilters] = useState(defaultFilters);
  const [dateRange, setDateRange] = useState([null, null]);

  const getRequest = useGetRequest();

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      setFilters((prev) => ({
        ...prev,
        startDate: formatLocalDate(dateRange[0]),
        endDate: formatLocalDate(dateRange[1]),
        page: 1,
      }));
    } else if (!dateRange[0] && !dateRange[1]) {
      setFilters((prev) => ({
        ...prev,
        startDate: "",
        endDate: "",
        page: 1,
      }));
    }
  }, [dateRange]);

  const { data: spinData, isLoading: spinListLoading } = useQuery({
    queryKey: ["spinBonuses", filters],
    queryFn: () =>
      getRequest({
        url: `${BASE_URL}/api/spin`,
        params: filters,
      }),
  });

  const bonuses = spinData?.data ?? [];
  const totalRecords = spinData?.pagination?.total ?? 0;

  const columns = useMemo(
    () => [
      {
        field: "sl",
        headerName: "SL",
        width: 60,
        render: (_, __, index) =>
          (filters.page - 1) * filters.pageSize + index + 1,
      },
      {
        field: "transaction",
        headerName: "Transaction ID",
        width: 160,
        render: (transaction) => {
          if (!transaction) return "-";
          const displayId =
            transaction.customTransactionId ||
            transaction.id ||
            transaction.transactionId;
          return <span className="font-mono">{displayId}</span>;
        },
      },
      {
        field: "user",
        headerName: "User",
        width: 220,
        render: (value) => (
          <div className="flex flex-col">
            <Link
              to={`/players/${value?.id}/profile`}
              className="font-medium text-green-500"
            >
              {value?.username || `ID: ${value?.id || "-"}`}
            </Link>
            <span className="text-xs text-gray-500">{value?.email || "-"}</span>
          </div>
        ),
      },
      {
        field: "amount",
        headerName: "Amount",
        width: 140,
        render: (value) => (
          <span className="font-semibold text-emerald-700">
            {Number(value || 0).toFixed(2)}
          </span>
        ),
      },
      {
        field: "turnoverMultiply",
        headerName: "Turnover ×",
        width: 130,
        render: (value) => (
          <span className="font-medium">{Number(value || 1).toFixed(2)}×</span>
        ),
      },
      {
        field: "conversionRate",
        headerName: "Conv. Rate",
        width: 130,
        render: (value) => (
          <span className="text-indigo-600 font-medium">
            1 : {Number(value || 100).toFixed(0)}
          </span>
        ),
      },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 180,
        render: (value) => (value ? formatDate(value) : "-"),
      },
    ],
    [filters.page, filters.pageSize],
  );

  const hasActiveFilters =
    filters.userId ||
    filters.minAmount ||
    filters.maxAmount ||
    filters.startDate ||
    filters.endDate;

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setDateRange([null, null]);
  };

  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm text-gray-600 mb-1">User ID</label>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="User ID"
              type="number"
              value={filters.userId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, userId: e.target.value, page: 1 }))
              }
            />
          </div>

          <div className="flex-1 min-w-[240px]">
            <label className="block text-sm text-gray-600 mb-1">
              Date Range (Created At)
            </label>
            <DatePicker
              selectsRange={true}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => setDateRange(update)}
              maxDate={new Date()}
              placeholderText="Select date range"
              dateFormat="yyyy-MM-dd"
              isClearable={true}
              className="border rounded px-3 py-2 w-full"
              wrapperClassName="w-full"
            />
          </div>

          {hasActiveFilters && (
            <div className="self-end">
              <button
                onClick={handleClearFilters}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded border border-red-300 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <DataTable
          columns={columns}
          data={bonuses}
          isLoading={spinListLoading}
          isSuperAdmin={isSuperAdmin}
          permissions={permissions}
          exportPermission="spin_bonus_view"
        />
        <Pagination
          currentPage={filters.page}
          totalPages={Math.max(1, Math.ceil(totalRecords / filters.pageSize))}
          pageSize={filters.pageSize}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          onPageSizeChange={(ps) =>
            setFilters((f) => ({ ...f, pageSize: ps, page: 1 }))
          }
        />
      </div>
    </div>
  );
};

export default SpinBonusList;
