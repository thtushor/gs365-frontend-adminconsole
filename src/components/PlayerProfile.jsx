import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import Axios from "../api/axios";
import {
  FaUser,
  FaExchangeAlt,
  FaDice,
  FaGamepad,
  FaEdit,
} from "react-icons/fa";
import PlayerProfileStats from "./PlayerProfileStats";
import ReusableModal from "./ReusableModal";
import PlayerForm from "./PlayerForm";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import KycRequestButton from "../Utils/KycRequestButton";
import PlayerPasswordChange from "./PlayerPasswordChange";

export const playerRoutes = [
  {
    label: "Profile",
    path: "/players/:playerId/profile",
  },
  {
    label: "Payments",
    path: "/players/:playerId/payments",
  },
  {
    label: "Transactions",
    path: "/players/:playerId/profile/transactions",
  },
  {
    label: "Wagers",
    path: "/players/:playerId/profile/wagers",
  },
  {
    label: "Games",
    path: "/players/:playerId/profile/games",
  },
  {
    label: "Turnover",
    path: "/players/:playerId/profile/turnover",
  },
  {
    label: "Promotions",
    path: "/players/:playerId/promotion",
  },
  {
    label: "Login History",
    path: "/players/:playerId/login-history",
  },
];

const PlayerProfile = () => {
  const { playerId } = useParams();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: playerDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["playerProfile", playerId],
    queryFn: async () => {
      const res = await Axios.get(
        `${BASE_URL}${API_LIST.GET_PLAYER_PROFILE.replace(
          ":playerID",
          playerId
        )}`
      );
      if (!res.data.status) throw new Error("Failed to fetch player profile");
      return res.data.data;
    },
    keepPreviousData: true,
    enabled: !!playerId,
  });

  // Edit mutation - following PlayerListPage pattern
  const editMutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await Axios.post(`${API_LIST.EDIT_PLAYERS}/${id}`, data);
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to update player");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["playerProfile", playerId] });
      setModalOpen(false);
      toast.success("Player updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update player");
    },
  });

  // Highlight Box component for displaying stats
  const HighlightBox = ({ label, value, color = "green" }) => {
    const colorClasses = {
      green: "text-green-600",
      blue: "text-blue-600",
      red: "text-red-600",
      orange: "text-orange-600",
      yellow: "text-yellow-600",
      gray: "text-gray-600",
    };

    return (
      <div className="border-[#07122b] border text-black bg-white p-4 py-2 rounded shadow-md w-full sm:w-fit">
        <div className="text-xs font-medium text-gray-600">{label}</div>
        <div
          className={`text-[20px] font-semibold truncate ${colorClasses[color]}`}
        >
          {typeof value === "number" ? `BDT ${value.toFixed(2)}` : value || 0}
        </div>
      </div>
    );
  };

  const handleEditProfile = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleFormSubmit = (formData) => {
    editMutation.mutate({ id: playerId, ...formData });
  };

  if (isLoading) {
    return (
      <div className="bg-[#f5f5f5] w-full min-h-full p-4">
        <div className="text-center text-gray-500 py-8">
          Loading player profile...
        </div>
      </div>
    );
  }

  if (isError || !playerDetails) {
    return (
      <div className="bg-[#f5f5f5] w-full min-h-full p-4">
        <div className="text-center text-red-500 py-8">
          Failed to load player profile.
        </div>
      </div>
    );
  }

  const balance = playerDetails.balance || {};
  const transactionSummary = playerDetails.transactionSummary || {};
  const betResultsSummary = playerDetails.betResultsSummary || {};

  // Check if we're on the main profile page
  const isMainProfile = location.pathname === `/players/${playerId}/profile`;

  return (
    <div>
      <nav className="bg-[#07122b] sticky top-[-24px] border-[#07122b] border-2 rounded-lg text-[#fff] font-medium py-[14px] px-3">
        <ul className="flex gap-4 flex-wrap">
          {playerRoutes.map(({ label, path }) => {
            const to = path.replace(":playerId", playerId);
            const isActive =
              path === "/players/:playerId/profile"
                ? location.pathname === to
                : location.pathname === to ||
                  location.pathname.startsWith(to + "/");

            return (
              <li key={label}>
                <Link
                  to={to}
                  className={`${
                    isActive
                      ? "bg-green-400 text-black"
                      : "text-[#ffff] hover:text-black hover:bg-green-400"
                  }  px-2 py-1 rounded-[5px]`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <main className="p-4 bg-[#07122b] mt-5 rounded-lg">
        {/* Player Info Header */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4 md:flex-row flex-col md:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-2xl" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">
                  {playerDetails.fullname}
                </h1>
                <p className="text-gray-600">User: {playerDetails.username}</p>
                <p className="text-sm text-gray-500">{playerDetails.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-x-5 gap-y-3 md:gap-3 flex-wrap justify-center">
              <div className="flex items-start md:items-center gap-1 md:gap-3 flex-row">
                <div className="bg-gray-100 font-medium px-3 py-1 rounded-full pr-1 border border-gray-300 shadow-sm">
                  ACC:
                  <span
                    className={`px-3 py-1 rounded-full border ml-1 capitalize text-sm font-medium ${
                      playerDetails.status === "active"
                        ? "bg-green-100 text-green-500 border-green-500"
                        : "bg-red-100 text-red-500 border-red-500"
                    }`}
                  >
                    {playerDetails.status || "Unverified"}
                  </span>
                </div>
                <div className="bg-gray-100 font-medium px-3 py-1 rounded-full pr-1 border border-gray-300 shadow-sm">
                  KYC:
                  <span
                    className={`px-3 py-1 rounded-full border ml-1 capitalize text-sm font-medium ${
                      playerDetails.kyc_status === "verified"
                        ? "bg-green-100 text-green-500 border-green-500"
                        : "bg-red-100 text-red-500 border-red-500"
                    }`}
                  >
                    {playerDetails.kyc_status || "Unverified"}
                  </span>
                </div>
              </div>
              <KycRequestButton
                holderId={playerDetails?.id}
                holderType={"player"}
              />
              <button
                onClick={handleEditProfile}
                className="bg-green-500 text-white px-2 md:px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2 text-sm font-medium"
              >
                <FaEdit />
                <span className="md:flex hidden">Edit Profile</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Phone:</span>
              <span className="ml-2 font-medium">{playerDetails.phone}</span>
            </div>
            <div>
              <span className="text-gray-500">Currency:</span>
              <span className="ml-2 font-medium">
                {playerDetails.currency?.code} ({playerDetails.currency?.name})
              </span>
            </div>
            <div>
              <span className="text-gray-500">User Type:</span>
              <span className="ml-2 font-medium">{playerDetails.userType}</span>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2 font-medium">
                {new Date(playerDetails.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex xl:items-center justify-between flex-col xl:flex-row gap-4 mb-5">
          <div className="flex gap-4 flex-wrap whitespace-nowrap">
            <HighlightBox
              label="Current Balance"
              value={balance.currentBalance}
              color="green"
            />
            <HighlightBox
              label="Total Deposits"
              value={balance.totalDeposits}
              color="blue"
            />
            <HighlightBox
              label="Total Withdrawals"
              value={balance.totalWithdrawals}
              color="orange"
            />
          </div>
          <div className="flex gap-4 flex-wrap whitespace-nowrap">
            <HighlightBox
              label="Total Wins"
              value={balance.totalWins}
              color="green"
            />
            <HighlightBox
              label="Total Losses"
              value={balance.totalLosses}
              color="red"
            />
            <HighlightBox
              label="Win Rate"
              value={`${betResultsSummary.winRate || 0}%`}
              color="green"
            />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="flex xl:items-center justify-between flex-col xl:flex-row gap-4 mb-5">
          <div className="flex gap-4 flex-wrap whitespace-nowrap">
            <HighlightBox
              label="Pending Deposits"
              value={balance.pendingDeposits}
              color="yellow"
            />
            <HighlightBox
              label="Pending Withdrawals"
              value={balance.pendingWithdrawals}
              color="yellow"
            />
            <HighlightBox
              label="Total Transactions"
              value={transactionSummary.totalTransactions}
              color="blue"
            />
          </div>
          <div className="flex gap-4 flex-wrap whitespace-nowrap">
            <HighlightBox
              label="Total Bets"
              value={betResultsSummary.totalBets?.toString()}
              color="blue"
            />
            <HighlightBox
              label="Total Bet Amount"
              value={betResultsSummary.totalBetAmount}
              color="orange"
            />
            <HighlightBox
              label="Last Login"
              value={
                playerDetails.lastLogin
                  ? new Date(playerDetails.lastLogin).toLocaleDateString()
                  : "Never"
              }
              color="gray"
            />
          </div>
        </div>

        {/* Content Area */}
        {isMainProfile ? (
          <>
            <PlayerProfileStats playerDetails={playerDetails} />
            <PlayerPasswordChange info={playerDetails} />
          </>
        ) : (
          <Outlet />
        )}
      </main>

      {/* Edit Profile Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={handleModalClose}
        title="Edit Player Profile"
        onSave={null}
      >
        <PlayerForm
          initialValues={playerDetails}
          onSubmit={handleFormSubmit}
          loading={editMutation.isPending}
          isEdit={true}
        />
      </ReusableModal>
    </div>
  );
};

export default PlayerProfile;
