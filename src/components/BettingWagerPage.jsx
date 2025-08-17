import { useState } from "react";
import { useBetResults, useGames, useUsers } from "../hooks/useBetResults";
import { FaFilter, FaDownload, FaEye } from "react-icons/fa";
import StatusChip from "./shared/StatusChip";
import Pagination from "./Pagination";

const BettingWagerPage = () => {
  const [filters, setFilters] = useState({
    userId: "",
    gameId: "",
    betStatus: "",
    playingStatus: "",
    dateFrom: "",
    dateTo: "",
    minBetAmount: "",
    maxBetAmount: "",
    gameName: "",
    providerName: "",
    isMobile: "",
    limit: 50,
    offset: 0,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Fetch bet results
  const { data: betResults, isLoading: betResultsLoading, error: betResultsError } = useBetResults({
    ...filters,
    page: currentPage,
    pageSize,
  });

  // Fetch games for filter dropdown
  const { data: gamesData } = useGames();

  // Fetch users for filter dropdown
  const { data: usersData } = useUsers();

  const games = gamesData?.data || [];
  const users = usersData?.users?.data || [];
  const betResultsList = betResults?.data || [];
  const pagination = betResults?.pagination || {};

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setFilters(prev => ({ ...prev, offset: (page - 1) * pageSize }));
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, limit: size, offset: 0 }));
  };

  const handleResetFilters = () => {
    setFilters({
      userId: "",
      gameId: "",
      betStatus: "",
      playingStatus: "",
      dateFrom: "",
      dateTo: "",
      minBetAmount: "",
      maxBetAmount: "",
      gameName: "",
      providerName: "",
      isMobile: "",
      limit: 50,
      offset: 0,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount) => {
    if (!amount || amount === "0.00") return "-";
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const getBetStatusColor = (status) => {
    switch (status) {
      case "win": return "success";
      case "loss": return "error";
      case "pending": return "warning";
      default: return "default";
    }
  };

  const getPlayingStatusColor = (status) => {
    switch (status) {
      case "completed": return "success";
      case "playing": return "warning";
      case "abandoned": return "error";
      default: return "default";
    }
  };

  return (
    <div className="bg-[#f5f5f5] w-full min-h-full p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Betting Wager</h1>
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
            <FaDownload />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-blue-500" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* User Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User
            </label>
            <select
              value={filters.userId}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.fullname || user.username}
                </option>
              ))}
            </select>
          </div>

          {/* Game Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Game
            </label>
            <select
              value={filters.gameId}
              onChange={(e) => handleFilterChange("gameId", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Games</option>
              {games.map(game => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bet Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bet Status
            </label>
            <select
              value={filters.betStatus}
              onChange={(e) => handleFilterChange("betStatus", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Playing Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Playing Status
            </label>
            <select
              value={filters.playingStatus}
              onChange={(e) => handleFilterChange("playingStatus", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="playing">Playing</option>
              <option value="completed">Completed</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Min Bet Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Bet Amount
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.minBetAmount}
              onChange={(e) => handleFilterChange("minBetAmount", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Max Bet Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Bet Amount
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.maxBetAmount}
              onChange={(e) => handleFilterChange("maxBetAmount", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Game Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Game Name
            </label>
            <input
              type="text"
              placeholder="Search game name"
              value={filters.gameName}
              onChange={(e) => handleFilterChange("gameName", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Provider Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider Name
            </label>
            <input
              type="text"
              placeholder="Search provider"
              value={filters.providerName}
              onChange={(e) => handleFilterChange("providerName", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mobile Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Device Type
            </label>
            <select
              value={filters.isMobile}
              onChange={(e) => handleFilterChange("isMobile", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Devices</option>
              <option value="true">Mobile</option>
              <option value="false">Desktop</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {betResultsError && (
          <div className="p-4 text-center text-red-600">
            Error loading bet results: {betResultsError.message}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bet Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loss Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Multiplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bet Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Playing Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bet Placed At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {betResultsLoading ? (
                <tr>
                  <td colSpan="11" className="px-6 py-4 text-center text-gray-500">
                    Loading bet results...
                  </td>
                </tr>
              ) : betResultsList.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-6 py-4 text-center text-gray-500">
                    No bet results found
                  </td>
                </tr>
              ) : (
                betResultsList.map((bet) => (
                  <tr key={bet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bet.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bet.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {bet.gameDetails?.gameLogo && (
                          <img
                            src={bet.gameDetails.gameLogo}
                            alt={bet.gameDetails.name}
                            className="w-8 h-8 rounded mr-2"
                          />
                        )}
                        <span className="text-sm text-gray-900">
                          {bet.gameDetails?.name || bet.gameName || "Unknown Game"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAmount(bet.betAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {formatAmount(bet.winAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {formatAmount(bet.lossAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bet.multiplier}x
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusChip
                        status={bet.betStatus}
                        variant={getBetStatusColor(bet.betStatus)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusChip
                        status={bet.playingStatus}
                        variant={getPlayingStatusColor(bet.playingStatus)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(bet.betPlacedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                        <FaEye />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            pageSize={pageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default BettingWagerPage;
