import { FaDollarSign, FaEdit, FaTrash } from "react-icons/fa";
import DataTable from "./DataTable";
import { useState } from "react";
import ReusableModal from "./ReusableModal";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";

const PlayerListTable = ({ players, onEdit, onDelete, onSelect }) => {
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [depositForm, setDepositForm] = useState({
    amount: "",
    promotionId: "",
    notes: "",
    attachment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleDepositSubmit = async () => {
    if (!selectedPlayer) return;
    
    if (!depositForm.amount || parseFloat(depositForm.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        userId: selectedPlayer.id,
        amount: parseFloat(depositForm.amount),
        currencyId: selectedPlayer.currencyId,
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
    },
    {
      field: "isVerified",
      headerName: "VERIFIED",
      width: 100,
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {value ? 'Yes' : 'No'}
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
              <div className="text-xs text-gray-500">@{row.userReferrerUsername}</div>
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
              <div className="font-medium">{value}</div>
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
        <span className="font-medium text-green-600">${value || 0}</span>
      ),
    },
    {
      field: "totalDeposits",
      headerName: "DEPOSITS",
      width: 120,
      render: (value) => (
        <span className="font-medium text-blue-600">${value || 0}</span>
      ),
    },
    {
      field: "totalWithdrawals",
      headerName: "WITHDRAWALS",
      width: 120,
      render: (value) => (
        <span className="font-medium text-orange-600">${value || 0}</span>
      ),
    },
    {
      field: "totalWins",
      headerName: "WINS",
      width: 100,
      render: (value) => (
        <span className="font-medium text-green-600">${value || 0}</span>
      ),
    },
    {
      field: "totalLosses",
      headerName: "LOSSES",
      width: 100,
      render: (value) => (
        <span className="font-medium text-red-600">${value || 0}</span>
      ),
    },
    {
      field: "pendingDeposits",
      headerName: "PENDING DEP",
      width: 120,
      render: (value) => (
        <span className="font-medium text-yellow-600">${value || 0}</span>
      ),
    },
    {
      field: "pendingWithdrawals",
      headerName: "PENDING WIT",
      width: 120,
      render: (value) => (
        <span className="font-medium text-yellow-600">${value || 0}</span>
      ),
    },
    {
      field: "device_type",
      headerName: "DEVICE TYPE",
      width: 120,
    },
    {
      field: "ip_address",
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
        <div className="flex justify-center gap-2">
          <button
            className="inline-flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full p-2 transition md:p-1 mr-2"
            title="Add Deposit"
            onClick={() => handleOpenDepositModal(row)}
          >
            <FaDollarSign />
          </button>
          <button
            className="inline-flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full p-2 transition md:p-1 mr-2"
            title="Edit"
            onClick={() => onEdit && onEdit(row)}
          >
            <FaEdit />
          </button>
          <button
            className="inline-flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full p-2 transition md:p-1"
            title="Delete"
            onClick={() => onDelete && onDelete(row)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={players}
        onRowClick={onSelect}
        selectable={false}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-100"
                value={`${selectedPlayer?.currencyCode || ""} (${selectedPlayer?.currencyName || ""})`}
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
              onChange={(e) => setDepositForm({...depositForm, amount: e.target.value})}
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promotion ID (Optional)
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter promotion ID"
              value={depositForm.promotionId}
              onChange={(e) => setDepositForm({...depositForm, promotionId: e.target.value})}
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
              value={depositForm.notes}
              onChange={(e) => setDepositForm({...depositForm, notes: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachment URL (Optional)
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter attachment URL"
              value={depositForm.attachment}
              onChange={(e) => setDepositForm({...depositForm, attachment: e.target.value})}
            />
          </div>
        </div>
      </ReusableModal>
    </>
  );
};

export default PlayerListTable;
