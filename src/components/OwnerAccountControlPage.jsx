import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import { FaTrash, FaEdit } from "react-icons/fa";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import Pagination from "./Pagination";
import { toast } from "react-toastify";

const statusColor = {
  Active: "text-green-600",
  Blocked: "text-red-500",
  Suspended: "text-yellow-500",
};

const mapAdmin = (admin) => ({
  id: admin.id,
  fullname: admin.fullname || admin.username || admin.email,
  email: admin.email,
  phone: admin.phone || admin.mobile,
  role: admin.role || "Admin",
  device_type: admin.device_type,
  device_name: admin.device_name,
  os_version: admin.os_version,
  browser: admin.browser,
  browser_version: admin.browser_version,
  ip_address: admin.ip_address,
  status: admin.status || "Active",
  created: admin.created_at
    ? new Date(admin.created_at).toLocaleDateString()
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
  fullname: "",
  email: "",
  phone: "",
  role: "Admin",
  status: "Active",
};

const OwnerAccountControlPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState(defaultForm);
  const [filters, setFilters] = useState(defaultFilters);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admins", filters],
    queryFn: async () => {
      const res = await Axios.get(API_LIST.GET_ADMIN_LIST, { params: filters });
      if (!res.data.status) throw new Error("Failed to fetch admins");
      return res.data.data;
    },
    keepPreviousData: true,
  });

  const admins = data?.map(mapAdmin) || [];
  const total = data?.total || 0;
  const pageSize = filters.pageSize;
  const currentPage = filters.page;
  const totalPages = Math.ceil(total / pageSize) || 1;

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...form }) => {
      const res = await Axios.post(`${API_LIST.UPDATE_ADMIN}/${id}`, form);
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to update admin");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setEditModalOpen(false);
      setEditUser(null);
      toast.success("Admin updated successfully!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await Axios.post(`${API_LIST.DELETE_ADMIN}/${id}`);
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to delete admin");
      return res.data;
    },
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ["admins"] });
        setModalOpen(false);
        setSelectedUser(null);
        toast.success("Admin deleted successfully!");
      }
    },
  });

  const columns = [
    { field: "fullname", headerName: "Full Name", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "phone", headerName: "Phone", width: 140 },
    { field: "role", headerName: "Role", width: 100 },
    {
      field: "device_type",
      headerName: "DEVICE TYPE",
      width: 150,
    },
    {
      field: "device_name",
      headerName: "DEVICE NAME",
      width: 150,
    },
    {
      field: "os_version",
      headerName: "OS VERSION",
      width: 150,
    },
    {
      field: "browser",
      headerName: "BROWSER",
      width: 150,
    },
    {
      field: "browser_version",
      headerName: "BROWSER VERSION",
      width: 150,
    },
    {
      field: "ip_address",
      headerName: "IP ADDRESS",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      render: (value) => (
        <span
          className={`font-medium ${statusColor[value] || "text-gray-700"}`}
        >
          {value}
        </span>
      ),
    },
    { field: "created", headerName: "Created", width: 120 },
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
            onClick={() => {
              setEditUser(row);
              setEditForm({
                fullname: row.fullname,
                email: row.email,
                phone: row.phone,
                role: row.role,
                status: row.status,
              });
              setEditModalOpen(true);
            }}
          >
            <FaEdit />
          </button>
          <button
            className="inline-flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full p-2 transition"
            title="Delete"
            onClick={() => {
              setSelectedUser({ ...row, idx });
              setModalOpen(true);
            }}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  function handleDelete() {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id);
    }
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditFormSubmit(e) {
    e.preventDefault();
    if (!editUser) return;
    updateMutation.mutate({ id: editUser.id, ...editForm });
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Filters are applied automatically via useQuery
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size) => {
    setFilters((prev) => ({ ...prev, pageSize: size, page: 1 }));
  };

  return (
    <div className="bg-[#f5f5f5] w-full min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">ADMIN/OWNER ACCOUNTS</h2>
      </div>

      {/* Filter Bar */}
      <form
        className="flex flex-wrap gap-2 items-center mb-4"
        onSubmit={handleFilterSubmit}
      >
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
          <option value="Owner">Owner</option>
          <option value="Admin">Admin</option>
          <option value="Finance">Finance</option>
          <option value="Support">Support</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
          <option value="Suspended">Suspended</option>
        </select>
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition text-sm font-medium"
        >
          Apply
        </button>
      </form>

      <div className="bg-white rounded-lg overflow-auto max-w-full shadow p-4 min-h-[200px] flex flex-col justify-center items-center">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">
            Loading admins...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-8">
            Failed to load admins: {error?.message || "Unknown error"}
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No admins found.</div>
        ) : (
          <>
            <DataTable columns={columns} data={admins} />
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
        onClose={() => setEditModalOpen(false)}
        title="Edit Admin"
        onSave={handleEditFormSubmit}
      >
        <form onSubmit={handleEditFormSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">Full Name</label>
            <input
              name="fullname"
              value={editForm.fullname}
              onChange={handleEditFormChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Email</label>
            <input
              name="email"
              value={editForm.email}
              onChange={handleEditFormChange}
              className="border rounded px-3 py-2 w-full"
              required
              type="email"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Phone</label>
            <input
              name="phone"
              value={editForm.phone}
              onChange={handleEditFormChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Role</label>
            <select
              name="role"
              value={editForm.role}
              onChange={handleEditFormChange}
              className="border rounded px-3 py-2 w-full"
              required
            >
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
              <option value="Finance">Finance</option>
              <option value="Support">Support</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Status</label>
            <select
              name="status"
              value={editForm.status}
              onChange={handleEditFormChange}
              className="border rounded px-3 py-2 w-full"
              required
            >
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold text-sm"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update Admin"}
            </button>
          </div>
        </form>
      </ReusableModal>

      {/* Delete Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete Account"
        onSave={handleDelete}
      >
        <div>
          <p>
            Are you sure you want to <b>delete</b> account{" "}
            <b>{selectedUser?.fullname}</b>?
          </p>
          <p className="text-xs text-red-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
      </ReusableModal>
    </div>
  );
};

export default OwnerAccountControlPage;
