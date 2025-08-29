import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API_LIST, BASE_URL } from "../api/ApiList";
import Axios from "../api/axios";
import { 
  FaPlus, 
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
  FaUniversity
} from "react-icons/fa";
import ReusableModal from "./ReusableModal";
import StatusChip from "./shared/StatusChip";

const PlayerPaymentsPage = () => {
  const { playerId } = useParams();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
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
    additionalInfo: ""
  });

  // Fetch player's payment accounts
  const { data: accounts, isLoading, refetch } = useQuery({
    queryKey: ["playerPaymentAccounts", playerId],
    queryFn: async () => {
      const res = await Axios.get(`${BASE_URL}${API_LIST.GET_USER_WITHDRAWAL_PAYMENT_ACCOUNTS}/${playerId}`);
      if (!res.data.success) throw new Error("Failed to fetch payment accounts");
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
      
      const method = editingAccount ? 'PUT' : 'POST';
      const payload = { ...data, userId: parseInt(playerId) };
      
      const res = await Axios[method.toLowerCase()](url, payload);
      if (!res.data.success) throw new Error(res.data.message || "Failed to save account");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerPaymentAccounts", playerId] });
      setModalOpen(false);
      setEditingAccount(null);
      resetForm();
      toast.success(editingAccount ? "Account updated successfully!" : "Account created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save account");
    },
  });

  // Delete account mutation
  const deleteMutation = useMutation({
    mutationFn: async (accountId) => {
      const res = await Axios.delete(`${BASE_URL}${API_LIST.DELETE_WITHDRAWAL_PAYMENT_ACCOUNT}/${accountId}`);
      if (!res.data.success) throw new Error(res.data.message || "Failed to delete account");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerPaymentAccounts", playerId] });
      toast.success("Account deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete account");
    },
  });

  // Set primary account mutation
  const setPrimaryMutation = useMutation({
    mutationFn: async (accountId) => {
      const res = await Axios.patch(`${BASE_URL}${API_LIST.SET_PRIMARY_ACCOUNT}/${accountId}/set-primary`, {
        userId: parseInt(playerId)
      });
      if (!res.data.success) throw new Error(res.data.message || "Failed to set primary account");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerPaymentAccounts", playerId] });
      toast.success("Primary account updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to set primary account");
    },
  });

  // Update verification status mutation
  const verificationMutation = useMutation({
    mutationFn: async ({ accountId, status, notes }) => {
      const res = await Axios.patch(`${BASE_URL}${API_LIST.UPDATE_VERIFICATION_STATUS}/${accountId}/verification-status`, {
        status,
        notes
      });
      if (!res.data.success) throw new Error(res.data.message || "Failed to update verification status");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerPaymentAccounts", playerId] });
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
      additionalInfo: ""
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
        additionalInfo: account.additionalInfo || ""
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
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="text-center text-gray-500 py-8">Loading payment accounts...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Accounts</h1>
          <p className="text-gray-600">Manage withdrawal payment accounts for this player</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
        >
          <FaPlus />
          Add Account
        </button>
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        {accounts && accounts.length > 0 ? (
          accounts.map((account) => (
            <div
              key={account.id}
              className={`border rounded-lg p-4 ${
                account.isPrimary ? "border-green-500 bg-green-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getProviderIcon(account.provider)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{account.holderName}</h3>
                      {account.isPrimary && (
                        <FaStar className="text-green-500" title="Primary Account" />
                      )}
                      <StatusChip 
                        status={account.verificationStatus} 
                        variant="verification"
                      />
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Type:</span> {getProviderLabel(account.provider)}
                      {account.provider === "bank" && account.bankName && (
                        <span className="ml-2">• {account.bankName}</span>
                      )}
                      {account.provider === "crypto" && account.network && (
                        <span className="ml-2">• {account.network}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {account.accountNumber && (
                        <div>
                          <span className="text-gray-500">Account:</span>
                          <span className="ml-1 font-medium">{account.accountNumber}</span>
                        </div>
                      )}
                      {account.country && (
                        <div>
                          <span className="text-gray-500">Country:</span>
                          <span className="ml-1 font-medium">{account.country}</span>
                        </div>
                      )}
                      {account.minWithdrawalAmount && (
                        <div>
                          <span className="text-gray-500">Min Amount:</span>
                          <span className="ml-1 font-medium">${account.minWithdrawalAmount}</span>
                        </div>
                      )}
                      {account.maxWithdrawalAmount && (
                        <div>
                          <span className="text-gray-500">Max Amount:</span>
                          <span className="ml-1 font-medium">${account.maxWithdrawalAmount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {!account.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(account.id)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Set as Primary"
                    >
                      <FaStar />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleVerificationStatus(account.id, account.verificationStatus)}
                    className={`p-2 ${
                      account.verificationStatus === "verified" 
                        ? "text-red-600 hover:text-red-800" 
                        : "text-green-600 hover:text-green-800"
                    }`}
                    title={account.verificationStatus === "verified" ? "Reject Verification" : "Approve Verification"}
                  >
                    {account.verificationStatus === "verified" ? <FaTimes /> : <FaCheck />}
                  </button>

                  <button
                    onClick={() => handleOpenModal(account)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Edit Account"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(account.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete Account"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaCreditCard className="text-4xl mx-auto mb-4 text-gray-300" />
            <p>No payment accounts found</p>
            <p className="text-sm">Add a payment account to enable withdrawals</p>
          </div>
        )}
      </div>

      {/* Add/Edit Account Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAccount(null);
          resetForm();
        }}
        title={editingAccount ? "Edit Payment Account" : "Add Payment Account"}
        onSave={null}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Holder Name *
              </label>
              <input
                type="text"
                value={formData.holderName}
                onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Type *
              </label>
              <select
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="bank">Bank Account</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="e-wallet">E-Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Gateway
              </label>
              <select
                value={formData.paymentGatewayId}
                onChange={(e) => setFormData({ ...formData, paymentGatewayId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Gateway</option>
                {paymentGateways?.map((gateway) => (
                  <option key={gateway.id} value={gateway.id}>
                    {gateway.name}
                  </option>
                ))}
              </select>
            </div>

            {formData.provider === "bank" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Swift Code
                  </label>
                  <input
                    type="text"
                    value={formData.swiftCode}
                    onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IBAN
                  </label>
                  <input
                    type="text"
                    value={formData.iban}
                    onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    value={formData.routingNumber}
                    onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </>
            )}

            {formData.provider === "crypto" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wallet Address *
                  </label>
                  <input
                    type="text"
                    value={formData.walletAddress}
                    onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Network
                  </label>
                  <input
                    type="text"
                    value={formData.network}
                    onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="BTC, ETH, etc."
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.accountHolderPhone}
                onChange={(e) => setFormData({ ...formData, accountHolderPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.accountHolderEmail}
                onChange={(e) => setFormData({ ...formData, accountHolderEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Withdrawal Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minWithdrawalAmount}
                onChange={(e) => setFormData({ ...formData, minWithdrawalAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Withdrawal Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.maxWithdrawalAmount}
                onChange={(e) => setFormData({ ...formData, maxWithdrawalAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal Fee
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.withdrawalFee}
                onChange={(e) => setFormData({ ...formData, withdrawalFee: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Processing Time
              </label>
              <input
                type="text"
                value={formData.processingTime}
                onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="1-3 business days"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Any additional notes or information..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrimary"
              checked={formData.isPrimary}
              onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="isPrimary" className="text-sm font-medium text-gray-700">
              Set as primary account
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditingAccount(null);
                resetForm();
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={accountMutation.isPending}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-50"
            >
              {accountMutation.isPending ? "Saving..." : (editingAccount ? "Update Account" : "Create Account")}
            </button>
          </div>
        </form>
      </ReusableModal>
    </div>
  );
};

export default PlayerPaymentsPage;
