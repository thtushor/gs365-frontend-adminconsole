import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import Pagination from "./Pagination";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CreateAgentForm } from "./shared/CreateAgentForm";

const mapAgent = (agent) => ({
  id: agent.id,
  name: agent.name || agent.fullname || agent.email,
  email: agent.email,
  mobile: agent.mobile,
  role: agent.role,
  status: agent.status,
  created: agent.created_at
    ? new Date(agent.created_at).toLocaleDateString()
    : "N/A",
});

const defaultFilters = {
  search: "",
  role: "",
  status: "",
  page: 1,
  pageSize: 10,
};

const defaultForm = {
  name: "",
  email: "",
  mobile: "",
  role: "Agent",
  status: "Active",
};

const AgentListPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAgent, setEditAgent] = useState(null);
  const [editForm, setEditForm] = useState(defaultForm);
  const [filters, setFilters] = useState(defaultFilters);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["agents", filters],
    queryFn: async () => {
      const res = await Axios.get(API_LIST.AGENT_LIST, { params: filters });
      if (!res.data.status) throw new Error("Failed to fetch agents");
      return res.data;
    },
    keepPreviousData: true,
  });

  const agents = data?.data || [];
  const total = data?.total || 0;
  const pageSize = filters.pageSize;
  const currentPage = filters.page;
  const totalPages = Math.ceil(total / pageSize) || 1;

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...form }) => {
      const res = await Axios.post(`${API_LIST.UPDATE_ADMIN}/${id}`, form);
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to update agent");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      setEditModalOpen(false);
      setEditAgent(null);
      toast.success("Agent updated successfully!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await Axios.post(`${API_LIST.DELETE_ADMIN}/${id}`);
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to delete agent");
      return res.data;
    },
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ["agents"] });
        setDeleteModalOpen(false);
        setSelectedAgent(null);
        toast.success("Agent deleted successfully!");
      }
    },
  });

  const columns = [
    { field: "id", headerName: "ID", width: 80, render: (_, row) => row.id },
    {
      field: "username",
      headerName: "Username",
      width: 140,
      render: (_, row) => (
        <span className="text-green-500 cursor-pointer font-semibold">
          {row.username}
        </span>
      ),
    },
    {
      field: "fullname",
      headerName: "Full Name",
      width: 180,
      render: (_, row) => row.fullname,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 120,
      render: (_, row) => row.phone,
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
      render: (_, row) => row.email,
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      render: (_, row) => row.role,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      render: (_, row) => row.status,
    },
    {
      field: "country",
      headerName: "Country",
      width: 120,
      render: (_, row) => row.country,
    },
    {
      field: "city",
      headerName: "City",
      width: 120,
      render: (_, row) => row.city,
    },
    {
      field: "isLoggedIn",
      headerName: "Is Logged In",
      width: 100,
      render: (_, row) => (row.isLoggedIn ? "Yes" : "No"),
    },
    {
      field: "isVerified",
      headerName: "Is Verified",
      width: 100,
      render: (_, row) => (row.isVerified ? "Yes" : "No"),
    },
    {
      field: "lastIp",
      headerName: "Last IP",
      width: 120,
      render: (_, row) => row.lastIp,
    },
    {
      field: "lastLogin",
      headerName: "Last Login",
      width: 160,
      render: (_, row) =>
        row.lastLogin ? new Date(row.lastLogin).toLocaleString() : "",
    },
    {
      field: "device_type",
      headerName: "Device Type",
      width: 120,
      render: (_, row) => row.device_type,
    },
    {
      field: "device_name",
      headerName: "Device Name",
      width: 120,
      render: (_, row) => row.device_name,
    },
    {
      field: "os_version",
      headerName: "OS Version",
      width: 120,
      render: (_, row) => row.os_version,
    },
    {
      field: "browser",
      headerName: "Browser",
      width: 120,
      render: (_, row) => row.browser,
    },
    {
      field: "browser_version",
      headerName: "Browser Version",
      width: 120,
      render: (_, row) => row.browser_version,
    },
    {
      field: "ip_address",
      headerName: "IP Address",
      width: 120,
      render: (_, row) => row.ip_address,
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      align: "center",
      render: (value, row, idx) => (
        <div className="flex gap-2 justify-center">
          <button
            className="inline-flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full p-2 transition"
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            <FaEdit />
          </button>
          <button
            className="inline-flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full p-2 transition"
            title="Delete"
            onClick={() => {
              setSelectedAgent(row);
              setDeleteModalOpen(true);
            }}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (row) => {
    setEditAgent(row);
    setEditForm({
      username: row.username || "",
      fullname: row.fullname || row.name || "",
      phone: row.phone || row.mobile || "",
      email: row.email || "",
      password: "",
      role: row.role || "",
      country: row.country || "",
      city: row.city || "",
      street: row.street || "",
      minTrx: row.minTrx || "",
      maxTrx: row.maxTrx || "",
      currency: row.currency || 1,
      status: row.status || "Active",
    });
    setEditModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size) => {
    setFilters((prev) => ({ ...prev, pageSize: size, page: 1 }));
  };

  function handleEditFormSubmit(formData) {
    if (!editAgent) return;
    // Remove password if empty (don't update password unless changed)
    const dataToSend = { ...formData };
    if (!dataToSend.password) delete dataToSend.password;
    updateMutation.mutate({ id: editAgent.id, ...dataToSend });
  }

  function handleDelete() {
    if (selectedAgent) {
      deleteMutation.mutate(selectedAgent.id);
    }
  }
  const roles = [
    { value: "", label: "Select Role" },
    { value: "agent", label: "Agent" },
    { value: "superAgent", label: "Super Agent" },
  ];
  return (
    <div className="bg-[#f5f5f5] w-full min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Agent List</h2>
        <button
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
          onClick={() => navigate("/create-agent")}
        >
          Create Agent
        </button>
      </div>
      {/* Filter Bar */}
      <form className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          name="search"
          placeholder="Name/Email"
          value={filters.search}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          <option value="">All Roles</option>
          <option value="Agent">Agent</option>
          <option value="Super Agent">Super Agent</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </form>
      <div className="bg-white rounded-lg overflow-auto max-w-full shadow p-4 min-h-[200px] flex flex-col justify-center items-center">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">
            Loading agents...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-8">
            Failed to load agents: {error?.message || "Unknown error"}
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No agents found.</div>
        ) : (
          <>
            <DataTable columns={columns} data={agents} />
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
      {/* Edit Modal */}
      <ReusableModal
        open={editModalOpen}
        className={"min-w-[80vw] h-[80vh] overflow-auto"}
        onClose={() => setEditModalOpen(false)}
        title="Edit Agent"
        // onSave={handleEditFormSubmit}
      >
        <CreateAgentForm
          onSubmit={handleEditFormSubmit}
          initialValues={editForm}
          isLoading={updateMutation.isPending}
          isEdit={true}
          roles={roles}
        />
      </ReusableModal>
      {/* Delete Modal */}
      <ReusableModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Agent"
        onSave={handleDelete}
      >
        <div>
          <p>
            Are you sure you want to <b>delete</b> agent{" "}
            <b>{selectedAgent?.name}</b>?
          </p>
          <p className="text-xs text-red-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
      </ReusableModal>
    </div>
  );
};

export default AgentListPage;
