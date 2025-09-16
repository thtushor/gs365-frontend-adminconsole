import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API_LIST, BASE_URL } from "../api/ApiList";
import Axios from "../api/axios";
import {
  FaPlus,
  FaMinus, // Added FaMinus for withdraw button
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaStar,
  FaUnlock,
  FaLock,
  FaCreditCard,
  FaBitcoin,
  FaWallet,
  FaUniversity,
} from "react-icons/fa";
import ReusableModal from "./ReusableModal";
import StatusChip from "./shared/StatusChip";
import DepositFormModal from "./DepositFormModal"; // Added DepositFormModal
import WithdrawFormModal from "./WithdrawFormModal"; // Added WithdrawFormModal
import { useAuth } from "../hooks/useAuth"; // Added useAuth
import { hasPermission } from "../Utils/permissions"; // Added hasPermission
import TransactionsPage from "./TransactionsPage";

const PlayerPaymentsPage = () => {
  const { playerId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Get user for permissions
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [depositModalOpen, setDepositModalOpen] = useState(false); // State for deposit modal
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false); // State for withdraw modal

  const [formData, setFormData] = useState({
    holderName: "",
    provider: "bank",
    paymentGatewayId: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    branchAddress: "",
    swiftCode: "",
    iban: "",
    routingNumber: "",
    walletAddress: "",
    network: "",
    accountHolderPhone: "",
    accountHolderEmail: "",
    country: "",
    state: "",
    city: "",
    address: "",
    postalCode: "",
    isPrimary: false,
    minWithdrawalAmount: "",
    maxWithdrawalAmount: "",
    withdrawalFee: "",
    processingTime: "",
    additionalInfo: "",
  });


  const {data: playerData} = useQuery({
    queryKey:[API_LIST.GET_PLAYERS,{id: playerId}],
    queryFn: async ()=>{
      const response  = await Axios.get(`${API_LIST.GET_PLAYERS}/${playerId}`)

      return response.data
    }
  })

  console.log({playerData})

  // Fetch player's payment accounts
  const {
    data: accounts,
    isLoading: isLoadingAccounts, // Renamed to avoid conflict
    refetch: refetchAccounts, // Renamed to avoid conflict
  } = useQuery({
    queryKey: ["playerPaymentAccounts", playerId],
    queryFn: async () => {
      const res = await Axios.get(
        `${BASE_URL}${API_LIST.GET_USER_WITHDRAWAL_PAYMENT_ACCOUNTS}/${playerId}`
      );
      if (!res.data.success)
        throw new Error("Failed to fetch payment accounts");
      return res.data.data;
    },
    enabled: !!playerId,
  });

  // Fetch player details for deposit/withdraw modals
  const {
    data: playerDetails,
    isLoading: isLoadingPlayerDetails,
    isError: isErrorPlayerDetails,
    refetch: refetchPlayerDetails,
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
    enabled: !!playerId,
  });

  // Fetch payment gateways for dropdown
  const { data: paymentGateways } = useQuery({
    queryKey: ["paymentGateways"],
    queryFn: async () => {
      const res = await Axios.get(`${BASE_URL}/api/payment-gateways`);
      return res.data.data || [];
    },
  });

  // Create/Update account mutation
  const accountMutation = useMutation({
    mutationFn: async (data) => {
      const url = editingAccount
        ? `${BASE_URL}${API_LIST.UPDATE_WITHDRAWAL_PAYMENT_ACCOUNT}/${editingAccount.id}`
        : `${BASE_URL}${API_LIST.CREATE_WITHDRAWAL_PAYMENT_ACCOUNT}`;

      const method = editingAccount ? "PUT" : "POST";
      const payload = { ...data, userId: parseInt(playerId) };

      const res = await Axios[method.toLowerCase()](url, payload);
      if (!res.data.success)
        throw new Error(res.data.message || "Failed to save account");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playerPaymentAccounts", playerId],
      });
      refetchPlayerDetails(); // Refetch player details to update balance
      setModalOpen(false);
      setEditingAccount(null);
      resetForm();
      toast.success(
        editingAccount
          ? "Account updated successfully!"
          : "Account created successfully!"
      );
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save account");
    },
  });

  // Delete account mutation
  const deleteMutation = useMutation({
    mutationFn: async (accountId) => {
      const res = await Axios.delete(
        `${BASE_URL}${API_LIST.DELETE_WITHDRAWAL_PAYMENT_ACCOUNT}/${accountId}`
      );
      if (!res.data.success)
        throw new Error(res.data.message || "Failed to delete account");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playerPaymentAccounts", playerId],
      });
      refetchPlayerDetails(); // Refetch player details to update balance
      toast.success("Account deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete account");
    },
  });

  // Set primary account mutation
  const setPrimaryMutation = useMutation({
    mutationFn: async (accountId) => {
      const res = await Axios.patch(
        `${BASE_URL}${API_LIST.SET_PRIMARY_ACCOUNT}/${accountId}/set-primary`,
        {
          userId: parseInt(playerId),
        }
      );
      if (!res.data.success)
        throw new Error(res.data.message || "Failed to set primary account");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playerPaymentAccounts", playerId],
      });
      refetchPlayerDetails(); // Refetch player details to update balance
      toast.success("Primary account updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to set primary account");
    },
  });

  // Update verification status mutation
  const verificationMutation = useMutation({
    mutationFn: async ({ accountId, status, notes }) => {
      const res = await Axios.patch(
        `${BASE_URL}${API_LIST.UPDATE_VERIFICATION_STATUS}/${accountId}/verification-status`,
        {
          status,
          notes,
        }
      );
      if (!res.data.success)
        throw new Error(
          res.data.message || "Failed to update verification status"
        );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playerPaymentAccounts", playerId],
      });
      refetchPlayerDetails(); // Refetch player details to update balance
      toast.success("Verification status updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update verification status");
    },
  });

  const resetForm = () => {
    setFormData({
      holderName: "",
      provider: "bank",
      paymentGatewayId: "",
      accountNumber: "",
      bankName: "",
      branchName: "",
      branchAddress: "",
      swiftCode: "",
      iban: "",
      routingNumber: "",
      walletAddress: "",
      network: "",
      accountHolderPhone: "",
      accountHolderEmail: "",
      country: "",
      state: "",
      city: "",
      address: "",
      postalCode: "",
      isPrimary: false,
      minWithdrawalAmount: "",
      maxWithdrawalAmount: "",
      withdrawalFee: "",
      processingTime: "",
      additionalInfo: "",
    });
  };

  const handleOpenModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        holderName: account.holderName || "",
        provider: account.provider || "bank",
        paymentGatewayId: account.paymentGatewayId || "",
        accountNumber: account.accountNumber || "",
        bankName: account.bankName || "",
        branchName: account.branchName || "",
        branchAddress: account.branchAddress || "",
        swiftCode: account.swiftCode || "",
        iban: account.iban || "",
        routingNumber: account.routingNumber || "",
        walletAddress: account.walletAddress || "",
        network: account.network || "",
        accountHolderPhone: account.accountHolderPhone || "",
        accountHolderEmail: account.accountHolderEmail || "",
        country: account.country || "",
        state: account.state || "",
        city: account.city || "",
        address: account.address || "",
        postalCode: account.postalCode || "",
        isPrimary: account.isPrimary || false,
        minWithdrawalAmount: account.minWithdrawalAmount || "",
        maxWithdrawalAmount: account.maxWithdrawalAmount || "",
        withdrawalFee: account.withdrawalFee || "",
        processingTime: account.processingTime || "",
        additionalInfo: account.additionalInfo || "",
      });
    } else {
      setEditingAccount(null);
      resetForm();
    }
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    accountMutation.mutate(formData);
  };

  const handleDelete = (accountId) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      deleteMutation.mutate(accountId);
    }
  };

  const handleSetPrimary = (accountId) => {
    setPrimaryMutation.mutate(accountId);
  };

  const handleVerificationStatus = (accountId, currentStatus) => {
    const newStatus = currentStatus === "verified" ? "rejected" : "verified";
    const notes = prompt("Enter verification notes:", "");
    if (notes !== null) {
      verificationMutation.mutate({ accountId, status: newStatus, notes });
    }
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case "bank":
        return <FaUniversity className="text-blue-600" />;
      case "crypto":
        return <FaBitcoin className="text-orange-600" />;
      case "e-wallet":
        return <FaWallet className="text-green-600" />;
      default:
        return <FaCreditCard className="text-gray-600" />;
    }
  };

  const getProviderLabel = (provider) => {
    switch (provider) {
      case "bank":
        return "Bank Account";
      case "crypto":
        return "Cryptocurrency";
      case "e-wallet":
        return "E-Wallet";
      default:
        return provider;
    }
  }; // Closing brace for getProviderLabel
  const handleOpenDepositModal = () => {
    setDepositModalOpen(true);
  };

  const handleCloseDepositModal = () => {
    setDepositModalOpen(false);
    refetchPlayerDetails(); // Refetch player profile to update balance after deposit
  };

  const handleOpenWithdrawModal = () => {
    setWithdrawModalOpen(true);
  };

  const handleCloseWithdrawModal = () => {
    setWithdrawModalOpen(false);
    refetchPlayerDetails(); // Refetch player profile to update balance after withdrawal
  };

  if (isLoadingAccounts || isLoadingPlayerDetails) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="text-center text-gray-500 py-8">
          Loading payment accounts and player data...
        </div>
      </div>
    );
  }

  if (isErrorPlayerDetails || !playerDetails) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="text-center text-red-500 py-8">
          Failed to load player data.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        
        </div>
        <div className="flex gap-4">
          {(isSuperAdmin ||
            hasPermission(permissions, "payment_approve_deposits")) && (
            <button
              onClick={handleOpenDepositModal}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
            >
              <FaPlus />
              Deposit
            </button>
          )}
          {(isSuperAdmin ||
            hasPermission(permissions, "payment_approve_withdrawals")) && (
            <button
              onClick={handleOpenWithdrawModal}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
            >
              <FaMinus />
              Withdraw
            </button>
          )}
      
        </div>
      </div>

      <TransactionsPage
      playerId={playerId}
      title=""
    />

  

      {/* Deposit and Withdraw Modals */}
      <DepositFormModal
        open={depositModalOpen}
        onClose={handleCloseDepositModal}
        selectedPlayer={playerData?.data}
        onSuccess={refetchPlayerDetails}
      />

      <WithdrawFormModal
        open={withdrawModalOpen}
        onClose={handleCloseWithdrawModal}
        selectedPlayer={playerData?.data}
        onSuccess={refetchPlayerDetails}
      />
    </div>
  );
};

export default PlayerPaymentsPage;
