import PendingWithdrawFilter from "./PendingWithdrawFilter";
import PendingWithdrawTable from "./PendingWithdrawTable";

const mockWithdraws = [
  {
    player: "#123",
    date: "13 Jan 2025",
    amount: "৳500",
    to: "#########",
    method: "Bkash",
    status: "Pending",
  },
  {
    player: "#123",
    date: "13 Jan 2025",
    amount: "৳500",
    to: "#########",
    method: "Nagad",
    status: "Pending",
  },
  {
    player: "#123",
    date: "13 Jan 2025",
    amount: "৳500",
    to: "#########",
    method: "MasterCard",
    status: "Pending",
  },
  {
    player: "#123",
    date: "13 Jan 2025",
    amount: "৳500",
    to: "#########",
    method: "Bkash",
    status: "Pending",
  },
];

const PendingWithdrawPage = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">PENDING WITHDRAW</h2>
        <button className="border border-green-400 text-green-500 px-4 py-1 rounded hover:bg-green-50 transition text-sm font-medium">
          Print
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <PendingWithdrawFilter />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <PendingWithdrawTable withdraws={mockWithdraws} />
      </div>
    </div>
  );
};

export default PendingWithdrawPage;
