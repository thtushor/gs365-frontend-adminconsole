import React, { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import DataTable from "./DataTable";

const mockLogins = [
  {
    id: 1,
    user: "admin",
    userId: "U001",
    email: "admin@example.com",
    phone: "+1234567890",
    ip: "192.168.1.10",
    device: "Windows Chrome",
    time: "2024-06-28 10:00",
    status: "Active",
  },
  {
    id: 2,
    user: "agent1",
    userId: "U002",
    email: "agent1@example.com",
    phone: "+1234567891",
    ip: "192.168.1.11",
    device: "Mac Safari",
    time: "2024-06-28 09:45",
    status: "Active",
  },
  {
    id: 3,
    user: "player1",
    userId: "U003",
    email: "player1@example.com",
    phone: "+1234567892",
    ip: "192.168.1.12",
    device: "Android App",
    time: "2024-06-28 09:30",
    status: "Logged Out",
  },
];

const columns = [
  { field: "user", headerName: "User", width: 100 },
  { field: "userId", headerName: "User ID", width: 80 },
  { field: "email", headerName: "Email", width: 160 },
  { field: "phone", headerName: "Phone", width: 120 },
  { field: "ip", headerName: "IP Address", width: 120 },
  { field: "device", headerName: "Device", width: 120 },
  { field: "time", headerName: "Login Time", width: 140 },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    render: (value) =>
      value === "Active" ? (
        <span className="text-green-600 font-semibold">{value}</span>
      ) : value === "Force Logged Out" ? (
        <span className="text-red-600 font-semibold">{value}</span>
      ) : (
        <span className="text-gray-500 font-semibold">{value}</span>
      ),
  },
  {
    field: "action",
    headerName: "Action",
    width: 100,
    align: "center",
    render: (value, row) =>
      row.status === "Active" ? (
        <button
          className="text-red-500 hover:bg-red-50 p-2 rounded"
          title="Force Logout"
          onClick={() => row.onForceLogout(row.id)}
        >
          <FaSignOutAlt />
        </button>
      ) : (
        <span className="text-gray-400">-</span>
      ),
  },
];

const LoginHistoryPage = () => {
  const [logins, setLogins] = useState(mockLogins);

  // Attach the force logout handler to each row for DataTable
  const dataWithActions = logins.map((login) => ({
    ...login,
    onForceLogout: (id) => {
      setLogins((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: "Force Logged Out" } : l
        )
      );
      alert("User has been forcefully logged out (demo)");
    },
  }));

  return (
    <div className="bg-[#f5f5f5] min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">LOGIN HISTORY</h2>
        <button
          className="border border-green-400 text-green-700 px-6 py-2 rounded hover:bg-green-50 transition font-medium"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
      <div className="border border-green-400 rounded-md bg-white p-6 overflow-x-auto">
        <DataTable columns={columns} data={dataWithActions} />
        {logins.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No login history found.
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginHistoryPage;
