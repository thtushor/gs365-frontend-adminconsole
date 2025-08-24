import { FaDollarSign, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "./DataTable";

const PlayerListTable = ({ players, onEdit, onDelete, onSelect }) => {
  const columns = [
    {
      field: "id",
      headerName: "Player ID",
      width: 100,
    },
    {
      field: "fullname",
      headerName: "FULLNAME",
      width: 200,
      render: (value, row) => (
        <button
          onClick={() => onSelect && onSelect(row)}
          className="text-green-500 hover:text-green-700 font-medium cursor-pointer hover:underline"
        >
          {value}
        </button>
      ),
    },
    {
      field: "username",
      headerName: "USERNAME",
      width: 200,
    },
    {
      field: "email",
      headerName: "EMAIL",
      width: 250,
    },
    {
      field: "phone",
      headerName: "PHONE",
      width: 150,
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 100,
    },
    {
      field: "isVerified",
      headerName: "VERIFIED",
      width: 100,
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      field: "currencyCode",
      headerName: "CURRENCY",
      width: 120,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">{row.currencyName}</div>
        </div>
      ),
    },
    {
      field: "userReferrerName",
      headerName: "REF BY PLAYER",
      width: 150,
      render: (value, row) => (
        <div>
          {value ? (
            <>
              <div className="font-medium">{value}</div>
              <div className="text-xs text-gray-500">@{row.userReferrerUsername}</div>
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      field: "affiliateName",
      headerName: "AFFILIATE",
      width: 150,
      render: (value, row) => (
        <div>
          {value ? (
            <>
              <div className="font-medium">{value}</div>
              <div className="text-xs text-gray-500">{row.affiliateRole}</div>
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      field: "agentName",
      headerName: "AGENT",
      width: 150,
      render: (value, row) => (
        <div>
          {value ? (
            <>
              <div className="font-medium">{value}</div>
              <div className="text-xs text-gray-500">{row.agentRole}</div>
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      field: "totalBalance",
      headerName: "BALANCE",
      width: 120,
      render: (value) => (
        <span className="font-medium text-green-600">${value || 0}</span>
      ),
    },
    {
      field: "totalDeposits",
      headerName: "DEPOSITS",
      width: 120,
      render: (value) => (
        <span className="font-medium text-blue-600">${value || 0}</span>
      ),
    },
    {
      field: "totalWithdrawals",
      headerName: "WITHDRAWALS",
      width: 120,
      render: (value) => (
        <span className="font-medium text-orange-600">${value || 0}</span>
      ),
    },
    {
      field: "totalWins",
      headerName: "WINS",
      width: 100,
      render: (value) => (
        <span className="font-medium text-green-600">${value || 0}</span>
      ),
    },
    {
      field: "totalLosses",
      headerName: "LOSSES",
      width: 100,
      render: (value) => (
        <span className="font-medium text-red-600">${value || 0}</span>
      ),
    },
    {
      field: "pendingDeposits",
      headerName: "PENDING DEP",
      width: 120,
      render: (value) => (
        <span className="font-medium text-yellow-600">${value || 0}</span>
      ),
    },
    {
      field: "pendingWithdrawals",
      headerName: "PENDING WIT",
      width: 120,
      render: (value) => (
        <span className="font-medium text-yellow-600">${value || 0}</span>
      ),
    },
    {
      field: "device_type",
      headerName: "DEVICE TYPE",
      width: 120,
    },
    {
      field: "ip_address",
      headerName: "IP ADDRESS",
      width: 150,
    },
    {
      field: "created",
      headerName: "CREATED DATE",
      width: 150,
    },
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      align: "center",
      render: (value, row) => (
        <div className="flex justify-center gap-2">
          <button
            className="inline-flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full p-2 transition md:p-1 mr-2"
            title="Edit"
            // onClick={() => onEdit && onEdit(row)}
          >
            <FaDollarSign />
          </button>
          <button
            className="inline-flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full p-2 transition md:p-1 mr-2"
            title="Edit"
            onClick={() => onEdit && onEdit(row)}
          >
            <FaEdit />
          </button>
          <button
            className="inline-flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full p-2 transition md:p-1"
            title="Delete"
            onClick={() => onDelete && onDelete(row)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable 
      columns={columns} 
      data={players} 
      onRowClick={onSelect}
      selectable={false}
    />
  );
};

export default PlayerListTable;
