import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import PlayerListFilter from "./PlayerListFilter";
import PlayerListTable from "./PlayerListTable";
import Pagination from "./Pagination";
import { FaUsers } from "react-icons/fa";
import ReusableModal from "./ReusableModal";
import PlayerForm from "./PlayerForm";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { hasPermission } from "../Utils/permissions";

const mapPlayer = (p) => ({
  id: p.id,
  name: p.fullname || p.username || p.email,
  fullname: p.fullname,
  username: p.username,
  email: p.email,
  phone: p.phone,
  role: "Player",
  device_type: p.device_type,
  device_name: p.device_name,
  os_version: p.os_version,
  browser: p.browser,
  browser_version: p.browser_version,
  ip_address: p.ip_address,
  status: p.status || "active",
  kyc_status: p.kyc_status,
  created: new Date(p.created_at).toLocaleDateString(),
  // New fields from updated API
  isVerified: p.isVerified,
  currencyCode: p.currencyCode,
  currencyName: p.currencyName,
  referrerName: p.referrerName,
  referrerRole: p.referrerRole,
  userReferrerName: p.userReferrerName,
  userReferrerUsername: p.userReferrerUsername,
  affiliateName: p.affiliateName,
  affiliateRole: p.affiliateRole,
  agentName: p.agentName,
  agentRole: p.agentRole,
  totalBalance: p.totalBalance,
  totalDeposits: p.totalDeposits,
  totalOnlyDeposits: p.totalOnlyDeposits,
  totalBonus: p.totalBonus,
  totalSpinBonus: p.totalSpinBonus,
  totalWithdrawals: p.totalWithdrawals,
  totalWins: p.totalWins,
  totalLosses: p.totalLosses,
  pendingDeposits: p.pendingDeposits,
  pendingWithdrawals: p.pendingWithdrawals,
  referred_by_admin_user: p.referred_by_admin_user,
});

const defaultFilters = {
  playerId: "",
  phone: "",
  status: "",
  keyword: "",
  page: 1,
  pageSize: 20,
  createdBy: "",
  referred_by: "",
  referred_by_admin_user: "",
  userType: "all",
  currencyId: "",
  dateFrom: "",
  dateTo: "",
};

const PlayerListPage = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlayer, setEditPlayer] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["players", filters],
    queryFn: async () => {
      const res = await Axios.get(API_LIST.GET_PLAYERS, { params: filters });
      if (!res.data.status) throw new Error("Failed to fetch players");
      return res.data.data;
    },
    keepPreviousData: true,
  });

  const players = data?.data?.map(mapPlayer) || [];
  const total = data?.total || 0;
  const pageSize = filters.pageSize;
  const currentPage = filters.page;
  const totalPages = Math.ceil(total / pageSize) || 1;

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await Axios.post(API_LIST.REGISTER_PLAYERS, {
          ...data,
          createdBy: user.id,
        });

        // Check your API's response
        if (!res.data.status) {
          throw new Error(res.data.message || "Failed to create player");
        }

        return res.data;
      } catch (err) {
        // Axios errors may be inside err.response.data
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to create player";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      setModalOpen(false);
      toast.success("Player created successfully!");
    },
    onError: (error) => {
      toast.error(error.message); // Show proper error message
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      try {
        const res = await Axios.post(`${API_LIST.EDIT_PLAYERS}/${id}`, data);

        if (!res.data.status) {
          throw new Error(res.data.message || "Failed to update player");
        }

        return res.data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to update player";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      setModalOpen(false);
      setEditPlayer(null);
      toast.success("Player updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message); // Show proper error message
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await Axios.post(`${API_LIST.DELETE_PLAYERS}/${id}`);
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to delete player");
      return res.data;
    },
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ["players"] });
        toast.success("Player deleted successfully!");
      }
    },
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size) => {
    setFilters((prev) => ({ ...prev, pageSize: size, page: 1 }));
  };

  const handleAddPlayer = () => {
    setEditPlayer(null);
    setModalOpen(true);
  };

  const handleEditPlayer = (player) => {
    console.log({ player });
    setEditPlayer(player);
    setModalOpen(true);
  };

  const handlePlayerSelect = (player) => {
    navigate(`/players/${player.id}/profile`);
  };

  const handleVerify = (player) => {
    const newStatus = !player.isVerified;
    if (
      window.confirm(
        `Are you sure you want to manually ${newStatus ? "verify" : "unverify"
        } ${player.name}?`
      )
    ) {
      editMutation.mutate({ id: player.id, isVerified: newStatus });
    }
  };

  const handleDeletePlayer = (player) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      deleteMutation.mutate(player.id);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditPlayer(null);
  };

  const handleFormSubmit = (formData) => {
    if (editPlayer) {
      editMutation.mutate({ id: editPlayer.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  console.log({ players });

  return (
    <div className="bg-[#f5f5f5] w-full min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">PLAYER LIST</h2>
        <div>
          {(isSuperAdmin ||
            hasPermission(permissions, "player_create_player")) && (
              <button
                className="border border-green-400 text-green-500 px-4 py-1 rounded hover:bg-green-50 transition text-sm font-medium mr-2"
                onClick={handleAddPlayer}
              >
                Add Player
              </button>
            )}
          {(isSuperAdmin ||
            hasPermission(permissions, "player_export_player_data")) && (
              <button className="border border-green-400 text-green-500 px-4 py-1 rounded hover:bg-green-50 transition text-sm font-medium">
                Print
              </button>
            )}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <PlayerListFilter filters={filters} onChange={handleFilterChange} />
      </div>
      <div className="bg-white rounded-lg overflow-auto max-w-full shadow p-4 min-h-[200px] flex flex-col justify-center items-center">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">
            Loading players...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-8">
            Failed to load players.
          </div>
        ) : (
          <>
            <PlayerListTable
              players={players}
              onEdit={
                isSuperAdmin || hasPermission(permissions, "player_edit_player")
                  ? handleEditPlayer
                  : undefined
              }
              onDelete={
                isSuperAdmin ||
                  hasPermission(permissions, "player_delete_player")
                  ? handleDeletePlayer
                  : undefined
              }
              onVerify={
                isSuperAdmin || hasPermission(permissions, "player_edit_player") ? handleVerify : undefined
              }
              onSelect={handlePlayerSelect}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 50, 100]}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
      <ReusableModal
        open={modalOpen}
        onClose={handleModalClose}
        title={editPlayer ? "Edit Player" : "Add Player"}
        onSave={null}
      >
        <PlayerForm
          initialValues={editPlayer}
          onSubmit={handleFormSubmit}
          loading={createMutation.isPending || editMutation.isPending}
          isEdit={!!editPlayer}
        />
      </ReusableModal>
    </div>
  );
};

export default PlayerListPage;
