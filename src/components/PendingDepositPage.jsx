import PendingDepositFilter from "./PendingDepositFilter";
import PendingDepositTable from "./PendingDepositTable";

const mockDeposits = [
  {
    player: "#123",
    date: "13 Jan 2025",
    trxid: "#########",
    amount: "৳500",
    coverage: "৳500",
    from: "#########",
    to: "#########",
    method: "VISA",
    status: "Pending",
  },
  {
    player: "#123",
    date: "13 Jan 2025",
    trxid: "#########",
    amount: "৳500",
    coverage: "৳500",
    from: "#########",
    to: "#########",
    method: "VISA",
    status: "Pending",
  },
  {
    player: "#123",
    date: "13 Jan 2025",
    trxid: "#########",
    amount: "৳500",
    coverage: "৳500",
    from: "#########",
    to: "#########",
    method: "VISA",
    status: "Pending",
  },
  {
    player: "#123",
    date: "13 Jan 2025",
    trxid: "#########",
    amount: "৳500",
    coverage: "৳500",
    from: "#########",
    to: "#########",
    method: "VISA",
    status: "Pending",
  },
];

const PendingDepositPage = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">PENDING DEPOSIT LIST</h2>
        <button className="border border-green-400 text-green-500 px-4 py-1 rounded hover:bg-green-50 transition text-sm font-medium">
          Print
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <PendingDepositFilter />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <PendingDepositTable deposits={mockDeposits} />
      </div>
    </div>
  );
};

export default PendingDepositPage;
