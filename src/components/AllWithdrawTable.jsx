import { FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "./DataTable";

const statusColor = {
  Paid: "text-green-600",
  Cancel: "text-yellow-500",
};

const AllWithdrawTable = ({ withdraws }) => {
  const columns = [
    {
      field: "player",
      headerName: "PLAYER",
      width: 100,
    },
    {
      field: "date",
      headerName: "DATE",
      width: 120,
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      width: 100,
    },
    {
      field: "account",
      headerName: "ACCOUNT",
      width: 150,
    },
    {
      field: "method",
      headerName: "METHOD",
      width: 100,
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 100,
      render: (value) => (
        <span
          className={`font-medium ${statusColor[value] || "text-gray-700"}`}
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
      render: () => (
        <div className="flex justify-center gap-2">
          <button
            className="inline-flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full p-2 transition md:p-1 mr-2"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            className="inline-flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full p-2 transition md:p-1"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={withdraws} />;
};

export default AllWithdrawTable;
