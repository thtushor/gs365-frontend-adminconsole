import React, { useState } from "react";
import {
  usePaymentMethods,
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
} from "../hooks/usePaymentMethods";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import StatusChip from "./shared/StatusChip";
import DeleteConfirmationModal from "./shared/DeleteConfirmationModal";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { hasPermission } from "../Utils/permissions";

const PaymentMethodsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "active",
  });

  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];

  // React Query hooks
  const {
    data: paymentMethods,
    isLoading,
    isError,
    error,
  } = usePaymentMethods(statusFilter || null);
  const createMutation = useCreatePaymentMethod();
  const updateMutation = useUpdatePaymentMethod();
  const deleteMutation = useDeletePaymentMethod();

  console.log({ paymentMethods });

  const handleCreate = () => {
    setEditMode(false);
    setSelectedPaymentMethod(null);
    setFormData({ name: "", status: "active" });
    setModalOpen(true);
  };

  const handleEdit = (paymentMethod) => {
    setEditMode(true);
    setSelectedPaymentMethod(paymentMethod);
    setFormData({
      name: paymentMethod.name,
      status: paymentMethod.status,
    });
    setModalOpen(true);
  };

  const handleDelete = (paymentMethod) => {
    setItemToDelete(paymentMethod);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteMutation.mutateAsync(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Payment method name is required");
      return;
    }

    try {
      if (editMode && selectedPaymentMethod) {
        await updateMutation.mutateAsync({
          id: selectedPaymentMethod.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Payment Method Name",
      width: 200,
      render: (value, row) => <span className="font-medium">{value}</span>,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      render: (value, row) => <StatusChip status={value} size="sm" />,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 120,
      align: "center",
      render: (value, row) => (
        <div className="flex items-center justify-center space-x-2">
          {(isSuperAdmin ||
            hasPermission(permissions, "payment_manage_payment_methods")) && (
            <button
              className="inline-flex items-center justify-center text-blue-500 hover:bg-blue-100 rounded-full p-2 transition"
              title="Edit"
              onClick={() => handleEdit(row)}
            >
              <FaEdit size={14} />
            </button>
          )}
          {(isSuperAdmin ||
            hasPermission(permissions, "payment_manage_payment_methods")) && (
            <button
              className="inline-flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full p-2 transition"
              title="Delete"
              onClick={() => handleDelete(row)}
            >
              <FaTrash size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-[#f5f5f5] min-h-full p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#f5f5f5] min-h-full p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center text-red-500">
            <p>
              Error loading payment methods: {error?.message || "Unknown error"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Payment Methods</h2>
        {(isSuperAdmin ||
          hasPermission(permissions, "payment_manage_payment_methods")) && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition text-sm font-medium flex items-center space-x-2"
            onClick={handleCreate}
          >
            <FaPlus size={14} />
            <span>Create Payment Method</span>
          </button>
        )}
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <DataTable columns={columns} data={paymentMethods || []} />
      </div>

      {/* Create/Edit Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? "Edit Payment Method" : "Create Payment Method"}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method Name *
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter payment method name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </form>
      </ReusableModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Payment Method"
        message="Are you sure you want to delete this payment method?"
        itemName={itemToDelete?.name}
        isLoading={deleteMutation.isPending}
        icon="trash"
        variant="danger"
      />
    </div>
  );
};

export default PaymentMethodsPage;
