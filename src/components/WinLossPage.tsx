import React, { useState, useMemo } from "react";
import { FaFilter } from "react-icons/fa";
import Pagination from "./Pagination";
import { usePlayerRankings, useGames, useUsers } from "../hooks/useBetResults";

interface PlayerRanking {
  userId: number;
  user?: {
    id: number;
    username: string;
    fullname: string;
  };
  game?: {
    id: number;
    name: string;
  };
  rank: number;
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  totalWinAmount: number;
  totalLossAmount: number;
  totalBetAmount: number;
  winRate: number;
  totalProfit: number;
  avgBetAmount: number;
  lastPlayed: string;
}

interface RankingsResponse {
  data: PlayerRanking[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const WinLossPage = () => {
  const [filters, setFilters] = useState({
    rankBy: "totalWins" as "totalWins" | "totalWinAmount" | "winRate" | "totalProfit",
    sortOrder: "desc" as "asc" | "desc",
    pageSize: 50,
    page: 1,
    dateFrom: "",
    dateTo: "",
    gameId: "",
    userId: "",
    minGames: 1,
    includeStats: "true",
  });

  const { data: gamesData } = useGames();
  const { data: usersData } = useUsers();

  const { data, isLoading, error } = usePlayerRankings(filters, { keepPreviousData: true });

  const games = gamesData?.data || [];
  const users = usersData?.users?.data || [];
  const rankings = (data as RankingsResponse)?.data || [];
  const pagination = (data as RankingsResponse)?.pagination || {};

  const totalPages = useMemo(() => {
    const total = pagination?.total ?? 0;
    const size = Number(filters.pageSize) || 1;
    return Math.max(1, Math.ceil(total / size));
  }, [pagination, filters.pageSize]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key === "pageSize" ? 1 : prev.page }));
  };

  const handleReset = () => {
    setFilters({
      rankBy: "totalWins",
      sortOrder: "desc",
      pageSize: 50,
      page: 1,
      dateFrom: "",
      dateTo: "",
      gameId: "",
      userId: "",
      minGames: 1,
      includeStats: "true",
    });
  };

  const formatAmount = (amount: any) => {
    if (amount === null || amount === undefined) return "-";
    const num = Number(amount);
    if (Number.isNaN(num)) return "-";
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="bg-[#f5f5f5] w-full min-h-full p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Win / Loss Rankings</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-blue-500" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rank By</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.rankBy}
              onChange={(e) => handleFilterChange("rankBy", e.target.value)}
            >
              <option value="totalWins">Total Wins</option>
              <option value="totalWinAmount">Total Win Amount</option>
              <option value="winRate">Win Rate</option>
              <option value="totalProfit">Total Profit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Game</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.gameId}
              onChange={(e) => handleFilterChange("gameId", e.target.value)}
            >
              <option value="">All Games</option>
              {games.map((game: any) => (
                <option key={game.id} value={game.id}>{game.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.userId}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
            >
              <option value="">All Users</option>
              {(users as any[]).map((user: any) => (
                <option key={user.id} value={user.id}>{user.fullname || user.username}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Games</label>
            <input
              type="number"
              min={0}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.minGames}
              onChange={(e) => handleFilterChange("minGames", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Include Stats</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.includeStats}
              onChange={(e) => handleFilterChange("includeStats", e.target.value)}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rows per page</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.pageSize}
              onChange={(e) => handleFilterChange("pageSize", Number(e.target.value))}
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {error && (
          <div className="p-4 text-center text-red-600">
            Error loading rankings: {(error as any).message}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wins</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Losses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loss Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Bet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Played</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={13} className="px-6 py-4 text-center text-gray-500">Loading rankings...</td>
                </tr>
              ) : rankings.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-6 py-4 text-center text-gray-500">No data found</td>
                </tr>
              ) : (
                rankings.map((row: PlayerRanking) => (
                  <tr key={`${row.userId}-${row.rank}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.rank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.user?.fullname || row.user?.username || row.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.game?.name || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.totalBets}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-medium">{row.totalWins}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700 font-medium">{row.totalLosses}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.winRate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatAmount(row.totalBetAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-medium">{formatAmount(row.totalWinAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700 font-medium">{formatAmount(row.totalLossAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatAmount(row.totalProfit)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatAmount(row.avgBetAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.lastPlayed || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - placed below the table */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            pageSize={filters.pageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
            onPageSizeChange={(size) => setFilters(prev => ({ ...prev, pageSize: size, page: 1 }))}
          />
        </div>
      )}
    </div>
  );
};

export default WinLossPage;


