import {
  FaDollarSign,
  FaEdit,
  FaTrash,
  FaMoneyBillWave,
  FaEllipsisV,
  FaUserCheck,
  FaEnvelope,
  FaEnvelopeOpenText,
  FaMobile,
  FaMobileAlt,
} from "react-icons/fa";
import DataTable from "./DataTable";
import { useEffect, useState } from "react";
import ReusableModal from "./ReusableModal";
import Axios from "../api/axios";
import { API_LIST, BASE_URL, SINGLE_IMAGE_UPLOAD_URL } from "../api/ApiList";
import { toast } from "react-toastify";
import { formatAmount } from "./BettingWagerPage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { hasPermission } from "../Utils/permissions";
import ActionDropdown from "./shared/ActionDropdown";
import WithdrawFormModal from "./WithdrawFormModal";
import BaseModal from "./shared/BaseModal";
import ToggleButton from "../Utils/ToggleButton";
import TextEditor from "./shared/TextEditor";
import { IoIosCloseCircle } from "react-icons/io";
import { usePostRequest } from "../Utils/apiClient";

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

const PlayerListTable = ({
  players,
  onEdit,
  onDelete,
  onSelect,
  onVerifyEmail,
  onVerifyPhone,
}) => {
  console.log(players);
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [depositForm, setDepositForm] = useState({
    amount: "",
    promotionId: "",
    notes: "",
    attachment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setWithdrawModalOpen(true);
  };

  const handleWithdrawSuccess = () => {
    // Invalidate and refetch players query to update balances
    queryClient.invalidateQueries(["players"]);
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
        (p) => p.id === depositForm.promotionId,
      );
      if (selectedPromotion) {
        const amount = parseFloat(depositForm.amount);
        const minAmount = parseFloat(selectedPromotion.minimumDepositAmount);
        const maxAmount = parseFloat(selectedPromotion.maximumDepositAmount);

        if (amount < minAmount) {
          toast.error(
            `Minimum deposit amount for this promotion is ${formatAmount(
              minAmount,
            )}`,
          );
          return;
        }

        if (amount > maxAmount) {
          toast.error(
            `Maximum deposit amount for this promotion is ${formatAmount(
              maxAmount,
            )}`,
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

    if (
      isSuperAdmin ||
      hasPermission(permissions, "payment_approve_deposits")
    ) {
      actions.push({
        label: "Add Deposit",
        icon: <FaDollarSign size={14} />,
        onClick: () => handleOpenDepositModal(row),
        className: "text-green-600 hover:bg-green-50",
      });
    }

    if (
      isSuperAdmin ||
      hasPermission(permissions, "payment_approve_withdrawals")
    ) {
      // Assuming a permission for withdrawals
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

    if (onVerifyEmail) {
      actions.push({
        label: row.isEmailVerified ? "Unverify Email" : "Verify Email",
        icon: row.isEmailVerified ? (
          <FaEnvelopeOpenText size={14} />
        ) : (
          <FaEnvelope size={14} />
        ),
        onClick: () => onVerifyEmail(row),
        className: row.isEmailVerified
          ? "text-green-600 hover:bg-green-50"
          : "text-purple-600 hover:bg-purple-50",
      });
    }

    if (onVerifyPhone) {
      actions.push({
        label: row.isPhoneVerified ? "Unverify Phone" : "Verify Phone",
        icon: row.isPhoneVerified ? (
          <FaMobileAlt size={14} />
        ) : (
          <FaMobile size={14} />
        ),
        onClick: () => onVerifyPhone(row),
        className: row.isPhoneVerified
          ? "text-green-600 hover:bg-green-50"
          : "text-purple-600 hover:bg-purple-50",
      });
    }

    return actions;
  };

  // Selected players
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Notification modal
  const [notificationEditorOpen, setNotificationEditorOpen] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    notificationType: "", // "claimable" | "linkable" | "static"
    title: "",
    amount: 0,
    turnoverMultiply: 0,
    startDate: "",
    endDate: "",
    promotionId: null,
    link: "",
    posterImg: null,
    description: "",
  });

  const handleTogglePlayer = (player) => {
    setSelectedPlayers((prev) =>
      prev.find((p) => p.id === player.id)
        ? prev.filter((p) => p.id !== player.id)
        : [...prev, player],
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(players);
    }
    setSelectAll(!selectAll);
  };

  const handleSendNotification = () => {
    if (selectedPlayers.length === 0) return;
    setNotificationEditorOpen(true);
  };

  const handleRemovePlayer = (id) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setNotificationForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setNotificationForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNotificationPromotionChange = (selectedOption) => {
    setNotificationForm({
      ...notificationForm,
      promotionId: selectedOption ? selectedOption.value : null,
    });
  };

  const [notifyLoading, setNotifyLoading] = useState(false);
  const postRequest = usePostRequest();
  const handleUpdatedData = () => {
    setNotificationForm({
      notificationType: "", // "claimable" | "linkable" | "static"
      title: "",
      amount: 0,
      turnoverMultiply: 0,
      startDate: "",
      endDate: "",
      promotionId: null,
      link: "",
      posterImg: null,
      description: "",
    });
    setNotificationEditorOpen(false);
    setSelectedPlayers([]);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    // toast.success("Notification sent successfully");
  };
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        ...formData,
      };

      return await postRequest({
        url: BASE_URL + API_LIST.CREATE_NOTIFICATION,
        body: payload,
        contentType: "application/json",
        setLoading: setNotifyLoading,
        onSuccessFn: handleUpdatedData,
      });
    },
  });

  const handleSubmitNotification = async (e) => {
    e.preventDefault();
    const selectedIds = selectedPlayers.map((p) => p.id);
    if (selectedIds.length === 0) {
      toast.error("No players selected");
      return;
    }

    // ===== Validation =====
    if (notificationForm?.notificationType === "claimable") {
      if (
        !notificationForm.startDate ||
        !notificationForm.endDate ||
        !notificationForm.turnoverMultiply ||
        // !notificationForm.promotionId ||
        !notificationForm.amount ||
        !notificationForm.title
      ) {
        toast.error(
          "For claimable notifications, Title, Amount, Promotion, Turnover Multiplier, Start Date, End Date are required.",
        );
        return;
      }
      if (notificationForm.turnoverMultiply < 0) {
        toast.error("Turnover Multiply is invalid.");
        return;
      }
    }
    if (notificationForm.notificationType === "linkable") {
      if (!notificationForm.title || !notificationForm.promotionId) {
        toast.error(
          "For linkable notifications, Title and Promotion are required.",
        );
        return;
      }
    }
    if (notificationForm.notificationType === "static") {
      if (!notificationForm.title || !notificationForm.description) {
        toast.error(
          "For static notifications, Title and description are required.",
        );
        return;
      }
    }

    // ===== File Upload + API Call =====
    try {
      setNotifyLoading(true);

      let posterImgUrl = notificationForm.posterImg;

      // Upload Poster Image if it's a File
      if (notificationForm.posterImg instanceof File) {
        const imageForm = new FormData();
        imageForm.append("file", notificationForm.posterImg);

        const uploadResponse = await fetch(SINGLE_IMAGE_UPLOAD_URL, {
          method: "POST",
          body: imageForm,
        });

        if (!uploadResponse.ok) {
          toast.error("Poster image upload failed");
          return;
        }

        const imageData = await uploadResponse.json();
        if (!imageData?.status || !imageData.data?.original) {
          toast.error("Invalid poster upload response");
          return;
        }

        posterImgUrl = imageData.data.original;
      }

      // Build final payload according to schema
      const payload = {
        notificationType: notificationForm.notificationType,
        title: notificationForm.title,
        description: notificationForm.description || null,
        posterImg: posterImgUrl || null,
        amount:
          notificationForm.notificationType === "claimable"
            ? notificationForm.amount
            : null,
        turnoverMultiply:
          notificationForm.notificationType === "claimable"
            ? notificationForm.turnoverMultiply
            : null,
        promotionId:
          notificationForm.notificationType === "linkable" ||
          notificationForm.notificationType === "claimable"
            ? notificationForm.promotionId
            : null,
        startDate: notificationForm.startDate || new Date().toISOString(), // must not be empty
        endDate: notificationForm.endDate || new Date().toISOString(), // must not be empty
        status: "active",
        playerIds: selectedIds,
      };

      console.log("Final Payload (to API):", payload);

      mutation.mutate(payload);

      // If playerIds should also be linked, you likely need a separate API call
      // to insert into a `notification_players` relation table
      if (selectedIds.length > 0) {
        console.log("Selected Player IDs (to handle separately):", selectedIds);
        // postRequest({ url: ..., body: { notificationId, playerIds: selectedIds } });
      }
    } catch (error) {
      console.error("Notification submit error:", error);
      toast.error("Failed to submit notification");
    } finally {
      setNotifyLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPlayers?.length === 0) {
      setSelectAll(false);
      setNotificationEditorOpen(false);
    }
  }, [selectedPlayers?.length]);

  const columns = [
    {
      field: "select",
      headerName: (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
        </div>
      ),
      width: 40,
      render: (_, row) => (
        <input
          type="checkbox"
          checked={!!selectedPlayers.find((p) => p.id === row.id)}
          onChange={() => handleTogglePlayer(row)}
        />
      ),
    },
    {
      field: "sl",
      headerName: "SL",
      width: 60,
      render: (_, __, index) => <span>{index}</span>,
    },
    {
      field: "id",
      headerName: "USER ID",
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
      headerName: "IS VERIFIED",
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
      field: "totalOnlyDeposits",
      headerName: "DEPOSITS",
      width: 120,
      render: (value) => (
        <span className="font-medium text-blue-600">
          {formatAmount(value || 0)}
        </span>
      ),
    },
    {
      field: "totalBonus",
      headerName: "TOTAL BONUS",
      width: 120,
      render: (value, row) => (
        <span className="font-medium text-purple-600">
          {formatAmount(value + Number(row.totalSpinBonus) || 0)}
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
      render: (_, row) => <ActionDropdown actions={getActionsForRow(row)} />,
    },
  ];

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
        customButton={selectedPlayers.length > 0}
        customFn={handleSendNotification}
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
                  (option) => option.value === depositForm.promotionId,
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
                    (p) => p.id === depositForm.promotionId,
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
      <WithdrawFormModal
        open={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        selectedPlayer={selectedPlayer}
        onSuccess={handleWithdrawSuccess}
      />

      <BaseModal
        open={notificationEditorOpen}
        onClose={() => setNotificationEditorOpen(false)}
      >
        <form
          className="p-4 max-h-[80vh] overflow-y-auto flex flex-col gap-3 w-full bg-white rounded-xl"
          onSubmit={handleSubmitNotification}
        >
          <h3 className="text-[18px] font-semibold">
            Write your custom notification
          </h3>

          {/* Selected Players */}
          <div className="bg-white border border-green-500 px-2 py-2 relative rounded-md">
            <h1 className="absolute top-[-10px] text-[14px] bg-white leading-4 text-green-500 font-medium uppercase">
              Selected players
            </h1>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedPlayers.map((player) => (
                <p
                  key={player.id}
                  className="bg-green-50 rounded-md flex items-center gap-1 w-fit text-[12px] px-[5px] text-green-500 border border-green-500"
                >
                  {player.fullname}
                  <IoIosCloseCircle
                    className="text-red-400 cursor-pointer"
                    onClick={() => handleRemovePlayer(player.id)}
                  />
                </p>
              ))}
            </div>
          </div>

          {/* Notification Type Toggle */}
          <div className="flex items-center gap-3">
            <ToggleButton
              title="Claimable"
              toggleName="isActiveClaimable" // dummy boolean for toggle button
              form={{
                isActiveClaimable:
                  notificationForm.notificationType === "claimable",
              }}
              setForm={() =>
                setNotificationForm((prev) => ({
                  ...prev,
                  notificationType:
                    prev.notificationType === "claimable" ? "" : "claimable",
                }))
              }
            />

            <ToggleButton
              title="Linkable"
              toggleName="isActiveLinkable"
              form={{
                isActiveLinkable:
                  notificationForm.notificationType === "linkable",
              }}
              setForm={() =>
                setNotificationForm((prev) => ({
                  ...prev,
                  notificationType:
                    prev.notificationType === "linkable" ? "" : "linkable",
                }))
              }
            />

            <ToggleButton
              title="Static"
              toggleName="isActiveStatic"
              form={{
                isActiveStatic: notificationForm.notificationType === "static",
              }}
              setForm={() =>
                setNotificationForm((prev) => ({
                  ...prev,
                  notificationType:
                    prev.notificationType === "static" ? "" : "static",
                }))
              }
            />
          </div>

          {/* Conditional Fields */}
          {notificationForm.notificationType && (
            <>
              {/* Title - Always Required */}
              <div>
                <label className="block text-sm mb-1">Notification Title</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  name="title"
                  value={notificationForm.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter notification title"
                />
              </div>

              {/* Claimable Fields */}
              {notificationForm.notificationType === "claimable" && (
                <>
                  <div>
                    <label className="block text-sm mb-1">Amount (BDT)</label>
                    <input
                      className="border rounded px-3 py-2 w-full"
                      name="amount"
                      value={notificationForm.amount}
                      onChange={handleChange}
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Turnover Multiply (%)
                    </label>
                    <input
                      className="border rounded px-3 py-2 w-full"
                      name="turnoverMultiply"
                      value={notificationForm.turnoverMultiply}
                      onChange={handleChange}
                      type="number"
                      required
                      placeholder="Turnover multiply"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Start Date</label>
                    <input
                      className="border rounded px-3 py-2 w-full"
                      name="startDate"
                      value={notificationForm.startDate}
                      onChange={handleChange}
                      type="date"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">End Date</label>
                    <input
                      className="border rounded px-3 py-2 w-full"
                      name="endDate"
                      value={notificationForm.endDate}
                      onChange={handleChange}
                      type="date"
                      required
                    />
                  </div>
                </>
              )}

              {/* Linkable Fields */}
              {(notificationForm.notificationType === "linkable" ||
                notificationForm.notificationType === "claimable") && (
                <div>
                  <label className="block text-sm mb-1">Promotion</label>
                  <Select
                    isClearable
                    isSearchable
                    placeholder="Select a promotion..."
                    options={promotionOptions}
                    value={
                      promotionOptions.find(
                        (option) =>
                          option.value === notificationForm.promotionId,
                      ) || null
                    }
                    onChange={handleNotificationPromotionChange}
                    isLoading={promotionsLoading}
                    className="w-full"
                  />
                </div>
              )}

              {/* Common Optional Fields */}
              <div>
                <label className="block text-sm mb-1">Poster Image</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  name="posterImg"
                  type="file"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Description</label>
                <TextEditor
                  value={notificationForm.description}
                  setValue={(val) =>
                    setNotificationForm((prev) => ({
                      ...prev,
                      description: val,
                    }))
                  }
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-[6px] font-semibold rounded-lg hover:bg-green-600 cursor-pointer"
          >
            Send Notification
          </button>
        </form>
      </BaseModal>
    </>
  );
};

export default PlayerListTable;
