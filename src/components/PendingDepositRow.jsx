import { FaEdit, FaTrash } from "react-icons/fa";

const statusColor = {
  Pending: "text-yellow-500",
};

const PendingDepositRow = ({ deposit, idx }) => (
  <tr
    className={`transition hover:bg-green-50 ${
      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
    }`}
  >
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[80px] truncate">
      {deposit.player}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[120px] truncate">
      {deposit.date}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[100px] truncate">
      {deposit.trxid}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[80px] truncate">
      {deposit.amount}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[120px] truncate">
      {deposit.coverage}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[100px] truncate">
      {deposit.from}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[100px] truncate">
      {deposit.to}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[80px] truncate">
      {deposit.method}
    </td>
    <td
      className={`px-3 py-2 md:px-4 md:py-2 whitespace-nowrap font-medium ${
        statusColor[deposit.status] || "text-gray-700"
      }`}
    >
      {deposit.status}
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

export default PendingDepositRow;
