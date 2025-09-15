import {
  FaDollarSign,
  FaEdit,
  FaTrash,
  FaMoneyBillWave,
  FaEllipsisV,
} from "react-icons/fa";
import DataTable from "./DataTable";
import { useState } from "react";
import ReusableModal from "./ReusableModal";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";
import { formatAmount } from "./BettingWagerPage";
import { useQuery, useMutation } from "@tanstack/react-query";
import Select from "react-select";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { hasPermission } from "../Utils/permissions";
import ActionDropdown from "./shared/ActionDropdown";

// Custom hook to fetch promotions
const usePromotions = () => {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const response = await Axios.get(API_LIST.GET_PUBLIC_PROMOTION);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const PlayerListTable = ({ players, onEdit, onDelete, onSelect }) => {
  console.log(players);
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [depositForm, setDepositForm] = useState({
    amount: "",
    promotionId: "",
    notes: "",
    attachment: "",
  });
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    notes: "",
    attachment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const withdrawMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await Axios.post(API_LIST.WITHDRAW_TRANSACTION, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Withdrawal added successfully");
      setWithdrawModalOpen(false);
      // Optionally refresh player data here
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to add withdrawal";
      toast.error(message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Fetch promotions using react-query
  const { data: promotionsData, isLoading: promotionsLoading } =
    usePromotions();

  const handleOpenDepositModal = (player) => {
    setSelectedPlayer(player);
    setDepositForm({
      amount: "",
      promotionId: "",
      notes: "",
      attachment: "",
    });
    setDepositModalOpen(true);
  };

  const handleOpenWithdrawModal = (player) => {
    setSelectedPlayer(player);
    setWithdrawForm({
      amount: "",
      notes: "",
      attachment: "",
    });
    setWithdrawModalOpen(true);
  };

  const handleWithdrawSubmit = async () => {
    if (!selectedPlayer) return;

    if (!withdrawForm.amount || parseFloat(withdrawForm.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: selectedPlayer.id,
        amount: parseFloat(withdrawForm.amount),
        currencyId: selectedPlayer.currencyId || 10, // Assuming default currencyId
        notes: withdrawForm.notes || null,
        attachment: withdrawForm.attachment || null,
      };

      await withdrawMutation.mutateAsync(payload);
    } catch (error) {
      // Error handling is done in the useMutation hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDepositSubmit = async () => {
    if (!selectedPlayer) return;

    if (!depositForm.amount || parseFloat(depositForm.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Validate promotion requirements if a promotion is selected
    if (depositForm.promotionId) {
      const selectedPromotion = promotionsData?.data?.find(
        (p) => p.id === depositForm.promotionId
      );
      if (selectedPromotion) {
        const amount = parseFloat(depositForm.amount);
        const minAmount = parseFloat(selectedPromotion.minimumDepositAmount);
        const maxAmount = parseFloat(selectedPromotion.maximumDepositAmount);

        if (amount < minAmount) {
          toast.error(
            `Minimum deposit amount for this promotion is ${formatAmount(
              minAmount
            )}`
          );
          return;
        }

        if (amount > maxAmount) {
          toast.error(
            `Maximum deposit amount for this promotion is ${formatAmount(
              maxAmount
            )}`
          );
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: selectedPlayer.id,
        amount: parseFloat(depositForm.amount),
        currencyId: selectedPlayer.currencyId || 10,
        promotionId: depositForm.promotionId || null,
        notes: depositForm.notes || null,
        attachment: depositForm.attachment || null,
      };

      await Axios.post(API_LIST.DEPOSIT_TRANSACTION, payload);
      toast.success("Deposit added successfully");
      setDepositModalOpen(false);
      // Optionally refresh the player data here
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to add deposit";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transform promotions data for react-select
  const promotionOptions =
    promotionsData?.data?.map((promotion) => ({
      value: promotion.id,
      label: `${promotion.promotionName} (${promotion.bonus}% bonus)`,
      promotion: promotion,
    })) || [];

  const handlePromotionChange = (selectedOption) => {
    setDepositForm({
      ...depositForm,
      promotionId: selectedOption ? selectedOption.value : "",
    });
  };

  const getActionsForRow = (row) => {
    const actions = [];

    if (isSuperAdmin || hasPermission(permissions, "payment_approve_deposits")) {
      actions.push({
        label: "Add Deposit",
        icon: <FaDollarSign size={14} />,
        onClick: () => handleOpenDepositModal(row),
        className: "text-green-600 hover:bg-green-50",
      });
    }

    if (isSuperAdmin || hasPermission(permissions, "payment_approve_withdrawals")) { // Assuming a permission for withdrawals
      actions.push({
        label: "Withdraw",
        icon: <FaMoneyBillWave size={14} />,
        onClick: () => handleOpenWithdrawModal(row),
        className: "text-orange-600 hover:bg-orange-50",
      });
    }

    if (onEdit) {
      actions.push({
        label: "Edit",
        icon: <FaEdit size={14} />,
        onClick: () => onEdit(row),
        className: "text-blue-600 hover:bg-blue-50",
      });
    }

    if (onDelete) {
      actions.push({
        label: "Delete",
        icon: <FaTrash size={14} />,
        onClick: () => onDelete(row),
        className: "text-red-600 hover:bg-red-50",
      });
    }

    return actions;
  };

  const columns = [
    {
      field: "id",
      headerName: "Player ID",
      width: 100,
    },
    {
      field: "fullname",
      headerName: "FULLNAME",
      width: 200,
      render: (value, row) => (
        <button
          onClick={() => onSelect && onSelect(row)}
          className="text-green-500 hover:text-green-700 font-medium cursor-pointer hover:underline"
        >
          {value}
        </button>
      ),
    },
    {
      field: "username",
      headerName: "USERNAME",
      width: 200,
    },
    {
      field: "email",
      headerName: "EMAIL",
      width: 250,
    },
    {
      field: "phone",
      headerName: "PHONE",
      width: 150,
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 100,
      render: (value) => (
        <span
          className={`px-2 py-1 text-center pb-[5px] font-semibold block rounded-full capitalize text-xs ${
            value === "active" ? "text-green-600" : "text-red-500"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      field: "kyc_status",
      headerName: "KYC STATUS",
      width: 100,
      render: (value) => (
        <span
          className={`px-2 py-1 text-center pb-[5px] font-semibold block rounded-full capitalize text-xs ${
            value === "verified" ? "text-green-600" : "text-red-500"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      field: "isVerified",
      headerName: "VERIFIED",
      width: 100,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "currencyCode",
      headerName: "CURRENCY",
      width: 120,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">{row.currencyName}</div>
        </div>
      ),
    },
    {
      field: "userReferrerName",
      headerName: "REF BY PLAYER",
      width: 150,
      render: (value, row) => (
        <div>
          {value ? (
            <>
              <div className="font-medium">{value}</div>
              <div className="text-xs text-gray-500">
                @{row.userReferrerUsername}
              </div>
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      field: "affiliateName",
      headerName: "AFFILIATE",
      width: 150,
      render: (value, row) => (
        <div>
          {value ? (
            <>
              {row.affiliateRole && row.affiliateName ? (
                <Link
                  to={`/affiliate-list/${row?.referred_by_admin_user}`}
                  className="font-medium text-green-500"
                >
                  {value}
                </Link>
              ) : (
                <div className="font-medium">{value}</div>
              )}
              <div className="text-xs text-gray-500">{row.affiliateRole}</div>
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      field: "agentName",
      headerName: "AGENT",
      width: 150,
      render: (value, row) => (
        <div>
          {value ? (
            <>
              <div className="font-medium">{value}</div>
              <div className="text-xs text-gray-500">{row.agentRole}</div>
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      field: "totalBalance",
      headerName: "BALANCE",
      width: 120,
      render: (value) => (
        <span className="font-medium text-green-600">
          {formatAmount(value || 0)}
        </span>
      ),
    },
    {
      field: "totalDeposits",
      headerName: "DEPOSITS",
      width: 120,
      render: (value) => (
        <span className="font-medium text-blue-600">
          {formatAmount(value || 0)}
        </span>
      ),
    },
    {
      field: "totalWithdrawals",
      headerName: "WITHDRAWALS",
      width: 120,
      render: (value) => (
        <span className="font-medium text-orange-600">
          {formatAmount(value || 0)}
        </span>
      ),
    },
    {
      field: "totalWins",
      headerName: "WINS",
      width: 100,
      render: (value) => (
        <span className="font-medium text-green-600">
          {formatAmount(value || 0)}
        </span>
      ),
    },
    {
      field: "totalLosses",
      headerName: "LOSSES",
      width: 100,
      render: (value) => (
        <span className="font-medium text-red-600">
          {formatAmount(value || 0)}
        </span>
      ),
    },
    {
      field: "pendingDeposits",
      headerName: "PENDING DEP",
      width: 120,
      render: (value) => (
        <span className="font-medium text-yellow-600">
          {formatAmount(value || 0)}
        </span>
      ),
    },
    {
      field: "pendingWithdrawals",
      headerName: "PENDING WIT",
      width: 120,
      render: (value) => (
        <span className="font-medium text-yellow-600">
          {formatAmount(value || 0)}
        </span>
      ),
    },
    {
      field: "device_type",
      headerName: "DEVICE TYPE",
      width: 120,
    },
    {
      field: "lastIp",
      headerName: "IP ADDRESS",
      width: 150,
    },
    {
      field: "created",
      headerName: "CREATED DATE",
      width: 150,
    },
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      align: "center",
      render: (value, row) => (
        <ActionDropdown
          actions={getActionsForRow(row)}
          isLoading={withdrawMutation.isPending}
        />
      ),
    },
  ];

  console.log("players players", players);
  return (
    <>
      <DataTable
        columns={columns}
        data={players}
        onRowClick={onSelect}
        selectable={false}
        isSuperAdmin={isSuperAdmin}
        permissions={permissions}
        exportPermission="player_export_player_data"
      />
      <ReusableModal
        open={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        title={`Add Deposit for ${selectedPlayer?.fullname || "Player"}`}
        onSave={handleDepositSubmit}
        isLoading={isSubmitting}
        loadingText="Adding Deposit..."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Player ID
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-100"
                value={selectedPlayer?.id || ""}
                readOnly
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-100"
                value={`${selectedPlayer?.currencyCode || ""} (${selectedPlayer?.currencyName || ""})`}
                readOnly
              />
            </div> */}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter amount"
              value={depositForm.amount}
              onChange={(e) =>
                setDepositForm({ ...depositForm, amount: e.target.value })
              }
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promotion (Optional)
            </label>
            <Select
              isClearable
              isSearchable
              placeholder="Select a promotion..."
              options={promotionOptions}
              value={
                promotionOptions.find(
                  (option) => option.value === depositForm.promotionId
                ) || null
              }
              onChange={handlePromotionChange}
              isLoading={promotionsLoading}
              className="w-full"
              classNamePrefix="react-select"
              noOptionsMessage={() => "No promotions available"}
              loadingMessage={() => "Loading promotions..."}
            />
            {depositForm.promotionId && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                <div className="font-medium">Selected Promotion Details:</div>
                {(() => {
                  const selectedPromotion = promotionsData?.data?.find(
                    (p) => p.id === depositForm.promotionId
                  );
                  if (selectedPromotion) {
                    return (
                      <div className="mt-1 space-y-1">
                        <div>• Bonus: {selectedPromotion.bonus}%</div>
                        <div>
                          • Min Deposit:{" "}
                          {formatAmount(selectedPromotion.minimumDepositAmount)}
                        </div>
                        <div>
                          • Max Deposit:{" "}
                          {formatAmount(selectedPromotion.maximumDepositAmount)}
                        </div>
                        <div>
                          • Turnover: {selectedPromotion.turnoverMultiply}x
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Enter notes"
              rows={3}
              value={depositForm.notes}
              onChange={(e) =>
                setDepositForm({ ...depositForm, notes: e.target.value })
              }
            />
          </div>
        </div>
      </ReusableModal>

      {/* Withdraw Modal */}
      <ReusableModal
        open={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        title={`Withdraw from ${selectedPlayer?.fullname || "Player"}`}
        onSave={handleWithdrawSubmit}
        isLoading={isSubmitting || withdrawMutation.isPending}
        loadingText="Processing Withdrawal..."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Player ID
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-100"
                value={selectedPlayer?.id || ""}
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter amount"
              value={withdrawForm.amount}
              onChange={(e) =>
                setWithdrawForm({ ...withdrawForm, amount: e.target.value })
              }
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Enter notes"
              rows={3}
              value={withdrawForm.notes}
              onChange={(e) =>
                setWithdrawForm({ ...withdrawForm, notes: e.target.value })
              }
            />
          </div>
        </div>
      </ReusableModal>
    </>
  );
};

export default PlayerListTable;
