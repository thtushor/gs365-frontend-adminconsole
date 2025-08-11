import BetListFilter from "./BetListFilter";
import BetListTable from "./BetListTable";

const mockBets = [
  {
    player: "#123",
    bid: "##",
    stake: "###",
    date: "13 Jan 2025",
    returnAmount: "৳500",
    league: "EURO",
    match: "BRA vs ARG",
    betName: "###",
    selection: "###",
    status: "Won",
  },
  {
    player: "#123",
    bid: "##",
    stake: "###",
    date: "13 Jan 2025",
    returnAmount: "৳500",
    league: "EURO",
    match: "BRA vs ARG",
    betName: "###",
    selection: "###",
    status: "Lost",
  },
  {
    player: "#123",
    bid: "##",
    stake: "###",
    date: "13 Jan 2025",
    returnAmount: "৳500",
    league: "EURO",
    match: "BRA vs ARG",
    betName: "###",
    selection: "###",
    status: "Refund",
  },
  {
    player: "#123",
    bid: "##",
    stake: "###",
    date: "13 Jan 2025",
    returnAmount: "৳500",
    league: "EURO",
    match: "BRA vs ARG",
    betName: "###",
    selection: "###",
    status: "Cashout",
  },
];

const BetListPage = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">BETS LIST</h2>
        <button className="border border-green-400 text-green-500 px-4 py-1 rounded hover:bg-green-50 transition text-sm font-medium">
          Print
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <BetListFilter />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <BetListTable bets={mockBets} />
      </div>
    </div>
  );
};

export default BetListPage;
