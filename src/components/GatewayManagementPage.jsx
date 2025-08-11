import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaPlus,
  FaCog,
  FaCreditCard,
  FaChartLine,
  FaCogs,
} from "react-icons/fa";
import { toast } from "react-toastify";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import StatusChip from "./shared/StatusChip";
import DeleteConfirmationModal from "./shared/DeleteConfirmationModal";
import { usePaymentGateway } from "../hooks/usePaymentGateways";
import PageHeader from "./shared/PageHeader";
import LoadingState from "./shared/LoadingState";
import ErrorState from "./shared/ErrorState";
import EmptyState from "./shared/EmptyState";
import InfoCard from "./shared/InfoCard";
import StatCard from "./shared/StatCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_LIST } from "../api/ApiList";
import Axios from "../api/axios";

const GatewayManagementPage = () => {
  const { gatewayId, providerId, gatewayProviderId } = useParams();
  const navigate = useNavigate();

  // Fetch gateway details using the API
  const {
    data: gatewayData,
    isLoading: gatewayLoading,
    isError: gatewayError,
    error: gatewayErrorData,
  } = usePaymentGateway(gatewayId);

  const {
    data: accountsData,
    isLoading: accountsLoading,
    isError: accountsError,
    error: accountsErrorData,
  } = useQuery({
    queryKey: [
      API_LIST.GATEWAY_ACCOUNTS_BY_PROVIDER_GATEWAY,
      gatewayProviderId,
    ],
    queryFn: async () => {
      const response = await Axios.get(
        `${API_LIST.GATEWAY_ACCOUNTS_BY_PROVIDER_GATEWAY}/${gatewayProviderId}`
      );

      return response.data;
    },
  });

  const queryClient = useQueryClient();

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: async (requestBody) => {
      const response = await Axios.post(API_LIST.GATEWAY_ACCOUNTS, requestBody);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.status) {
        // Add new account to local state
        const newAccount = {
          ...data.data,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setAccounts((prev) => [...prev, newAccount]);
        toast.success("Account created successfully");
        setModalOpen(false);
        setEditMode(false);
        setSelectedAccount(null);

        // Invalidate and refetch accounts data
        queryClient.invalidateQueries({
          queryKey: [
            API_LIST.GATEWAY_ACCOUNTS_BY_PROVIDER_GATEWAY,
            gatewayProviderId,
          ],
        });
      } else {
        toast.error(data.message || "Failed to create account");
      }
    },
    onError: (error) => {
      console.error("Create account failed:", error);
      toast.error("Failed to create account");
    },
  });

  // Update account mutation
  const updateAccountMutation = useMutation({
    mutationFn: async ({ accountId, requestBody }) => {
      const response = await Axios.post(
        `${API_LIST.GATEWAY_ACCOUNTS}/${accountId}/update`,
        requestBody
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data.status) {
        // Update local state
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === variables.accountId
              ? { ...acc, ...variables.requestBody, id: acc.id }
              : acc
          )
        );
        toast.success("Account updated successfully");
        setModalOpen(false);
        setEditMode(false);
        setSelectedAccount(null);

        // Invalidate and refetch accounts data
        queryClient.invalidateQueries({
          queryKey: [
            API_LIST.GATEWAY_ACCOUNTS_BY_PROVIDER_GATEWAY,
            gatewayProviderId,
          ],
        });
      } else {
        toast.error(data.message || "Failed to update account");
      }
    },
    onError: (error) => {
      console.error("Update account failed:", error);
      toast.error("Failed to update account");
    },
  });

  // Update account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async ({ accountId }) => {
      const response = await Axios.post(
        `${API_LIST.GATEWAY_ACCOUNTS}/${accountId}/delete`
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data.status) {
        // Update local state
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === variables.accountId
              ? { ...acc, ...variables.requestBody, id: acc.id }
              : acc
          )
        );
        toast.success("Account deleted successfully");
        setModalOpen(false);
        setEditMode(false);
        setSelectedAccount(null);

        // Invalidate and refetch accounts data
        queryClient.invalidateQueries({
          queryKey: [
            API_LIST.GATEWAY_ACCOUNTS_BY_PROVIDER_GATEWAY,
            gatewayProviderId,
          ],
        });
      } else {
        toast.error(data.message || "Failed to delete account");
      }
    },
    onError: (error) => {
      console.error("Update account failed:", error);
      toast.error("Failed to update account");
    },
  });

  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  // Remove isSubmitting state since we'll use mutation loading states

  const [formData, setFormData] = useState({
    accountNumber: "",
    holderName: "",
    provider: "",
    bankName: "",
    branchName: "",
    branchAddress: "",
    swiftCode: "",
    iban: "",
    walletAddress: "",
    network: "",
    isPrimary: false,
    isVerified: false,
    status: "active",
  });

  const [filters, setFilters] = useState({
    status: "",
    provider: "",
    search: "",
  });

  // Use actual accounts data from API
  useEffect(() => {
    if (accountsData?.data) {
      setAccounts(accountsData.data);
      setIsLoading(false);
    }
  }, [accountsData]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCreate = () => {
    setEditMode(false);
    setSelectedAccount(null);
    setFormData({
      accountNumber: "",
      holderName: "",
      provider: "",
      bankName: "",
      branchName: "",
      branchAddress: "",
      swiftCode: "",
      iban: "",
      walletAddress: "",
      network: "",
      isPrimary: false,
      isVerified: false,
      status: "active",
    });
    setModalOpen(true);
  };

  const handleEdit = (account) => {
    setEditMode(true);
    setSelectedAccount(account);
    setFormData({
      accountNumber: account.accountNumber,
      holderName: account.holderName,
      provider: account.provider,
      bankName: account.bankName,
      branchName: account.branchName,
      branchAddress: account.branchAddress,
      swiftCode: account.swiftCode,
      iban: account.iban,
      walletAddress: account.walletAddress,
      network: account.network,
      isPrimary: account.isPrimary,
      isVerified: account.isVerified,
      status: account.status,
    });
    setModalOpen(true);
  };

  const handleDelete = (account) => {
    setItemToDelete(account);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    // Use the deleteAccountMutation
    deleteAccountMutation.mutate({ accountId: itemToDelete.id });
  };

  const handleSubmit = () => {
    if (
      !formData.accountNumber ||
      !formData.holderName ||
      !formData.isVerified
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare request body based on gateway type
    const requestBody = {
      paymentGatewayProviderId: gatewayProviderId,
      accountNumber: formData.accountNumber,
      holderName: formData.holderName,
      isVerified: formData.isVerified,
      status: formData.status,
      walletAddress: formData.walletAddress,
      network: formData.network,
      isPrimary: formData.isPrimary,
    };

    // Add bank-related fields only if gateway is bank type
    if (
      (gatewayData?.data?.paymentMethods?.name || "")
        ?.toLowerCase()
        .includes("bank")
    ) {
      requestBody.bankName = formData.bankName;
      requestBody.branchName = formData.branchName;
      requestBody.branchAddress = formData.branchAddress;
      requestBody.swiftCode = formData.swiftCode;
      requestBody.iban = formData.iban;
    }

    if (editMode && selectedAccount) {
      // Update existing account using mutation
      updateAccountMutation.mutate({
        accountId: selectedAccount.id,
        requestBody,
      });
    } else {
      // Create new account using mutation
      createAccountMutation.mutate(requestBody);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditMode(false);
    setSelectedAccount(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filteredAccounts = accounts.filter((account) => {
    if (filters.status && account.status !== filters.status) return false;
    if (filters.provider && account.provider !== filters.provider) return false;
    if (filters.search) {
      const searchTerm = filters?.search?.toLowerCase();
      return (
        account?.holderName?.toLowerCase().includes(searchTerm) ||
        account?.accountNumber?.toLowerCase().includes(searchTerm) ||
        account?.bankName?.toLowerCase().includes(searchTerm) ||
        account?.provider?.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  const columns = [
    {
      field: "holderName",
      headerName: "Account Holder",
      width: 180,
      render: (value) => (
        <span className="text-xs sm:text-sm font-medium">{value}</span>
      ),
    },
    {
      field: "accountNumber",
      headerName: "Account Number",
      width: 150,
      render: (value) => (
        <span className="text-xs sm:text-sm font-mono">{value || "N/A"}</span>
      ),
    },
    // {
    //   field: "provider",
    //   headerName: "Provider",
    //   width: 120,
    //   render: (value) => (
    //     <span className="capitalize text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
    //       {value || "N/A"}
    //     </span>
    //   ),
    // },
    {
      field: "bankName",
      headerName: "Bank Name",
      width: 150,
      render: (value) => (
        <span className="text-xs sm:text-sm">{value || "N/A"}</span>
      ),
    },
    {
      field: "branchName",
      headerName: "Branch",
      width: 140,
      render: (value) => (
        <span className="text-xs sm:text-sm text-gray-600">
          {value || "N/A"}
        </span>
      ),
    },
    {
      field: "isPrimary",
      headerName: "Primary",
      width: 80,
      render: (value) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "isVerified",
      headerName: "Verified",
      width: 80,
      render: (value) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      render: (value) => <StatusChip status={value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      render: (value, row) => (
        <div className="flex space-x-1 sm:space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit Account"
            disabled={
              createAccountMutation.isPending ||
              updateAccountMutation.isPending ||
              deleteAccountMutation.isPending
            }
          >
            <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Account"
            disabled={
              createAccountMutation.isPending ||
              updateAccountMutation.isPending ||
              deleteAccountMutation.isPending
            }
          >
            <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Show loading state for gateway data */}
        {gatewayLoading && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <LoadingState message="Loading gateway details..." />
          </div>
        )}

        {/* Show error state for gateway data */}
        {gatewayError && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <ErrorState
              title="Error Loading Gateway"
              message={
                gatewayErrorData?.message || "Failed to load gateway details"
              }
              onBack={handleBack}
            />
          </div>
        )}

        {/* Main content - only show if not loading and no error */}
        {!gatewayLoading && !gatewayError && (
          <div className="space-y-6">
            {/* Beautiful Header */}
            <PageHeader
              title="Gateway Account Management"
              subtitle="Manage accounts for this gateway and provider combination"
              onBack={handleBack}
              icon={<FaCreditCard />}
              actionButton={
                <button
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    gatewayLoading ||
                    gatewayError ||
                    createAccountMutation.isPending ||
                    updateAccountMutation.isPending
                  }
                >
                  {createAccountMutation.isPending ||
                  updateAccountMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      <span>Add Account</span>
                    </>
                  )}
                </button>
              }
            />

            {/* Gateway Information Section */}
            {gatewayData?.data && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Gateway Icon and Basic Info */}
                  <div className="flex items-center space-x-4">
                    {gatewayData.data.iconUrl && (
                      <div className="relative">
                        <img
                          src={gatewayData.data.iconUrl}
                          alt={gatewayData.data.name}
                          className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {gatewayData.data.name}
                      </h2>
                      <p className="text-gray-600">Provider ID: {providerId}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">
                          ID: {gatewayData.data.id}
                        </span>
                        <StatusChip status={gatewayData.data.status} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gateway Details Cards */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Basic Info Card */}
                  <InfoCard
                    title="Basic Information"
                    color="blue"
                    icon={<FaCogs />}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Gateway ID</span>
                        <span className="font-semibold">
                          {gatewayData.data.id}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status</span>
                        <StatusChip status={gatewayData.data.status} />
                      </div>
                      {gatewayData.data.network && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Network</span>
                          <span className="font-semibold">
                            {gatewayData.data.network}
                          </span>
                        </div>
                      )}
                      {gatewayData.data.paymentMethods && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {gatewayData.data.paymentMethods.name}
                          </span>
                        </div>
                      )}
                      {gatewayData.data.country && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Country</span>
                          <span className="flex items-center gap-2 font-semibold bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {gatewayData.data.country.flagUrl && (
                              <img
                                src={`data:image/png;base64,${gatewayData.data.country.flagUrl}`}
                                alt={gatewayData.data.country.name}
                                className="w-5 h-4 rounded shadow border"
                              />
                            )}
                            {gatewayData.data.country.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </InfoCard>

                  {/* Transaction Limits Card */}
                  <InfoCard
                    title="Transaction Limits"
                    color="green"
                    icon={<FaChartLine />}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <StatCard
                        label="Min Deposit"
                        value={`$${gatewayData.data.minDeposit}`}
                        color="blue"
                        size="sm"
                      />
                      <StatCard
                        label="Max Deposit"
                        value={`$${gatewayData.data.maxDeposit}`}
                        color="green"
                        size="sm"
                      />
                      <StatCard
                        label="Min Withdraw"
                        value={`$${gatewayData.data.minWithdraw}`}
                        color="yellow"
                        size="sm"
                      />
                      <StatCard
                        label="Max Withdraw"
                        value={`$${gatewayData.data.maxWithdraw}`}
                        color="red"
                        size="sm"
                      />
                    </div>
                  </InfoCard>

                  {/* Additional Settings Card */}
                  <InfoCard
                    title="Additional Settings"
                    color="purple"
                    icon={<FaCog />}
                  >
                    <div className="space-y-3">
                      {gatewayData.data.currencyConversionRate && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Conversion Rate</span>
                          <span className="font-semibold bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {gatewayData.data.currencyConversionRate}
                          </span>
                        </div>
                      )}
                      {gatewayData.data.paymentTypes &&
                        gatewayData.data.paymentTypes.length > 0 && (
                          <div>
                            <span className="text-gray-600 text-sm">
                              Payment Types
                            </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {gatewayData.data.paymentTypes.map((type) => (
                                <span
                                  key={type.id}
                                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                                >
                                  {type.name}
                                  {type.paymentMethod && (
                                    <span className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded ml-1">
                                      {type.paymentMethod.name}
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      {gatewayData.data.country && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Country Code</span>
                          <span className="font-semibold bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {gatewayData.data.country.code}
                          </span>
                        </div>
                      )}
                    </div>
                  </InfoCard>
                </div>
              </div>
            )}

            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaCog className="mr-2 text-blue-600" />
                Filters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    placeholder="Search accounts..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider
                  </label>
                  <select
                    value={filters.provider}
                    onChange={(e) =>
                      handleFilterChange("provider", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                  >
                    <option value="">All Providers</option>
                    <option value="Bkash">Bkash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Upay">Upay</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data Table Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {filteredAccounts.length === 0 ? (
                <EmptyState
                  icon={<FaCog className="text-4xl" />}
                  title="No Accounts Found"
                  description={
                    filters.search || filters.status || filters.provider
                      ? "No accounts match your filters."
                      : "No accounts have been added yet."
                  }
                  actionButton={
                    <button
                      onClick={handleCreate}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add First Account
                    </button>
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <DataTable
                    data={filteredAccounts}
                    columns={columns}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Modal */}
        <ReusableModal
          open={modalOpen}
          onClose={handleModalClose}
          title={editMode ? "Edit Account" : "Add New Account"}
          onSave={handleSubmit}
          className="max-w-4xl"
          isLoading={
            createAccountMutation.isPending || updateAccountMutation.isPending
          }
          loadingText={editMode ? "Updating..." : "Creating..."}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  placeholder="Enter account number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={formData.holderName}
                  onChange={(e) =>
                    setFormData({ ...formData, holderName: e.target.value })
                  }
                  placeholder="Enter holder name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({ ...formData, provider: e.target.value })
                  }
                  placeholder="Enter provider name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                />
              </div> */}
              {gatewayData?.data?.paymentMethods?.name
                ?.toLowerCase()
                .includes("bank") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                    placeholder="Enter bank name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                  />
                </div>
              )}
              {gatewayData?.data?.paymentMethods?.name
                ?.toLowerCase()
                .includes("bank") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) =>
                      setFormData({ ...formData, branchName: e.target.value })
                    }
                    placeholder="Enter branch name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                  />
                </div>
              )}
              {gatewayData?.data?.paymentMethods?.name
                ?.toLowerCase()
                .includes("bank") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Address
                  </label>
                  <input
                    type="text"
                    value={formData.branchAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branchAddress: e.target.value,
                      })
                    }
                    placeholder="Enter branch address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                  />
                </div>
              )}
              {gatewayData?.data?.paymentMethods?.name
                ?.toLowerCase()
                .includes("bank") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Swift Code
                  </label>
                  <input
                    type="text"
                    value={formData.swiftCode}
                    onChange={(e) =>
                      setFormData({ ...formData, swiftCode: e.target.value })
                    }
                    placeholder="Enter swift code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                  />
                </div>
              )}
              {gatewayData?.data?.paymentMethods?.name
                ?.toLowerCase()
                .includes("bank") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IBAN
                  </label>
                  <input
                    type="text"
                    value={formData.iban}
                    onChange={(e) =>
                      setFormData({ ...formData, iban: e.target.value })
                    }
                    placeholder="Enter IBAN"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={formData.walletAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, walletAddress: e.target.value })
                  }
                  placeholder="Enter wallet address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network
                </label>
                <input
                  type="text"
                  value={formData.network}
                  onChange={(e) =>
                    setFormData({ ...formData, network: e.target.value })
                  }
                  placeholder="Enter network"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onChange={(e) =>
                    setFormData({ ...formData, isPrimary: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="isPrimary"
                  className="text-sm font-medium text-gray-700"
                >
                  Primary Account
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVerified"
                  checked={formData.isVerified}
                  onChange={(e) =>
                    setFormData({ ...formData, isVerified: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  required
                />
                <label
                  htmlFor="isVerified"
                  className="text-sm font-medium text-gray-700"
                >
                  Verified Account *
                </label>
              </div>
            </div>
          </div>
        </ReusableModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Account"
          message={`Are you sure you want to delete the account "${itemToDelete?.holderName}"? This action cannot be undone.`}
          isLoading={deleteAccountMutation.isPending}
          loadingText="Deleting..."
        />
      </div>
    </div>
  );
};

export default GatewayManagementPage;
