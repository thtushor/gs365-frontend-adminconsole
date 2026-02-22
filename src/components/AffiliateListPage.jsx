import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import Pagination from "./Pagination";
import {
  FaTrash,
  FaEdit,
  FaUserCheck,
  FaEnvelope,
  FaEnvelopeOpenText,
  FaMobile,
  FaMobileAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { CreateAgentForm } from "./shared/CreateAgentForm";
import { useAuth } from "../hooks/useAuth";
import { hasPermission } from "../Utils/permissions";

const mapAgent = (agent) => ({
  id: agent.id,
  name: agent.name || agent.fullname || agent.email,
  email: agent.email,
  mobile: agent.mobile,
  role: agent.role,
  status: agent.status,
  isVerified: agent.isVerified,
  isEmailVerified: agent.isEmailVerified,
  isPhoneVerified: agent.isPhoneVerified,
  created: agent.created_at
    ? new Date(agent.created_at).toLocaleDateString()
    : "N/A",
});

const defaultFilters = {
  keyword: "",
  role: "",
  status: "",
  page: 1,
  pageSize: 20,
};

const defaultForm = {
  name: "",
  email: "",
  mobile: "",
  role: "Affiliate",
  status: "Active",
};

const AffiliateListPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAgent, setEditAgent] = useState(null);
  const [editForm, setEditForm] = useState(defaultForm);
  const [filters, setFilters] = useState(defaultFilters);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];

  console.log(permissions, "permissions", isSuperAdmin);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["affiliates", filters],
    queryFn: async () => {
      const res = await Axios.get(API_LIST.AFFILIATE_LIST, { params: filters });
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
        throw new Error(res.data.message || "Failed to update affiliate");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliates"] });
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
        queryClient.invalidateQueries({ queryKey: ["affiliates"] });
        setDeleteModalOpen(false);
        setSelectedAgent(null);
        toast.success("Agent deleted successfully!");
      }
    },
  });

  const columns = [
    {
      field: "ID",
      headerName: "ID",
      width: 60,
      render: (_, row) => row.id,
    },
    {
      field: "username",
      headerName: "USERNAME",
      width: 140,
      render: (_, row) => (
        <Link
          to={`/affiliate-list/${row?.id}`}
          className="text-green-500 cursor-pointer font-semibold"
        >
          {row.username}
        </Link>
      ),
    },
    {
      field: "fullname",
      headerName: "FULL NAME",
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
      headerName: "EMAIL",
      width: 180,
      render: (_, row) => row.email,
    },
    {
      field: "role",
      headerName: "ROLE",
      width: 120,
      render: (_, row) =>
        row.role === "affiliate" ? "Sub Affiliate" : "Super Affiliate",
    },
    {
      field: "commission_percentage",
      headerName: "TOTAL COM. %",
      width: 120,

      render: (_, row) => row.commission_percent || 0,
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 100,
      align: "center",
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
      align: "center",
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
    // {
    //   field: "city",
    //   headerName: "Address",
    //   width: 120,
    //   render: (_, row) => row.city,
    // },
    // {
    //   field: "isLoggedIn",
    //   headerName: "Is Logged In",
    //   width: 100,
    //   render: (_, row) => (row.isLoggedIn ? "Yes" : "No"),
    // },
    {
      field: "isVerified",
      headerName: "IS VERIFIED",
      width: 100,
      render: (_, row) => (row.isVerified ? "Yes" : "No"),
    },
    {
      field: "refCode",
      headerName: "REFERRAL CODE",
      width: 120,
      render: (_, row) => row.refCode,
    },
    {
      field: "lastIp",
      headerName: "LAST IP",
      width: 120,
      render: (_, row) => row.lastIp,
    },
    {
      field: "lastLogin",
      headerName: "LAST LOGIN",
      width: 160,
      render: (_, row) =>
        row.lastLogin ? new Date(row.lastLogin).toLocaleString() : "",
    },
    {
      field: "device_type",
      headerName: "DEVICE TYPE",
      width: 120,
      render: (_, row) => row.device_type,
    },
    // {
    //   field: "device_name",
    //   headerName: "Device Name",
    //   width: 120,
    //   render: (_, row) => row.device_name,
    // },
    // {
    //   field: "os_version",
    //   headerName: "OS Version",
    //   width: 120,
    //   render: (_, row) => row.os_version,
    // },
    // {
    //   field: "browser",
    //   headerName: "Browser",
    //   width: 120,
    //   render: (_, row) => row.browser,
    // },
    // {
    //   field: "browser_version",
    //   headerName: "Browser Version",
    //   width: 120,
    //   render: (_, row) => row.browser_version,
    // },
    // {
    //   field: "ip_address",
    //   headerName: "IP Address",
    //   width: 120,
    //   render: (_, row) => row.ip_address,
    // },
    // {
    //   field: "total_sub_affiliates",
    //   headerName: "Total Sub",
    //   width: 120,
    //   render: (_, row) => row.total_sub_affiliates || 0,
    // },
    // {
    //   field: "total_balance",
    //   headerName: "Total Balance",
    //   width: 120,
    //   render: (_, row) => row.total_balance || 0,
    // },
    // {
    //   field: "total_withdraw",
    //   headerName: "Total Withdraw",
    //   width: 120,
    //   render: (_, row) => row.total_withdraw || 0,
    // },
    {
      field: "action",
      headerName: "ACTION",
      width: 120,
      align: "center",
      render: (value, row, idx) => (
        <div className="flex gap-2 justify-center">
          {(isSuperAdmin ||
            hasPermission(permissions, "affiliate_edit_affiliate")) && (
            <button
              className="inline-flex items-center justify-center text-green-500 hover:bg-green-100 rounded-full p-2 transition"
              title="Edit"
              onClick={() => handleEdit(row)}
            >
              <FaEdit />
            </button>
          )}
          {(isSuperAdmin ||
            hasPermission(permissions, "affiliate_edit_affiliate")) && (
            <>
              <button
                className={`inline-flex items-center justify-center rounded-full p-2 transition ${
                  row.isEmailVerified
                    ? "text-green-600 hover:bg-green-100"
                    : "text-purple-600 hover:bg-purple-100"
                }`}
                title={row.isEmailVerified ? "Unverify Email" : "Verify Email"}
                onClick={() => {
                  const newStatus = !row.isEmailVerified;
                  if (
                    window.confirm(
                      `Are you sure you want to ${
                        newStatus ? "verify" : "unverify"
                      } ${row.username}'s email?`,
                    )
                  ) {
                    updateMutation.mutate({
                      id: row.id,
                      isEmailVerified: newStatus,
                    });
                  }
                }}
              >
                {row.isEmailVerified ? (
                  <FaEnvelopeOpenText size={14} />
                ) : (
                  <FaEnvelope size={14} />
                )}
              </button>
              <button
                className={`inline-flex items-center justify-center rounded-full p-2 transition ${
                  row.isPhoneVerified
                    ? "text-green-600 hover:bg-green-100"
                    : "text-purple-600 hover:bg-purple-100"
                }`}
                title={row.isPhoneVerified ? "Unverify Phone" : "Verify Phone"}
                onClick={() => {
                  const newStatus = !row.isPhoneVerified;
                  if (
                    window.confirm(
                      `Are you sure you want to ${
                        newStatus ? "verify" : "unverify"
                      } ${row.username}'s phone?`,
                    )
                  ) {
                    updateMutation.mutate({
                      id: row.id,
                      isPhoneVerified: newStatus,
                    });
                  }
                }}
              >
                {row.isPhoneVerified ? (
                  <FaMobileAlt size={14} />
                ) : (
                  <FaMobile size={14} />
                )}
              </button>
            </>
          )}
          {(isSuperAdmin ||
            hasPermission(permissions, "affiliate_delete_affiliate")) && (
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
          )}
        </div>
      ),
    },
  ];

  const handleEdit = (row) => {
    console.log(row);
    setEditAgent(row);
    setEditForm({
      username: row.username || "",
      fullname: row.fullname || row.name || "",
      phone: row.phone ? row?.phone : row.mobile ? row.mobile : "",
      email: row.email || "",
      password: "",
      role: row.role || "",
      city: row.city || "",
      street: row.street || "",
      minTrx: String(row.minTrx) || "",
      maxTrx: String(row.maxTrx) || "",
      currency: row.currency || 11,
      status: row.status || "Active",
      commission_percent: row.commission_percent || null,
      referred_by: row.referred_by || null,
      designation: row.designation || null,
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
    { value: "affiliate", label: "Affiliate" },
    { value: "superAffiliate", label: "Super Affiliate" },
  ];
  return (
    <div className="bg-[#f5f5f5] w-full min-h-full p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Affiliate List</h2>
        {(isSuperAdmin ||
          hasPermission(permissions, "affiliate_create_affiliate")) && (
          <button
            className="bg-green-500 text-center text-white px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
            onClick={() => navigate("/create-affiliate")}
          >
            Create Affiliate
          </button>
        )}
      </div>
      {/* Filter Bar */}
      <form className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          name="keyword"
          placeholder="Name/Email"
          value={filters.keyword}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 text-sm sm:w-40 w-full focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 text-sm sm:w-40 w-full focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          <option value="">All Roles</option>
          <option value="superAffiliate">Super Affiliate</option>
          <option value="affiliate">Sub Affiliate</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 text-sm sm:w-40 w-full focus:outline-none focus:ring-2 focus:ring-green-200"
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
          <div className="text-center text-gray-500 py-8">
            No affiliates found.
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={agents}
              isSuperAdmin={isSuperAdmin}
              permissions={permissions}
              exportPermission="affiliate_view_affiliate_list"
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
      {/* Edit Modal */}
      <ReusableModal
        open={editModalOpen}
        className={"min-w-[80vw] min-h-[60vh] overflow-auto"}
        onClose={() => setEditModalOpen(false)}
        title="Edit Affiliate"
        // onSave={handleEditFormSubmit}
      >
        <CreateAgentForm
          onSubmit={handleEditFormSubmit}
          initialValues={editForm}
          isLoading={updateMutation.isPending}
          isEdit={true}
          roles={roles}
          isAffiliate={true}
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
            Are you sure you want to <b>delete</b> affiliate{" "}
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

export default AffiliateListPage;
