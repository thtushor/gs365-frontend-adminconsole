import { FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "./DataTable";

const PlayerListTable = ({ players, onEdit, onDelete }) => {
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
      field: "role",
      headerName: "ROLE",
      width: 100,
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 100,
    },
    {
      field: "created",
      headerName: "CREATED DATE",
      width: 150,
    },
    {
      field: "device_type",
      headerName: "DEVICE TYPE",
      width: 150,
    },
    {
      field: "device_name",
      headerName: "DEVICE NAME",
      width: 150,
    },
    {
      field: "os_version",
      headerName: "OS VERSION",
      width: 150,
    },
    {
      field: "browser",
      headerName: "BROWSER",
      width: 150,
    },
    {
      field: "browser_version",
      headerName: "BROWSER VERSION",
      width: 150,
    },
    {
      field: "ip_address",
      headerName: "IP ADDRESS",
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

  return <DataTable columns={columns} data={players} />;
};

export default PlayerListTable;
