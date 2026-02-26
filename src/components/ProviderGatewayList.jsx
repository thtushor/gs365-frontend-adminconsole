import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGatewayProvidersByProvider,
  useAssignProviderToGateway,
  useUpdateGatewayProviderPriority,
  useUpdateGatewayProviderStatus,
  useRemoveProviderFromGateway,
  useUpdateGatewayProviderRecommendation,
  useUpdateGatewayProvider,
} from "../hooks/useGatewayProviders";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import GatewayProviderForm from "./shared/GatewayProviderForm";
import StatusChip from "./shared/StatusChip";
import DeleteConfirmationModal from "./shared/DeleteConfirmationModal";
import ActionDropdown from "./shared/ActionDropdown";
import Pagination from "./Pagination";
import {
  FaCreditCard,
  FaSort,
  FaToggleOn,
  FaToggleOff,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { toast } from "react-toastify";

const ProviderGatewayList = ({ providerId, providerName }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    gatewayId: "",
    providerId: "",
    status: "",
  });
  const [formData, setFormData] = useState({
    gatewayId: "",
    providerId: providerId, // Pre-select the current provider
    priority: "",
    status: "active",
    commission: 0,
    licenseKey: "",
    isRecommended: false,
  });
  const [priorityData, setPriorityData] = useState({
    id: "",
    priority: "",
  });

  // React Query hooks
  const {
    data: gatewayProviders,
    isLoading,
    isError,
    error,
  } = useGatewayProvidersByProvider(providerId);
  const assignMutation = useAssignProviderToGateway();
  const updatePriorityMutation = useUpdateGatewayProviderPriority();
  const updateStatusMutation = useUpdateGatewayProviderStatus();
  const removeMutation = useRemoveProviderFromGateway();
  const updateRecommendationMutation = useUpdateGatewayProviderRecommendation();
  const updateProviderMutation = useUpdateGatewayProvider();

  console.log({ gatewayProviders });

  // Pagination calculation
  const total = gatewayProviders?.pagination?.total || 0;
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
      gatewayId: "",
      providerId: providerId, // Keep the current provider selected
      priority: "",
      status: "active",
      commission: "",
      licenseKey: "",
      isRecommended: false,
    });
  };

  const handleCreate = () => {
    setSelectedRelationship(null);
    setIsEditMode(false);
    setEditData(null);
    resetForm();
    setModalOpen(true);
  };

  const handleEdit = (relationship) => {
    setSelectedRelationship(relationship);
    setIsEditMode(true);
    setEditData(relationship);
    setModalOpen(true);
  };

  const handleEditPriority = (relationship) => {
    setSelectedRelationship(relationship);
    setPriorityData({
      id: relationship.id,
      priority: relationship.priority || 1,
    });
    setPriorityModalOpen(true);
  };

  const handleDelete = (relationship) => {
    setItemToDelete(relationship);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await removeMutation.mutateAsync(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to remove provider from gateway");
    }
  };

  const handleSubmit = async () => {
    if (!formData.gatewayId) {
      toast.error("Gateway is required");
      return;
    }
    if (!formData.providerId) {
      toast.error("Provider is required");
      return;
    }

    try {
      if (isEditMode && selectedRelationship) {
        // Update existing relationship
        await updateProviderMutation.mutateAsync({
          id: selectedRelationship.id,
          data: formData,
        });
      } else {
        // Create new relationship
        await assignMutation.mutateAsync(formData);
      }
      setModalOpen(false);
      resetForm();
      setIsEditMode(false);
      setEditData(null);
      setSelectedRelationship(null);
    } catch (error) {
      console.error("Submit failed:", error);
      toast.error(
        isEditMode
          ? "Failed to update gateway provider"
          : "Failed to assign provider to gateway"
      );
    }
  };

  const handlePrioritySubmit = async () => {
    if (!priorityData.priority || priorityData.priority < 1) {
      toast.error("Priority must be at least 1");
      return;
    }

    try {
      await updatePriorityMutation.mutateAsync({
        id: priorityData.id,
        priority: priorityData.priority,
      });
      setPriorityModalOpen(false);
      setPriorityData({ id: "", priority: "" });
    } catch (error) {
      console.error("Priority update failed:", error);
      toast.error("Failed to update priority");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error(`Failed to update status to ${newStatus}`);
    }
  };

  const handleRecommendationToggle = async (id, currentIsRecommended) => {
    try {
      await updateRecommendationMutation.mutateAsync({
        id,
        isRecommended: !currentIsRecommended,
      });
    } catch (error) {
      console.error("Recommendation update failed:", error);
      toast.error(`Failed to update recommendation status`);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    resetForm();
    setIsEditMode(false);
    setEditData(null);
    setSelectedRelationship(null);
  };

  const handlePriorityModalClose = () => {
    setPriorityModalOpen(false);
    setPriorityData({ id: "", priority: "" });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleGatewayClick = (gateway, gatewayProviderId) => {
    if (gateway?.id) {
      navigate(
        `/gateway-management/${gateway.id}/provider/${providerId}/gateway-provider/${gatewayProviderId}`
      );
    }
  };

  const getActionsForRow = (row) => {
    return [
      {
        label: row?.status === "active" ? "Deactivate" : "Activate",
        icon: (
          <div
            className={`
            w-3 h-3 rounded-full transition-all duration-300
            ${row?.status === "active" ? "bg-green-500" : "bg-gray-400"}
          `}
          ></div>
        ),
        onClick: () => handleStatusToggle(row.id, row?.status),
        disabled: updateStatusMutation.isPending,
        className: "hover:bg-gray-100",
      },
      {
        label: `Mark as ${row?.isRecommended ? "Not Recommended" : "Recommended"
          }`,
        icon: (
          <FaToggleOn
            size={14}
            className={row?.isRecommended ? "text-blue-500" : "text-gray-400"}
          />
        ),
        onClick: () => handleRecommendationToggle(row.id, row?.isRecommended),
        disabled: updateRecommendationMutation.isPending,
        className: "hover:bg-gray-100",
      },
      {
        label: "Edit",
        icon: <FaEdit size={14} />,
        onClick: () => handleEdit(row),
        className: "text-blue-600 hover:bg-blue-50",
      },
      {
        label: "Edit Priority",
        icon: <FaSort size={14} />,
        onClick: () => handleEditPriority(row),
        className: "text-yellow-600 hover:bg-yellow-50",
      },
      {
        label: "Remove",
        icon: <FaTrash size={14} />,
        onClick: () => handleDelete(row),
        className: "text-red-600 hover:bg-red-50",
      },
    ];
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      field: "gateway",
      headerName: "Gateway",
      width: 200,
      render: (value, row) => {
        const isAutomated = row?.provider?.isAutomated;
        console.log({ row })
        return (
          <div
            className={`flex items-center space-x-2 p-2 rounded transition-colors duration-200 ${isAutomated
              ? "cursor-not-allowed opacity-75"
              : "cursor-pointer hover:bg-gray-50"
              }`}
            onClick={() => !isAutomated && handleGatewayClick(value, row?.id)}
            title={
              isAutomated
                ? "Automated providers do not require manual account management"
                : "Click to manage gateway account"
            }
          >
            {value?.iconUrl && (
              <img
                src={value.iconUrl}
                alt={value.name}
                className="w-6 h-6 rounded object-cover"
              />
            )}
            <span
              className={`font-medium ${isAutomated ? "text-gray-500" : "text-green-500"
                }`}
            >
              {value?.name || "-"}
            </span>
          </div>
        );
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      render: (value) => (
        <span className="text-gray-700 font-medium">{value || 1}</span>
      ),
    },
    {
      field: "commission",
      headerName: "Commission",
      width: 120,
      render: (value) => (
        <span className="text-gray-700 font-medium">
          {value ? `${value}%` : "-"}
        </span>
      ),
    },
    {
      field: "isRecommended",
      headerName: "Recommended",
      width: 120,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          {value ? (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium text-sm">Yes</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-500 font-medium text-sm">No</span>
            </div>
          )}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <StatusChip status={value} />
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      render: (value, row) => (
        <ActionDropdown
          actions={getActionsForRow(row)}
          isLoading={
            updateStatusMutation.isPending ||
            updateRecommendationMutation.isPending
          }
        />
      ),
    },
  ];

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-500 py-8">
          Error loading gateway providers: {error?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Gateway Providers for {providerName}
          </h3>
          <p className="text-gray-600">
            Showing {gatewayProviders?.data?.length || 0} gateway provider(s)
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Assign Gateway</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gateway ID
            </label>
            <input
              type="number"
              value={filters.gatewayId}
              onChange={(e) => handleFilterChange("gatewayId", e.target.value)}
              placeholder="Filter by gateway ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider ID
            </label>
            <input
              type="number"
              value={filters.providerId}
              onChange={(e) => handleFilterChange("providerId", e.target.value)}
              placeholder="Filter by provider ID"
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
        </div>
      </div>

      {/* Data Table */}
      {gatewayProviders?.data?.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <FaCreditCard className="text-4xl mb-2 mx-auto" />
          <div className="text-lg font-semibold">No Gateway Providers</div>
          <div className="mt-2">
            No gateway providers found for {providerName}.
          </div>
        </div>
      ) : (
        <>
          <DataTable
            data={gatewayProviders?.data || []}
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

      {/* Assign Gateway Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={handleModalClose}
        title={isEditMode ? "Edit Gateway Provider" : "Assign Gateway"}
        onSave={handleSubmit}
        isLoading={
          isEditMode
            ? updateProviderMutation.isPending
            : assignMutation.isPending
        }
        className="!max-w-[100vw] md:!max-w-[80vw]"
      >
        <GatewayProviderForm
          formData={formData}
          setFormData={setFormData}
          isEditMode={isEditMode}
          editData={editData}
          providerId={providerId} // Pass the current provider ID
        />
      </ReusableModal>

      {/* Priority Update Modal */}
      <ReusableModal
        open={priorityModalOpen}
        onClose={handlePriorityModalClose}
        title="Update Priority"
        onSave={handlePrioritySubmit}
        isLoading={updatePriorityMutation.isPending}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <input
              type="number"
              min="1"
              value={priorityData.priority || ""}
              onChange={(e) =>
                setPriorityData({
                  ...priorityData,
                  priority: parseInt(e.target.value) || "",
                })
              }
              placeholder="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Lower number = higher priority
            </p>
          </div>
        </div>
      </ReusableModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={removeMutation.isPending}
        title="Remove Provider from Gateway"
        message={`Are you sure you want to remove "${itemToDelete?.provider?.name}" from "${itemToDelete?.gateway?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ProviderGatewayList;
