/**
 * Dashboard Component
 * 
 * Displays real-time dashboard statistics fetched from the API.
 * Features:
 * - Real-time data from dashboard API
 * - Beautiful skeleton loading states
 * - Auto-refresh every 5 minutes
 * - Manual refresh with loading states
 * - Error handling with retry functionality
 * - Toast notifications for user feedback
 * - Responsive grid layout
 * - Last updated timestamp
 */

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
  FaUserPlus,
  FaUsers,
  FaCoins,
  FaGamepad,
  FaTrophy,
  FaRegSadTear,
  FaChartLine,
  FaRegClock,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaRegLifeRing,
  FaHeartbeat,
  FaFire,
  FaRegStar,
  // FaGamepadAlt,
} from "react-icons/fa";

// Skeleton loading component
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
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await Axios.get(API_LIST.DASHBOARD);
      if (response.data.success) {
        setDashboardData(response.data.data);
        setLastUpdated(new Date());
        if (isRefresh) {
          toast.success("Dashboard data refreshed successfully!");
        }
      } else {
        setError("Failed to fetch dashboard data");
        if (isRefresh) {
          toast.error("Failed to refresh dashboard data");
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Error loading dashboard data");
      if (isRefresh) {
        toast.error("Error refreshing dashboard data");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Show skeleton loading while data is being fetched initially
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

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Error Loading Dashboard</h3>
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

  // Define cards based on the exact structure shown in the image
  const cards = [
    // Row 1 (2 cards)
    {
      title: "Main Balance",
      value: formatAmount(dashboardData?.mainBalance || "0"),
      icon: <FaCoins className="text-3xl" />,
      color: "border-yellow-400",
      textColor: "text-yellow-600",
      trend: "up",
      subtitle: "System balance"
    },

    {
      title: "Total Deposit",
      value: formatAmount(dashboardData?.totalDeposit || "0"),
      icon: <FaMoneyCheckAlt className="text-3xl" />,
      color: "border-green-400",
      textColor: "text-green-600",
      trend: "up",
      subtitle: "All time deposits"
    },
    {
      title: "Total Withdraw",
      value: formatAmount(dashboardData?.totalWithdraw || "0"),
      icon: <FaWallet className="text-3xl" />,
      color: "border-orange-400",
      textColor: "text-orange-600",
      trend: "down",
      subtitle: "All time withdrawals"
    },

    {
      title: "Total Bonus",
      value: formatAmount(dashboardData?.totalBonusAmount || "0"),
      icon: <FaMoneyCheckAlt className="text-3xl" />,
      color: "border-green-400",
      textColor: "text-green-600",
      trend: "up",
      subtitle: "All time deposits"
    },

       
    // Row 3 (4 cards)
    {
      title: "Player Pending Deposit",
      value: formatAmount(dashboardData?.pendingDeposit || "0"),
      icon: <FaRegCheckCircle className="text-3xl" />,
      color: "border-yellow-400",
      textColor: "text-yellow-600",
      trend: "neutral",
      subtitle: "Awaiting approval"
    },
    {
      title: "Player Pending Withdraw",
      value: formatAmount(dashboardData?.pendingWithdraw || "0"),
      icon: <FaRegTimesCircle className="text-3xl" />,
      color: "border-pink-400",
      textColor: "text-pink-600",
      trend: "neutral",
      subtitle: "Awaiting approval"
    },
    {
      title: "Total Bonus coin",
      value: formatAmount(dashboardData?.totalBonusCoin || "0"),
      icon: <FaRegStar className="text-3xl" />,
      color: "border-purple-400",
      textColor: "text-purple-600",
      trend: "neutral",
      subtitle: "Bonus distributed"
    },
    {
      title: "Total Discount coin",
      value: formatAmount(dashboardData?.totalDiscountCoin || "0"),
      icon: <FaCoins className="text-3xl" />,
      color: "border-blue-400",
      textColor: "text-blue-600",
      trend: "neutral",
      subtitle: "Discount coins"
    },
  
    {
      title: "Total Profit",
      value: formatAmount((dashboardData?.totalBetWin || 0) - (dashboardData?.totalBetLost || 0)),
      icon: <FaChartLine className="text-3xl" />,
      color: "border-green-400",
      textColor: "text-green-600",
      trend: "up",
      subtitle: "Net profit from betting"
    },
    
    // Row 2 (4 cards)
    {
      title: "Total Win",
      value: formatAmount(dashboardData?.totalBetWin || "0"),
      icon: <FaTrophy className="text-3xl" />,
      color: "border-green-400",
      textColor: "text-green-600",
      trend: "up",
      subtitle: "Total winnings"
    },
    {
      title: "Total Loss",
      value: formatAmount(dashboardData?.totalBetLost || "0"),
      icon: <FaRegSadTear className="text-3xl" />,
      color: "border-red-400",
      textColor: "text-red-600",
      trend: "down",
      subtitle: "Total losses"
    },
   
 
    
    // Row 4 (4 cards)
    {
      title: "Total Affiliates",
      value: dashboardData?.totalAffiliate?.toLocaleString() || "0",
      icon: <FaUsers className="text-3xl" />,
      color: "border-purple-400",
      textColor: "text-purple-600",
      trend: "up",
      subtitle: "Affiliate partners"
    },
    {
      title: "Total Super Affiliates",
      value: dashboardData?.totalSuperAffiliate?.toLocaleString() || "0",
      icon: <FaUsers className="text-3xl" />,
      color: "border-purple-400",
      textColor: "text-purple-600",
      trend: "up",
      subtitle: "Affiliate partners"
    },
    {
      title: "Total Sub Affiliates",
      value: dashboardData?.totalSubAffiliate?.toLocaleString() || "0",
      icon: <FaUsers className="text-3xl" />,
      color: "border-purple-400",
      textColor: "text-purple-600",
      trend: "up",
      subtitle: "Affiliate partners"
    },
    {
      title: "Total Agent",
      value: dashboardData?.totalAgent?.toLocaleString() || "0",
      icon: <FaUserPlus className="text-3xl" />,
      color: "border-blue-400",
      textColor: "text-blue-600",
      trend: "up",
      subtitle: "Active agents"
    },
    {
      title: "Total Super Agent",
      value: dashboardData?.totalSuperAgent?.toLocaleString() || "0",
      icon: <FaUserPlus className="text-3xl" />,
      color: "border-blue-400",
      textColor: "text-blue-600",
      trend: "up",
      subtitle: "Active agents"
    },
    {
      title: "Total Sub Agent",
      value: dashboardData?.totalSubAgent?.toLocaleString() || "0",
      icon: <FaUserPlus className="text-3xl" />,
      color: "border-blue-400",
      textColor: "text-blue-600",
      trend: "up",
      subtitle: "Active agents"
    },
    {
      title: "Total Players",
      value: dashboardData?.totalPlayers?.toLocaleString() || "0",
      icon: <FaUserFriends className="text-3xl" />,
      color: "border-green-400",
      textColor: "text-green-600",
      trend: "up",
      subtitle: "Registered users"
    },
    {
      title: "Online Players",
      value: dashboardData?.totalOnlinePlayers?.toLocaleString() || "0",
      icon: <FaRegClock className="text-3xl" />,
      color: "border-emerald-400",
      textColor: "text-emerald-600",
      trend: "up",
      subtitle: "Currently online"
    },
    
    // Row 5 (4 cards)
    {
      title: "Total Bet Placed",
      value: formatAmount(dashboardData?.totalBetPlaced || "0"),
      icon: <FaGamepad className="text-3xl" />,
      color: "border-indigo-400",
      textColor: "text-indigo-600",
      trend: "up",
      subtitle: "All time bets"
    },
    {
      title: "Total Bet Win",
      value: formatAmount(dashboardData?.totalBetWin || "0"),
      icon: <FaTrophy className="text-3xl" />,
      color: "border-green-300",
      textColor: "text-green-500",
      trend: "up",
      subtitle: "Successful bets"
    },
    {
      title: "Total Bet Lost",
      value: formatAmount(dashboardData?.totalBetLost || "0"),
      icon: <FaRegSadTear className="text-3xl" />,
      color: "border-red-300",
      textColor: "text-red-500",
      trend: "down",
      subtitle: "Unsuccessful bets"
    },
    {
      title: "Total Game Providers Payment",
      value: formatAmount(dashboardData?.totalGameProvidersPayment || "0"),
      icon: <FaChartLine className="text-3xl" />,
      color: "border-lime-400",
      textColor: "text-lime-600",
      trend: "up",
      subtitle: "Paid to game providers"
    },
    
    // Row 6 (4 cards)
    {
      title: "Total Sports Provider Payment",
      value: formatAmount(dashboardData?.totalSportsProvidersPayment || "0"),
      icon: <FaFire className="text-3xl" />,
      color: "border-orange-400",
      textColor: "text-orange-600",
      trend: "up",
      subtitle: "Paid to sports providers"
    },
    {
      title: "Game Provider Pending Payment",
      value: formatAmount(dashboardData?.gameProviderPendingPayment || "0"),
      icon: <FaRegClock className="text-3xl" />,
      color: "border-amber-400",
      textColor: "text-amber-600",
      trend: "neutral",
      subtitle: "Pending payments"
    },
    {
      title: "Sports Provider Pending Payment",
      value: formatAmount(dashboardData?.sportsProviderPendingPayment || "0"),
      icon: <FaRegClock className="text-3xl" />,
      color: "border-amber-400",
      textColor: "text-amber-600",
      trend: "neutral",
      subtitle: "Pending payments"
    },
    {
      title: "Total Games",
      value: dashboardData?.totalGames?.toLocaleString() || "0",
      icon: <FaGamepad className="text-3xl" />,
      color: "border-blue-400",
      textColor: "text-blue-600",
      trend: "neutral",
      subtitle: "Available games"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Real-time statistics and insights</p>
            <div className="flex items-center gap-4 mt-1">
              {lastUpdated && (
                <p className="text-xs text-gray-400">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}
              <p className="text-xs text-gray-400">
                Showing {cards.length} metrics
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={loading || refreshing}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              loading || refreshing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
            }`}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
      
      {/* Dashboard Cards Grid */}
      <div className="relative">
        {refreshing && dashboardData && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600">Refreshing data...</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <DashboardCard key={idx} {...card} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
