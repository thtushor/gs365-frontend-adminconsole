import { useState, useEffect } from "react";
import DashboardCard from "./DashboardCard";
import { API_LIST } from "../api/ApiList";
import Axios from "../api/axios";
import { toast } from "react-toastify";
import { formatAmount } from "./BettingWagerPage";
import {
  FaUserFriends,
  FaMoneyCheckAlt,
  FaWallet,
  FaUsers,
  FaCoins,
  FaGamepad,
  FaTrophy,
  FaRegSadTear,
  FaChartLine,
  FaRegClock,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaHeartbeat,
} from "react-icons/fa";

// Skeleton card
const DashboardCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-gray-300 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-200 rounded w-24"></div>
      <div className="h-8 w-8 bg-gray-200 rounded"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-16"></div>
  </div>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);
      const response = await Axios.get(API_LIST.DASHBOARD);

      if (response.data.success) {
        setDashboardData(response.data.data);
        setLastUpdated(new Date());
        if (isRefresh) toast.success("Dashboard data refreshed successfully!");
      } else {
        setError("Failed to fetch dashboard data");
        if (isRefresh) toast.error("Failed to refresh dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Error loading dashboard data");
      if (isRefresh) toast.error("Error refreshing dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 23 }).map((_, idx) => (
            <DashboardCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Organized rows
  const rows = [
    // Row 1 (2 cards)
    [
      { title: "Main Balance", value: formatAmount(dashboardData?.mainBalance || 0), icon: <FaCoins />, color: "border-yellow-400" },
      { title: "Total Company Profit", value: formatAmount(dashboardData?.companyProfit || 0), icon: <FaChartLine />, color: "border-green-400" },
    ],
    // Row 2 (3 cards)
    [
      { title: "Total Player Deposit", value: formatAmount(dashboardData?.totalDeposit || 0), icon: <FaMoneyCheckAlt />, color: "border-green-400" },
      { title: "Total Player Bonus Deposit", value: formatAmount(dashboardData?.totalBonusAmount || 0), icon: <FaCoins />, color: "border-indigo-400" },
      { title: "Total Player Withdraw", value: formatAmount(dashboardData?.totalWithdraw || 0), icon: <FaWallet />, color: "border-orange-400" },
    ],
    // Row 3 (4 cards)
    [
      { title: "Total Player", value: dashboardData?.totalPlayers?.toLocaleString() || "0", icon: <FaUserFriends />, color: "border-green-400" },
      { title: "Total Online Player", value: dashboardData?.totalOnlinePlayers?.toLocaleString() || "0", icon: <FaRegClock />, color: "border-emerald-400" },
      { title: "Total Player Pending Deposit", value: formatAmount(dashboardData?.pendingDeposit || 0), icon: <FaRegCheckCircle />, color: "border-yellow-400" },
      { title: "Total Player Pending Withdraw", value: formatAmount(dashboardData?.pendingWithdraw || 0), icon: <FaRegTimesCircle />, color: "border-pink-400" },
    ],
    // Row 4 (5 cards)
    [
      { title: "Total Player Bet Amount", value: formatAmount(dashboardData?.totalBetAmount || 0), icon: <FaTrophy />, color: "border-green-400" },
      { title: "Total Player Win", value: formatAmount(dashboardData?.totalBetWin || 0), icon: <FaTrophy />, color: "border-green-400" },
      { title: "Total Player Loss", value: formatAmount(dashboardData?.totalBetLost || 0), icon: <FaRegSadTear />, color: "border-red-400" },
      { title: "Total Admin Deposit", value: formatAmount(dashboardData?.totalAdminDeposit || 0), icon: <FaMoneyCheckAlt />, color: "border-blue-400" },
      // { title: "Total Admin Withdraw", value: formatAmount(dashboardData?.totalAdminWithdraw || 0), icon: <FaWallet />, color: "border-orange-400" },
    ],
    // Row 5 (4 cards)
    [
      { title: "Total Super Aff", value: dashboardData?.totalSuperAffiliate?.toLocaleString() || "0", icon: <FaUsers />, color: "border-purple-400" },
      { title: "Total Sub Aff", value: dashboardData?.totalSubAffiliate?.toLocaleString() || "0", icon: <FaUsers />, color: "border-purple-400" },
      { title: "Total Aff Withdraw", value: formatAmount(dashboardData?.totalAffiliateWithdrawal || 0), icon: <FaCoins />, color: "border-blue-400" },
      { title: "Total Aff Withdraw Pending", value: formatAmount(dashboardData?.totalAffiliateWithdrawalPending || 0), icon: <FaRegClock />, color: "border-amber-400" },
    ],
    // Row 6 (4 cards)
      [
        { title: "Total Parent Game Provider", value: dashboardData?.totalParentGameProviders?.toLocaleString() || "0", icon: <FaGamepad />, color: "border-indigo-400" },
        { title: "Total Sub Game Provider", value: dashboardData?.totalSubGameProviders?.toLocaleString() || "0", icon: <FaGamepad />, color: "border-indigo-400" },
      { title: "Total Game Provider Deposit", value: formatAmount(dashboardData?.totalGameProviderDeposit || 0), icon: <FaMoneyCheckAlt />, color: "border-green-400" },
      { title: "Total Game", value: dashboardData?.totalGames?.toLocaleString() || "0", icon: <FaGamepad />, color: "border-blue-400" },
    ],
    // Row 7 (4 cards)
    [
      { title: "Total Active Game", value: dashboardData?.totalActiveGames?.toLocaleString() || "0", icon: <FaGamepad />, color: "border-green-400" },
      { title: "Total Inactive Game", value: dashboardData?.totalInactiveGames?.toLocaleString() || "0", icon: <FaGamepad />, color: "border-red-400" },
      { title: "Total Player KYC Verified", value: dashboardData?.totalPlayerKycVerified?.toLocaleString() || "0", icon: <FaRegCheckCircle />, color: "border-green-500" },
      { title: "Total Aff KYC Verified", value: dashboardData?.totalAffKycVerified?.toLocaleString() || "0", icon: <FaRegCheckCircle />, color: "border-green-500" },
    ],
    // Row 8 (4 cards)
    [
      { title: "Total Parent Sports Provider", value: dashboardData?.totalParentSportsProvider?.toLocaleString() || "0", icon: <FaHeartbeat />, color: "border-orange-400" },
      { title: "Total Sub Sports Provider", value: dashboardData?.totalSubSportsProvider?.toLocaleString() || "0", icon: <FaHeartbeat />, color: "border-orange-400" },
      { title: "Total Sports Active Game", value: dashboardData?.totalSportsActiveGame?.toLocaleString() || "0", icon: <FaHeartbeat />, color: "border-green-400" },
      { title: "Total Sports Inactive Game", value: dashboardData?.totalSportsInactiveGame?.toLocaleString() || "0", icon: <FaHeartbeat />, color: "border-red-400" },
    ],
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Real-time statistics and insights</p>
          {lastUpdated && <p className="text-xs text-gray-400 mt-1">Last updated: {lastUpdated.toLocaleString()}</p>}
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={loading || refreshing}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            loading || refreshing ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Rows */}
      {rows.map((row, rIdx) => (
        <div key={rIdx} className={`grid gap-6 ${row.length>0 ? `grid-cols-1 md:grid-cols-${row.length}` : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
          {row.map((card, cIdx) => (
            <DashboardCard key={cIdx} {...card} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
