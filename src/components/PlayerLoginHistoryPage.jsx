import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import DataTable from "./DataTable";
import { FaHistory } from "react-icons/fa";

const PlayerLoginHistoryPage = () => {
  const { playerId } = useParams();

  const {
    data: loginHistory,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["playerLoginHistory", playerId],
    queryFn: async () => {
      const response = await Axios.get(API_LIST.GET_PLAYER_LOGIN_HISTORY.replace(':playerId', playerId));
      if (!response.data.status) {
        throw new Error(response.data.message || "Failed to fetch login history");
      }
      return response.data.data;
    },
    enabled: !!playerId,
  });

  const columns = [
    { field: "ipAddress", headerName: "IP Address", width: 120 },
    { field: "deviceType", headerName: "Device Type", width: 100 },
    { field: "deviceName", headerName: "Device Name", width: 120 },
    { field: "osVersion", headerName: "OS Version", width: 120 },
    { field: "browser", headerName: "Browser", width: 100 },
    { field: "browserVersion", headerName: "Browser Version", width: 120 },
    {
      field: "loginTime",
      headerName: "Login Time",
      width: 160,
      render: (value) => new Date(value).toLocaleString(),
    },
    { field: "userAgent", headerName: "User Agent", width: 200 },
  ];

  if (isLoading) {
    return (
      <div className="bg-[#f5f5f5] min-h-screen p-6">
        <div className="text-center text-gray-500 py-8">Loading login history...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#f5f5f5] min-h-screen p-6">
        <div className="text-center text-red-500 py-8">
          Error loading login history: {error.message}
        </div>
      </div>
    );
  }

  const loginData = loginHistory?.data || [];

  return (
    <div className="bg-[#f5f5f5] min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaHistory /> PLAYER LOGIN HISTORY
        </h2>
        <button
          className="border border-green-400 text-green-700 px-6 py-2 rounded hover:bg-green-50 transition font-medium"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
      <div className="border border-green-400 rounded-md bg-white p-6 overflow-x-auto">
        <DataTable columns={columns} data={loginData} />
        {loginData.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No login history found for this player.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerLoginHistoryPage;