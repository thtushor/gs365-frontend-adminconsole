import React from "react";
import DataTable from "./DataTable";
import ThumbnailImage from "./ThumbnailImage";

const mockProviders = [
  {
    logo: "https://via.placeholder.com/40?text=Logo1",
    name: "Provider One",
    key: "KEY123",
    ip: "192.168.1.1",
  },
  {
    logo: "https://via.placeholder.com/40?text=Logo2",
    name: "Provider Two",
    key: "KEY456",
    ip: "192.168.1.2",
  },
];

const columns = [
  {
    field: "logo",
    headerName: "LOGO",
    width: 60,
    render: (value) => <ThumbnailImage src={value} size={40} />,
  },
  { field: "name", headerName: "PROVIDER NAME", width: 160 },
  { field: "key", headerName: "PROVIDER KEY", width: 120 },
  { field: "ip", headerName: "PROVIDER IP", width: 120 },
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
          Edit
        </button>
        <button
          className="text-red-500 hover:bg-red-50 p-1 rounded"
          title="Delete"
        >
          Delete
        </button>
      </div>
    ),
  },
];

const ProviderList = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">PROVIDER LIST</h2>
        <button
          className="border border-green-400 text-green-700 px-6 py-2 rounded hover:bg-green-50 transition font-medium"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
      <div className="border border-green-400 rounded-md bg-white p-6 overflow-x-auto">
        <DataTable columns={columns} data={mockProviders} />
        {mockProviders.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No providers found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderList;
