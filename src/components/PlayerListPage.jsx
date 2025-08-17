import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import PlayerListFilter from "./PlayerListFilter";
import PlayerListTable from "./PlayerListTable";
import Pagination from "./Pagination";
import Tabs from "./Tabs";
import { FaUsers, FaUser, FaExchangeAlt, FaDice } from "react-icons/fa";
import ReusableModal from "./ReusableModal";
import PlayerForm from "./PlayerForm";
import PlayerWagerTab from "./PlayerWagerTab";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

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
  created: new Date(p.created_at).toLocaleDateString(),
});

const defaultFilters = {
  playerId: "",
  phone: "",
  status: "",
  keyword: "",
  page: 1,
  pageSize: 10,
};

const PlayerListPage = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [activeTab, setActiveTab] = useState("players");
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlayer, setEditPlayer] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const queryClient = useQueryClient();

  const { user } = useAuth();

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
      const res = await Axios.post(API_LIST.REGISTER_PLAYERS, {
        ...data,
        createdBy: user.id,
      });
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to create player");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      setModalOpen(false);
      toast.success("Player created successfully!");
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await Axios.post(`${API_LIST.EDIT_PLAYERS}/${id}`, data);
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to update player");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      setModalOpen(false);
      setEditPlayer(null);
      toast.success("Player updated successfully!");
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
    setSelectedPlayer(player);
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
      <Tabs
        tabs={[
          { label: "Players", value: "players", icon: <FaUsers /> },
          { label: "Profile", value: "profile", icon: <FaUser /> },
          {
            label: "Transaction",
            value: "transaction",
            icon: <FaExchangeAlt />,
          },
          { label: "Wagers", value: "wagers", icon: <FaDice /> },
        ]}
        value={activeTab}
        onChange={setActiveTab}
      >
        {/* Players Tab */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">PLAYER LIST</h2>
            <div>
              <button
                className="border border-green-400 text-green-500 px-4 py-1 rounded hover:bg-green-50 transition text-sm font-medium mr-2"
                onClick={handleAddPlayer}
              >
                Add Player
              </button>
              <button className="border border-green-400 text-green-500 px-4 py-1 rounded hover:bg-green-50 transition text-sm font-medium">
                Print
              </button>
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
                  onEdit={handleEditPlayer}
                  onDelete={handleDeletePlayer}
                  onSelect={handlePlayerSelect}
                  selectedPlayer={selectedPlayer}
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
        </div>
        {/* Profile Tab */}
        <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
          <FaUser className="text-4xl mb-2" />
          <div className="text-lg font-semibold">Profile Info</div>
          <div className="mt-2">Select a player to view profile details.</div>
        </div>
        {/* Transaction Tab */}
        <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
          <FaExchangeAlt className="text-4xl mb-2" />
          <div className="text-lg font-semibold">Transactions</div>
          <div className="mt-2">
            Select a player to view transaction history.
          </div>
        </div>
        {/* Wagers Tab */}
        <PlayerWagerTab selectedPlayerId={selectedPlayer?.id} />
      </Tabs>
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
