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
  FaPhone,
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
import { useSettings } from "../hooks/useSettings";
import { hasPermission } from "../Utils/permissions";
import { useGetRequest } from "../Utils/apiClient";
import UserPhonesModal from "./UserPhonesModal";
import ActionDropdown from "./shared/ActionDropdown";

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
  const { data: settingsData } = useSettings();
  // const {user} = useAuth();/

  const conversionRate =
    settingsData?.data?.length > 0 ? settingsData?.data[0]?.conversionRate : 0;
  const { playerId } = useParams();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [phonesOpen, setPhonesOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  console.log(user);
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];
  console.log(isSuperAdmin);
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

  const getRequest = useGetRequest();
  const { data: kycDetails, isLoading: kycLoading } = useQuery({
    queryKey: ["kyc", { kycId: playerId }],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_ALL_KYC,
        params: { kycId: playerId },
        isPublic: false,
      }),
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
  const HighlightBox = ({
    label,
    value,
    isAmount = true,
    color = "green",
    conversion,
  }) => {
    const colorClasses = {
      green: "text-green-500",
      blue: "text-blue-500",
      red: "text-red-500",
      orange: "text-orange-500",
      yellow: "text-yellow-500",
      gray: "text-gray-500",
      purple: "text-purple-500",
      cyan: "text-cyan-500",
    };
    const borderClasses = {
      green: "border-green-500",
      blue: "border-blue-500",
      red: "border-red-500",
      orange: "border-orange-500",
      yellow: "border-yellow-500",
      gray: "border-gray-500",
      purple: "border-purple-500",
      cyan: "border-cyan-500",
    };
    const bgClasses = {
      green: "bg-green-100",
      blue: "bg-blue-100",
      red: "bg-red-100",
      orange: "bg-orange-100",
      yellow: "bg-yellow-100",
      gray: "bg-gray-100",
      purple: "bg-purple-100",
      cyan: "bg-cyan-100",
    };

    return (
      <div
        className={` border-2 text-black p-4 py-2 rounded-lg shadow-md w-full ${bgClasses[color]} sm:w-fit ${borderClasses[color]}`}
      >
        <div className="text-xs font-medium text-gray-600">{label}</div>
        <div
          className={`text-[20px] font-semibold truncate ${colorClasses[color]}`}
        >
          {typeof value === "number" && isAmount
            ? `BDT ${value.toFixed(2)}`
            : value || 0}
        </div>
        {conversion && (
          <span className="text-[12px] font-medium text-gray-500 block mt-[-3px]">{`${
            conversion ? (Number(value) / Number(conversion)).toFixed(2) : 0
          } USD`}</span>
        )}
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

  const handleOpenPhones = () => setPhonesOpen(true);
  const handleClosePhones = () => setPhonesOpen(false);

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
  const playerInProfitOrLoss = (isBDT = true) => {
    const currentBalance = Number(balance.currentBalance || 0);
    const withdrawBalance = Number(balance.totalWithdrawals || 0);
    const depositBalance = Number(balance.totalDeposits || 0);
    const conversion = Number(conversionRate);

    const profitLossInBDT = currentBalance + withdrawBalance - depositBalance;
    const profitLossInUSD = profitLossInBDT / conversion;
    if (isBDT) {
      return profitLossInBDT.toFixed(2);
    } else {
      return profitLossInUSD.toFixed(2);
    }
  };
  return (
    <div>
      <nav className="bg-[#07122b] sticky top-[-24px] border-[#07122b] border-2 rounded-lg text-[#fff] font-medium py-[14px] px-3 z-10">
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
              {(isSuperAdmin ||
                hasPermission(permissions, "kyc_view_kyc_requests")) && (
                <KycRequestButton
                  holderId={playerDetails?.id}
                  holderType={"player"}
                  isPending={kycDetails?.data[0]?.status}
                />
              )}
              {(isSuperAdmin || hasPermission(permissions, "player_edit_player")) && (
                <ActionDropdown
                  actions={[
                    {
                      label: "Edit Profile",
                      icon: <FaEdit size={14} />,
                      onClick: handleEditProfile,
                      className: "text-green-600 hover:bg-green-50",
                    },
                    {
                      label: "Edit Phones",
                      icon: <FaPhone size={14} />,
                      onClick: handleOpenPhones,
                      className: "text-blue-600 hover:bg-blue-50",
                    },
                  ]}
                />
              )}
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
        <div className="flex xl:items-center justify-between flex-col gap-4 mb-5">
          <div className="header-auth mt-[-5px] mb-3 relative">
            <div
              className={` ${
                playerInProfitOrLoss() < 0 ? "signup-btn" : "signup-btn-green"
              }`}
            >
              <div className="flex items-center justify-center flex-col mt-[-2px]">
                BDT {playerInProfitOrLoss()}
                <div className="text-[16px] opacity-80">
                  USD {playerInProfitOrLoss(false)}
                </div>
              </div>
            </div>
            <div
              className={` text-blue-500
                border border-blue-500 rounded-full font-medium text-[12px] absolute bg-[#07122b] bottom-[-12px] left-1/2 -translate-x-1/2 px-2 whitespace-nowrap`}
            >
              {playerInProfitOrLoss() < 0 ? "Lifetime Loss" : "Lifetime Profit"}
            </div>
          </div>
          <div className="flex gap-4 flex-wrap  justify-center whitespace-nowrap">
            <HighlightBox
              label="Current Balance"
              value={balance.currentBalance}
              color="green"
              conversion={conversionRate}
            />
            <HighlightBox
              label="Total Deposits"
              value={balance.totalDeposits}
              color="yellow"
              conversion={conversionRate}
            />
            <HighlightBox
              label="Total Bonus Amount"
              value={playerDetails?.balance.totalBonusAmount || 0}
              color="cyan"
              conversion={conversionRate}
            />
            <HighlightBox
              label="Total Withdrawals"
              value={balance.totalWithdrawals}
              color="orange"
              conversion={conversionRate}
            />
            <HighlightBox
              label="Win Rate"
              value={`${betResultsSummary.winRate || 0}%`}
              color="green"
            />
            <div className="flex gap-4 flex-wrap  justify-center whitespace-nowrap">
              <HighlightBox
                label="Total Bet Wins"
                value={balance.totalWins}
                color="cyan"
                conversion={conversionRate}
              />
              <HighlightBox
                label="Total Bet Losses"
                value={balance.totalLosses}
                color="red"
                conversion={conversionRate}
              />
              <HighlightBox
                label="Total Bet Amount"
                value={betResultsSummary.totalBetAmount}
                color="green"
                conversion={conversionRate}
              />
              <HighlightBox
                label="Pending Deposits"
                value={balance.pendingDeposits}
                color="orange"
                conversion={conversionRate}
              />
              <HighlightBox
                label="Pending Withdrawals"
                value={balance.pendingWithdrawals}
                color="yellow"
                conversion={conversionRate}
              />
              <HighlightBox
                label="Total Transactions"
                value={transactionSummary.totalTransactions}
                color="cyan"
                isAmount={false}
              />
            </div>
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

      {/* Edit Phones Modal */}
      <UserPhonesModal open={phonesOpen} onClose={handleClosePhones} userId={playerId} />
    </div>
  );
};

export default PlayerProfile;
