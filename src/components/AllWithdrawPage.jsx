import AllWithdrawFilter from "./AllWithdrawFilter";
import AllWithdrawTable from "./AllWithdrawTable";

const mockWithdraws = [
  {
    player: "#123",
    date: "13 Jan 2025",
    amount: "৳500",
    account: "#########",
    method: "Bkash",
    status: "Paid",
  },
  {
    player: "#123",
    date: "13 Jan 2025",
    amount: "৳500",
    account: "#########",
    method: "Nagad",
    status: "Paid",
  },
  {
    player: "#123",
    date: "13 Jan 2025",
    amount: "৳500",
    account: "#########",
    method: "MasterCard",
    status: "Cancel",
  },
  {
    player: "#123",
    date: "13 Jan 2025",
    amount: "৳500",
    account: "#########",
    method: "Bkash",
    status: "Paid",
  },
];

const AllWithdrawPage = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">ALL WITHDRAW</h2>
        <button className="border border-green-400 text-green-500 px-4 py-1 rounded hover:bg-green-50 transition text-sm font-medium">
          Print
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <AllWithdrawFilter />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <AllWithdrawTable withdraws={mockWithdraws} />
      </div>
    </div>
  );
};

export default AllWithdrawPage;
