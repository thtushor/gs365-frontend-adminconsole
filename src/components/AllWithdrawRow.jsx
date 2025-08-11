import { FaEdit, FaTrash } from "react-icons/fa";

const statusColor = {
  Paid: "text-green-600",
  Cancel: "text-yellow-500",
};

const AllWithdrawRow = ({ withdraw, idx }) => (
  <tr
    className={`transition hover:bg-green-50 ${
      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
    }`}
  >
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[80px] truncate">
      {withdraw.player}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[120px] truncate">
      {withdraw.date}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[80px] truncate">
      {withdraw.amount}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[100px] truncate">
      {withdraw.account}
    </td>
    <td className="px-3 py-2 md:px-4 md:py-2 whitespace-nowrap max-w-[100px] truncate">
      {withdraw.method}
    </td>
    <td
      className={`px-3 py-2 md:px-4 md:py-2 whitespace-nowrap font-medium ${
        statusColor[withdraw.status] || "text-gray-700"
      }`}
    >
      {withdraw.status}
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

export default AllWithdrawRow;
