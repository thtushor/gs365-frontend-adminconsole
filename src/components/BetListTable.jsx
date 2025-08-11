import { FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "./DataTable";

const statusColor = {
  Won: "text-green-600",
  Lost: "text-red-500",
  Refund: "text-blue-500",
  Cashout: "text-yellow-500",
};

const BetListTable = ({ bets }) => {
  const columns = [
    {
      field: "player",
      headerName: "PLAYER",
      width: 100,
    },
    {
      field: "bid",
      headerName: "BID",
      width: 80,
    },
    {
      field: "stake",
      headerName: "STAKE",
      width: 80,
    },
    {
      field: "date",
      headerName: "DATE",
      width: 120,
    },
    {
      field: "returnAmount",
      headerName: "RETURN AMOUNT",
      width: 120,
    },
    {
      field: "league",
      headerName: "LEAGUE",
      width: 100,
    },
    {
      field: "match",
      headerName: "MATCH",
      width: 120,
    },
    {
      field: "betName",
      headerName: "BET NAME",
      width: 100,
    },
    {
      field: "selection",
      headerName: "SELECTION",
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

  return <DataTable columns={columns} data={bets} />;
};

export default BetListTable;
