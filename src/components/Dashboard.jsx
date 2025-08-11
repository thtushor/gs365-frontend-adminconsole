import DashboardCard from "./DashboardCard";
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
} from "react-icons/fa";

const cards = [
  {
    title: "Total Players",
    value: "10,721",
    icon: <FaUserFriends className="text-3xl" />,
    color: "border-green-400",
    textColor: "text-green-600",
    trend: "up",
  },
  {
    title: "Total Agents",
    value: "672",
    icon: <FaUserPlus className="text-3xl" />,
    color: "border-blue-400",
    textColor: "text-green-600",
    trend: "up",
  },
  {
    title: "Total Deposit",
    value: "৳1,26,56,672",
    icon: <FaMoneyCheckAlt className="text-3xl" />,
    color: "border-purple-400",
    textColor: "text-green-600",
    trend: "up",
  },
  {
    title: "Total Withdraw",
    value: "৳26,56,672",
    icon: <FaWallet className="text-3xl" />,
    color: "border-orange-400",
    textColor: "text-red-600",
    trend: "down",
  },
  {
    title: "Active Players (24h)",
    value: "1,234",
    icon: <FaUsers className="text-3xl" />,
    color: "border-cyan-400",
    textColor: "text-cyan-600",
    trend: "up",
  },
  {
    title: "Online Players",
    value: "98",
    icon: <FaRegClock className="text-3xl" />,
    color: "border-emerald-400",
    textColor: "text-emerald-600",
    trend: "up",
  },
  {
    title: "Pending Deposits",
    value: "12",
    icon: <FaRegCheckCircle className="text-3xl" />,
    color: "border-yellow-400",
    textColor: "text-yellow-600",
    trend: "neutral",
  },
  {
    title: "Pending Withdrawals",
    value: "7",
    icon: <FaRegTimesCircle className="text-3xl" />,
    color: "border-pink-400",
    textColor: "text-pink-600",
    trend: "neutral",
  },
  {
    title: "Total Bets Placed",
    value: "56,789",
    icon: <FaGamepad className="text-3xl" />,
    color: "border-indigo-400",
    textColor: "text-indigo-600",
    trend: "up",
  },
  {
    title: "Total Bets Won",
    value: "32,100",
    icon: <FaTrophy className="text-3xl" />,
    color: "border-green-300",
    textColor: "text-green-500",
    trend: "up",
  },
  {
    title: "Total Bets Lost",
    value: "24,689",
    icon: <FaRegSadTear className="text-3xl" />,
    color: "border-red-300",
    textColor: "text-red-500",
    trend: "down",
  },
  {
    title: "Total Commission Earned",
    value: "৳2,34,567",
    icon: <FaCoins className="text-3xl" />,
    color: "border-yellow-300",
    textColor: "text-yellow-500",
    trend: "up",
  },
  {
    title: "Popular Game (Today)",
    value: "Roulette",
    icon: <FaFire className="text-3xl" />,
    color: "border-orange-300",
    textColor: "text-orange-500",
    trend: "neutral",
  },
  {
    title: "Revenue (This Month)",
    value: "৳12,34,567",
    icon: <FaChartLine className="text-3xl" />,
    color: "border-lime-400",
    textColor: "text-lime-600",
    trend: "up",
  },
  {
    title: "New Registrations (Today)",
    value: "45",
    icon: <FaRegStar className="text-3xl" />,
    color: "border-blue-300",
    textColor: "text-blue-500",
    trend: "up",
  },
  {
    title: "Support Tickets (Open)",
    value: "3",
    icon: <FaRegLifeRing className="text-3xl" />,
    color: "border-fuchsia-400",
    textColor: "text-fuchsia-600",
    trend: "neutral",
  },
  {
    title: "System Health",
    value: "Good",
    icon: <FaHeartbeat className="text-3xl" />,
    color: "border-green-300",
    textColor: "text-green-500",
    trend: "up",
  },
];

const Dashboard = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {cards.map((card, idx) => (
      <DashboardCard key={idx} {...card} index={idx} />
    ))}
  </div>
);

export default Dashboard;
