import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import Pagination from "./Pagination";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { CreateAgentForm } from "./shared/CreateAgentForm";
import StatusChip from "./shared/StatusChip";
import { useAuth } from "../hooks/useAuth"; // Import useAuth

const mapOwner = (owner) => ({
  id: owner.id,
  username: owner.username,
  fullname: owner.fullname || owner.name || owner.email,
  phone: owner.phone || owner.mobile,
  email: owner.email,
  role: owner.role || "Owner",
  designationInfo: owner.designationInfo || null,
  commission_percent: owner.commission_percent || 0,
  status: owner.status || "active",
  isVerified: owner.isVerified,
  refCode: owner.refCode || owner.ref_code || "",
  lastIp: owner.lastIp || owner.last_ip || "",
  lastLogin: owner.lastLogin || owner.last_login || "",
  device_type: owner.device_type,
  created_at: owner.created_at,
});

const defaultFilters = {
  keyword: "",
  role: "",
  status: "",
  page: 1,
  pageSize: 20,
};

const defaultForm = {
  username: "",
  fullname: "",
  phone: "",
  email: "",
  password: "",
  role: "Owner",
  city: "",
  street: "",
  minTrx: "",
  maxTrx: "",
  currency: null,
  commission_percent: null,
  status: "active",
  referred_by: null,
};

const OwnerAccountControlPage = () => {
  const { user } = useAuth(); // Get user from auth context
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];

  // Check if the user has permission to view owner controls
  const canViewOwnerControls =
    isSuperAdmin || permissions.includes("owner_view_owner_controls");

  const [modalOpen, setModalOpen] = useState(false); // create modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editOwner, setEditOwner] = useState(null);
  const [editForm, setEditForm] = useState(defaultForm);
  const [filters, setFilters] = useState(defaultFilters);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);

  const queryClient = useQueryClient();

  // NOTE: This is the only useQuery that differs (owner-specific list)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["owners", filters],
    queryFn: async () => {
      const res = await Axios.get(API_LIST.GET_ADMIN_LIST, { params: filters });
      if (!res.data.status) throw new Error("Failed to fetch owners");
      return res.data;
    },
    keepPreviousData: true,
  });

  const owners = (data?.data || []).map(mapOwner);
  const total = data?.total || 0;
  const pageSize = filters.pageSize;
  const currentPage = filters.page;
  const totalPages = Math.ceil(total / pageSize) || 1;

  // Create (reuses affiliate-style endpoint)
  const createMutation = useMutation({
    mutationFn: async (form) => {
      const res = await Axios.post(API_LIST.CREATE_ADMIN, form);
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to create owner");
      return res.data;
    },
    onSuccess: () => {
      // invalidate both to keep affiliate and owner lists synced
      queryClient.invalidateQueries({ queryKey: ["affiliates"] });
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      setModalOpen(false);
      toast.success("Owner created successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create owner");
    },
  });

  // Update (reuses affiliate-style endpoint)
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...form }) => {
      const res = await Axios.post(`${API_LIST.UPDATE_ADMIN}/${id}`, form);
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to update owner");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliates"] });
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      setEditModalOpen(false);
      setEditOwner(null);
      toast.success("Owner updated successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update owner");
    },
  });

  // Delete (reuses affiliate-style endpoint)
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await Axios.post(`${API_LIST.DELETE_ADMIN}/${id}`);
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to delete owner");
      return res.data;
    },
    onSuccess: (res) => {
      if (res.status) {
        queryClient.invalidateQueries({ queryKey: ["affiliates"] });
        queryClient.invalidateQueries({ queryKey: ["owners"] });
        setDeleteModalOpen(false);
        setSelectedOwner(null);
        toast.success("Owner deleted successfully!");
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete owner");
    },
  });

  const columns = [
    {
      field: "sl",
      headerName: "SL",
      width: 60,
      render: (_, __, index) =>
        (filters.page - 1) * filters.pageSize + index + 1,
    },
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
      field: "designation",
      headerName: "Designation",
      width: 120,
      render: (_, row) => row.designationInfo?.designationName,
    },
    // {
    //   field: "commission_percentage",
    //   headerName: "Total Com. %",
    //   width: 120,
    //   render: (_, row) => row.commission_percent || 0,
    // },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      align: "center",
      render: (value) => <StatusChip status={value} size="sm" />,
    },
    {
      field: "isVerified",
      headerName: "Is Verified",
      width: 100,
      render: (_, row) => (row.isVerified ? "Yes" : "No"),
    },
    // {
    //   field: "refCode",
    //   headerName: "Referral Code",
    //   width: 120,
    //   render: (_, row) => row.refCode,
    // },
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
      field: "action",
      headerName: "Action",
      width: 120,
      align: "center",
      render: (value, row, idx) => {
        const isCurrentUser = user && user.id === row.id;
        const isSuperAdminRow = row.role === "superAdmin";
        const isDeletable = !isCurrentUser && !isSuperAdminRow;

        return (
          <div className="flex gap-2 justify-center">
            <button
              className="inline-flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full p-2 transition"
              title="Edit"
              onClick={() => handleEdit(row)}
            >
              <FaEdit />
            </button>
            <button
              className={`inline-flex items-center justify-center rounded-full p-2 transition ${
                isDeletable
                  ? "text-red-500 hover:bg-red-100"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              title={
                isDeletable
                  ? "Delete"
                  : isCurrentUser
                  ? "Cannot delete your own account"
                  : "Cannot delete Super Admin account"
              }
              onClick={(e) => {
                if (isDeletable) {
                  setSelectedOwner(row);
                  setDeleteModalOpen(true);
                } else {
                  e.preventDefault(); // Prevent modal from opening
                }
              }}
              disabled={!isDeletable}
            >
              <FaTrash />
            </button>
          </div>
        );
      },
    },
  ];

  const handleEdit = (row) => {
    setEditOwner(row);
    setEditForm({
      username: row.username || "",
      fullname: row.fullname || row.name || "",
      phone: row.phone || row.mobile || "",
      email: row.email || "",
      password: "",
      role: row.role || "Owner",
      city: row.city || "",
      street: row.street || "",
      minTrx: row.minTrx || "",
      maxTrx: row.maxTrx || "",
      currency: row.currency || 11,
      status: row.status || "active",
      commission_percent: row.commission_percent || null,
      referred_by: row.referred_by || null,
      designation: row.designationInfo?.id || null,
    });
    setEditModalOpen(true);
  };

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  }

  function handlePageChange(page) {
    setFilters((prev) => ({ ...prev, page }));
  }

  function handlePageSizeChange(size) {
    setFilters((prev) => ({ ...prev, pageSize: size, page: 1 }));
  }

  function handleEditFormSubmit(formData) {
    if (!editOwner) return;
    const dataToSend = { ...formData };
    if (!dataToSend.password) delete dataToSend.password;
    updateMutation.mutate({ id: editOwner.id, ...dataToSend });
  }

  // Create owner (opens modal -> submit)
  function handleCreateFormSubmit(formData) {
    // If role should be owner, force it if necessary:
    const payload = { ...formData };
    createMutation.mutate(payload);
  }

  function handleDelete() {
    if (selectedOwner) {
      deleteMutation.mutate(selectedOwner.id);
    }
  }

  const roles = [
    { value: "", label: "Select Role" },
    { value: "admin", label: "Admin" },
    { value: "superAdmin", label: "Super Admin" },
    // { value: "finance", label: "Finance" },
    // { value: "support", label: "Support" },
  ];

  return (
    <div className="bg-[#f5f5f5] w-full min-h-full p-4">
      {!canViewOwnerControls ? (
        <div className="text-center text-red-500 py-8">
          You do not have permission to view this page.
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Owner / Admin Accounts</h2>
            <button
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
              onClick={() => setModalOpen(true)}
            >
              Create Owner
            </button>
          </div>

      {/* Filter Bar */}
      <form
        className="flex flex-wrap gap-2 items-center mb-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          name="keyword"
          placeholder="Name/Email"
          value={filters.keyword}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
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

      <div className="bg-white rounded-lg overflow-auto max-w-full shadow p-4 min-h-[200px] flex flex-col">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">
            Loading owners...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-8">
            Failed to load owners: {error?.message || "Unknown error"}
          </div>
        ) : owners.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No owners found.</div>
        ) : (
          <>
            <DataTable columns={columns} data={owners} />
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

      {/* Create Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Owner"
        className={"min-w-[80vw] min-h-[60vh] overflow-auto"}
      >
        <CreateAgentForm
          onSubmit={handleCreateFormSubmit}
          initialValues={defaultForm}
          isLoading={createMutation.isLoading}
          isEdit={false}
          roles={roles}
          isAffiliate={false}
          isRefVisible={false}
          isOwner={true}
        />
      </ReusableModal>

      {/* Edit Modal */}
      <ReusableModal
        open={editModalOpen}
        className={"min-w-[80vw] min-h-[60vh] overflow-auto"}
        onClose={() => setEditModalOpen(false)}
        title="Edit Owner"
      >
        <CreateAgentForm
          onSubmit={handleEditFormSubmit}
          initialValues={editForm}
          isLoading={updateMutation.isLoading}
          isEdit={true}
          roles={roles}
          isAffiliate={false}
          isRefVisible={false}
        />
      </ReusableModal>

      {/* Delete Modal */}
      <ReusableModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Owner"
        onSave={handleDelete}
      >
        <div>
          <p>
            Are you sure you want to <b>delete</b> owner{" "}
            <b>{selectedOwner?.fullname}</b>?
          </p>
          <p className="text-xs text-red-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
      </ReusableModal>
        </>
      )}
    </div>
  );
};

export default OwnerAccountControlPage;
