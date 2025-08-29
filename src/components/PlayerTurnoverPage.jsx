import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import Axios from "../api/axios";
import { FaSpinner, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import { BiRefresh } from "react-icons/bi";

const PlayerTurnoverPage = () => {
  const { playerId } = useParams();
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: turnoverData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["playerTurnover", playerId, statusFilter, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        userId: playerId,
        page: currentPage,
        pageSize: pageSize,
      });
      
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const res = await Axios.get(
        `${BASE_URL}${API_LIST.GET_PLAYERS_TURNOVER}?${params.toString()}`
      );
      
      if (!res.data.status) {
        throw new Error("Failed to fetch turnover data");
      }
      
      return res.data.data;
    },
    enabled: !!playerId,
  });

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    refetch();
    toast.info("Data refreshed");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "promotion":
        return "bg-purple-100 text-purple-800";
      case "default":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateProgress = (remaining, target) => {
    const completed = parseFloat(target) - parseFloat(remaining);
    const percentage = (completed / parseFloat(target)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <FaSpinner className="animate-spin text-2xl text-green-500" />
          <span className="text-lg text-gray-600">Loading turnover data...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">
          Failed to load turnover data
        </div>
        <button
          onClick={handleRefresh}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { data: turnovers, pagination } = turnoverData || { data: [], pagination: {} };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Player Turnover</h2>
          <p className="text-gray-600">
            Track player turnover requirements and progress
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
          >
            <BiRefresh className="text-sm" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="font-medium text-gray-700">Filter by Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "completed", label: "Completed" },
              { value: "pending", label: "Pending" },
              { value: "rejected", label: "Rejected" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleStatusFilterChange(filter.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  statusFilter === filter.value
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Turnover Cards */}
      <div className="grid gap-6">
        {turnovers.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="text-gray-500 text-lg">No turnover records found</div>
            <p className="text-gray-400 mt-2">
              {statusFilter !== "all"
                ? `No ${statusFilter} turnover records for this player`
                : "This player has no turnover requirements yet"}
            </p>
          </div>
        ) : (
          turnovers.map((turnover) => (
            <div
              key={turnover.id}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {turnover.turnoverName}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        turnover.status
                      )}`}
                    >
                      {turnover.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(
                        turnover.type
                      )}`}
                    >
                      {turnover.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Deposit Amount</div>
                      <div className="text-lg font-semibold text-green-600">
                        ${formatCurrency(turnover.depositAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Target Turnover</div>
                      <div className="text-lg font-semibold text-blue-600">
                        ${formatCurrency(turnover.targetTurnover)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Remaining Turnover</div>
                      <div className="text-lg font-semibold text-orange-600">
                        ${formatCurrency(turnover.remainingTurnover)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Turnover Progress</span>
                      <span className="font-medium">
                        {calculateProgress(
                          turnover.remainingTurnover,
                          turnover.targetTurnover
                        ).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${calculateProgress(
                            turnover.remainingTurnover,
                            turnover.targetTurnover
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span>
                      Transaction ID: {turnover.transactionId}
                    </span>
                    <span>Created: {formatDate(turnover.createdAt)}</span>
                    {turnover.updatedAt !== turnover.createdAt && (
                      <span>Updated: {formatDate(turnover.updatedAt)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{" "}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
              {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerTurnoverPage;
