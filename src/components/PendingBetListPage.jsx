import BetListTable from "./BetListTable";

const mockPendingBets = [
  {
    player: "#123",
    bid: "###",
    stake: "###",
    date: "13 Jan 2025",
    returnAmount: "৳500",
    league: "EURO",
    match: "BRA vs ARG",
    betName: "###",
    selection: "###",
    status: "Pending",
  },
  {
    player: "#123",
    bid: "###",
    stake: "###",
    date: "13 Jan 2025",
    returnAmount: "৳500",
    league: "EURO",
    match: "BRA vs ARG",
    betName: "###",
    selection: "###",
    status: "Pending",
  },
  {
    player: "#123",
    bid: "###",
    stake: "###",
    date: "13 Jan 2025",
    returnAmount: "৳500",
    league: "EURO",
    match: "BRA vs ARG",
    betName: "###",
    selection: "###",
    status: "Pending",
  },
  {
    player: "#123",
    bid: "###",
    stake: "###",
    date: "13 Jan 2025",
    returnAmount: "৳500",
    league: "EURO",
    match: "BRA vs ARG",
    betName: "###",
    selection: "###",
    status: "Pending",
  },
];

const PendingBetListPage = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">PENDING BETS</h2>
        <button className="border border-green-400 text-green-500 px-4 py-1 rounded hover:bg-green-50 transition text-sm font-medium">
          Print
        </button>
      </div>
      <form className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Player ID"
          className="border rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <input
          type="text"
          placeholder="Mobile Number"
          className="border rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <input
          type="text"
          placeholder="Bet ID"
          className="border rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition text-sm font-medium"
        >
          Apply
        </button>
        <input
          type="text"
          placeholder="Search keywords..."
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[180px] ml-4 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
      </form>
      <div className="bg-white rounded-lg shadow p-4">
        <BetListTable bets={mockPendingBets} />
      </div>
    </div>
  );
};

export default PendingBetListPage;
