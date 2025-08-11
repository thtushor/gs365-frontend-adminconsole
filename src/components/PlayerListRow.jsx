import { FaEdit, FaTrash } from "react-icons/fa";

const statusColor = {
  Active: "text-green-600",
  Blocked: "text-red-500",
  Suspended: "text-yellow-500",
};

const PlayerListRow = ({ player, idx }) => (
  <tr
    className={`transition hover:bg-green-50 ${
      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
    }`}
  >
    <td className="px-3 py-2 md:px-4 md:py-2  max-w-[120px] truncate">
      {player.name}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2  max-w-[180px] truncate">
      {player.email}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2  max-w-[140px] truncate">
      {player.mobile}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2  max-w-[100px] truncate">
      {player.role}
    </td>
    <td
      className={`px-3 py-2 md:px-4 md:py-2  font-medium ${
        statusColor[player.status] || "text-gray-700"
      }`}
    >
      {player.status}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 max-w-[120px] truncate">
      {player.created}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2  text-center">
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
    </td>
  </tr>
);

export default PlayerListRow;
