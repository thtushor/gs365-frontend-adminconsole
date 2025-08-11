import { FaEdit, FaTrash } from "react-icons/fa";

const statusColor = {
  Won: "text-green-600",
  Lost: "text-red-500",
  Refund: "text-blue-500",
  Cashout: "text-yellow-500",
};

const BetListRow = ({ bet, idx }) => (
  <tr
    className={`transition hover:bg-green-50 ${
      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
    }`}
  >
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[80px] truncate">
      {bet.player}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[60px] truncate">
      {bet.bid}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[60px] truncate">
      {bet.stake}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[120px] truncate">
      {bet.date}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[80px] truncate">
      {bet.returnAmount}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[80px] truncate">
      {bet.league}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[120px] truncate">
      {bet.match}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[80px] truncate">
      {bet.betName}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[80px] truncate">
      {bet.selection}
    </td>
    <td
      className={`px-3 py-2 md:px-4 md:py-2 whitespace-nowrap font-medium ${
        statusColor[bet.status] || "text-gray-700"
      }`}
    >
      {bet.status}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap text-center">
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

export default BetListRow;
