import React, { useState } from "react";
import {
  usePaymentProviders,
  useCreatePaymentProvider,
  useUpdatePaymentProvider,
  useDeletePaymentProvider,
} from "../hooks/usePaymentProviders";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import PaymentProviderForm from "./shared/PaymentProviderForm";
import StatusChip from "./shared/StatusChip";
import DeleteConfirmationModal from "./shared/DeleteConfirmationModal";
import Pagination from "./Pagination";
import GatewayProvidersPage from "./GatewayProvidersPage";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PaymentProvidersPage = () => {
  const [activeTab, setActiveTab] = useState("providers");

  // Tab component
  const TabButton = ({ tab, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
        isActive
          ? "bg-white text-blue-600 border-b-2 border-blue-600"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  // Providers Tab Content
  const ProvidersTab = () => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [filters, setFilters] = useState({
      page: 1,
      pageSize: 10,
      status: "",
      name: "",
      commissionPercentage: "",
      gatewayId: "",
      providerId: "",
    });
    const [formData, setFormData] = useState({
      name: "",
      contactInfo: "",
      commissionPercentage: "",
      status: "active",
    });

    // React Query hooks
    const {
      data: paymentProviders,
      isLoading,
      isError,
      error,
    } = usePaymentProviders(filters);
    const createMutation = useCreatePaymentProvider();
    const updateMutation = useUpdatePaymentProvider();
    const deleteMutation = useDeletePaymentProvider();

    console.log({ paymentProviders });

    // Pagination calculation
    const total = paymentProviders?.pagination?.total || 0;
    const totalPages = Math.ceil(total / filters.pageSize) || 1;

    const handlePageChange = (page) => {
      setFilters((prev) => ({ ...prev, page }));
    };

    const handlePageSizeChange = (pageSize) => {
      setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
    };

    // Reset form to default values
    const resetForm = () => {
      setFormData({
        name: "",
        contactInfo: "",
        commissionPercentage: "",
        status: "active",
      });
    };

    const handleCreate = () => {
      console.log("Opening create modal");
      setEditMode(false);
      setSelectedProvider(null);
      resetForm();
      setModalOpen(true);
      console.log("Modal state:", modalOpen);
    };

    const handleEdit = (provider) => {
      setEditMode(true);
      setSelectedProvider(provider);
      setFormData({
        name: provider.name || "",
        contactInfo: provider.contactInfo || "",
        commissionPercentage: provider.commissionPercentage || "",
        status: provider.status || "active",
      });
      setModalOpen(true);
    };

    const handleDelete = (provider) => {
      setItemToDelete(provider);
      setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
      if (!itemToDelete) return;

      try {
        await deleteMutation.mutateAsync(itemToDelete.id);
        setDeleteModalOpen(false);
        setItemToDelete(null);
        toast.success("Payment provider deleted successfully");
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete payment provider");
      }
    };

    const handleSubmit = async () => {
      // Add validation
      if (!formData.name?.trim()) {
        toast.error("Provider name is required");
        return;
      }
      if (!formData.contactInfo?.trim()) {
        toast.error("Contact info is required");
        return;
      }
      if (
        !formData.commissionPercentage ||
        formData.commissionPercentage < 0 ||
        formData.commissionPercentage > 100
      ) {
        toast.error("Commission percentage must be between 0 and 100");
        return;
      }

      try {
        if (editMode) {
          await updateMutation.mutateAsync({
            id: selectedProvider.id,
            data: formData,
          });
        } else {
          await createMutation.mutateAsync(formData);
        }
        setModalOpen(false);
        resetForm();
      } catch (error) {
        console.error("Submit failed:", error);
        toast.error(
          editMode
            ? "Failed to update payment provider"
            : "Failed to create payment provider"
        );
      }
    };

    const handleModalClose = () => {
      setModalOpen(false);
      resetForm();
    };

    const handleFilterChange = (key, value) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: 1, // Reset to first page when filters change
      }));
    };

    const columns = [
      {
        field: "id",
        headerName: "ID",
        width: 80,
        render: (value) => <span className="text-gray-600">{value}</span>,
      },
      {
        field: "name",
        headerName: "Provider Name",
        width: 200,
        render: (value, row) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/payment-providers/${row.id}`)}
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              {value}
            </button>
          </div>
        ),
      },
      {
        field: "contactInfo",
        headerName: "Contact Info",
        width: 300,
        render: (value) => (
          <div className="max-w-xs truncate" title={value}>
            <span className="text-gray-700">{value || "-"}</span>
          </div>
        ),
      },
      {
        field: "commissionPercentage",
        headerName: "Commission %",
        width: 120,
        render: (value) => (
          <span className="text-gray-700 font-medium">{value || 0}%</span>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
        render: (value) => <StatusChip status={value} />,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        render: (value, row) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(row)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ];

    if (isError) {
      return (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-medium">
              Error loading payment providers
            </h3>
            <p className="text-red-600 mt-1">{error?.message}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Providers
          </h1>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Provider</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-medium mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                placeholder="Search by name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission %
              </label>
              <input
                type="number"
                value={filters.commissionPercentage}
                onChange={(e) =>
                  handleFilterChange("commissionPercentage", e.target.value)
                }
                placeholder="Filter by %"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gateway ID
              </label>
              <input
                type="number"
                value={filters.gatewayId}
                onChange={(e) =>
                  handleFilterChange("gatewayId", e.target.value)
                }
                placeholder="Filter by gateway"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : isError ? (
          <p className="text-red-500 text-center">{error?.message}</p>
        ) : paymentProviders?.data?.length === 0 ? (
          <p className="text-center text-gray-500">
            No payment providers found.
          </p>
        ) : (
          <>
            <DataTable
              data={paymentProviders?.data || []}
              columns={columns}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              pageSize={filters.pageSize}
              pageSizeOptions={[5, 10, 20, 50]}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}

        {/* Create/Edit Modal */}
        <ReusableModal
          open={modalOpen}
          onClose={handleModalClose}
          title={editMode ? "Edit Payment Provider" : "Create Payment Provider"}
          onSave={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
          className="!max-w-[100vw] md:!max-w-[80vw]"
        >
          <PaymentProviderForm formData={formData} setFormData={setFormData} />
        </ReusableModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          isLoading={deleteMutation.isPending}
          title="Delete Payment Provider"
          message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 p-4">
          <TabButton
            tab="providers"
            label="Providers"
            isActive={activeTab === "providers"}
            onClick={() => setActiveTab("providers")}
          />
          <TabButton
            tab="gateway"
            label="Gateway"
            isActive={activeTab === "gateway"}
            onClick={() => setActiveTab("gateway")}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50">
        {activeTab === "providers" && <ProvidersTab />}
        {activeTab === "gateway" && <GatewayProvidersPage />}
      </div>
    </div>
  );
};

export default PaymentProvidersPage;
