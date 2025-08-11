import React, { useState, useEffect } from "react";
import {
  usePaymentGateways,
  useCreatePaymentGateway,
  useUpdatePaymentGateway,
  useDeletePaymentGateway,
} from "../hooks/usePaymentGateways";
import { usePaymentMethodTypes } from "../hooks/usePaymentMethodTypes";
import { useCountryData } from "../hooks/useCountryData";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import StatusChip from "./shared/StatusChip";
import DeleteConfirmationModal from "./shared/DeleteConfirmationModal";
import PaymentGatewayForm from "./shared/PaymentGatewayForm";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { usePaymentMethods } from "../hooks/usePaymentMethods";

const PaymentGatewaysPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    countryId: "",
    methodId: "",
    name: "",
    network: "",
  });

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    paymentMethodTypeIds: [],
    status: "active",
    iconUrl: "",
    minDeposit: "",
    maxDeposit: "",
    minWithdraw: "",
    maxWithdraw: "",
    countryId: "",
    network: "",
    currencyConversionRate: "",
  });

  // React Query hooks
  const {
    data: paymentGateways,
    isLoading,
    isError,
    error,
  } = usePaymentGateways(filters);

  const { data: paymentMethodTypes } = usePaymentMethodTypes();
  const { useCountries } = useCountryData();
  const { data: countries } = useCountries();

  const createMutation = useCreatePaymentGateway();
  const updateMutation = useUpdatePaymentGateway();
  const deleteMutation = useDeletePaymentGateway();
  const { data: paymentMethods } = usePaymentMethods();

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      name: "",
      paymentMethodTypeIds: [],
      status: "active",
      iconUrl: "",
      minDeposit: "",
      maxDeposit: "",
      minWithdraw: "",
      maxWithdraw: "",
      countryId: "",
      network: "",
      currencyConversionRate: "",
    });
    setUploadedImage(null);
  };

  const handleCreate = () => {
    setEditMode(false);
    setSelectedGateway(null);
    resetForm();
    setModalOpen(true);
  };

  const handleEdit = (gateway) => {
    setEditMode(true);
    setSelectedGateway(gateway);
    setFormData({
      name: gateway.name || "",
      paymentMethodTypeIds: gateway.paymentMethodTypeIds || [],
      status: gateway.status || "active",
      iconUrl: gateway.iconUrl || "",
      methodId: gateway.methodId,
      minDeposit: gateway.minDeposit || "",
      maxDeposit: gateway.maxDeposit || "",
      minWithdraw: gateway.minWithdraw || "",
      maxWithdraw: gateway.maxWithdraw || "",
      countryId: gateway.countryId || "",
      network: gateway.network || "",
      currencyConversionRate: gateway.currencyConversionRate || "",
    });
    setUploadedImage(gateway.iconUrl ? [gateway.iconUrl] : null);
    setModalOpen(true);
  };

  const handleDelete = (gateway) => {
    setItemToDelete(gateway);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteMutation.mutateAsync(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      toast.success("Payment gateway deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete payment gateway");
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Payment gateway name is required");
      return;
    }

    if (!formData.countryId) {
      toast.error("Country is required");
      return;
    }

    if (formData.paymentMethodTypeIds.length === 0) {
      toast.error("At least one payment method type is required");
      return;
    }

    try {
      const payload = {
        ...formData,
        iconUrl: uploadedImage?.[0]?.original || formData.iconUrl,
        minDeposit: parseFloat(formData.minDeposit) || 0,
        maxDeposit: parseFloat(formData.maxDeposit) || 0,
        minWithdraw: parseFloat(formData.minWithdraw) || 0,
        maxWithdraw: parseFloat(formData.maxWithdraw) || 0,
        currencyConversionRate:
          parseFloat(formData.currencyConversionRate) || 1,
      };

      if (editMode && selectedGateway) {
        await updateMutation.mutateAsync({
          id: selectedGateway.id,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(
        editMode
          ? "Failed to update payment gateway"
          : "Failed to create payment gateway"
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
    }));
  };

  const columns = [
    {
      field: "name",
      headerName: "Gateway Name",
      width: 200,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          {row.iconUrl && (
            <img
              src={row.iconUrl}
              alt={value}
              className="w-8 h-8 rounded object-cover"
            />
          )}
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      field: "network",
      headerName: "Network",
      width: 150,
      render: (value) => <span className="text-gray-700">{value || "-"}</span>,
    },
    {
      field: "countryId",
      headerName: "Country",
      width: 150,
      render: (value) => {
        const country = countries?.data?.find((c) => c.id === value);
        return <span className="text-gray-700">{country?.name || "-"}</span>;
      },
    },
    {
      field: "minDeposit",
      headerName: "Min Deposit",
      width: 120,
      render: (value) => <span className="text-gray-700">${value || 0}</span>,
    },
    {
      field: "maxDeposit",
      headerName: "Max Deposit",
      width: 120,
      render: (value) => <span className="text-gray-700">${value || 0}</span>,
    },
    {
      field: "minWithdraw",
      headerName: "Min Withdraw",
      width: 120,
      render: (value) => <span className="text-gray-700">${value || 0}</span>,
    },
    {
      field: "maxWithdraw",
      headerName: "Max Withdraw",
      width: 120,
      render: (value) => <span className="text-gray-700">${value || 0}</span>,
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
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Gateways</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Create Gateway</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              Country
            </label>
            <select
              value={filters.countryId}
              onChange={(e) => handleFilterChange("countryId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Countries</option>
              {countries?.data?.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={filters.methodId}
              onChange={(e) => handleFilterChange("methodId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Methods</option>
              {paymentMethods?.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method Types
            </label>
            <select
              value={filters.paymentMethodTypeId}
              onChange={(e) =>
                handleFilterChange("paymentMethodTypeId", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Methods</option>
              {paymentMethodTypes?.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

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
              Network
            </label>
            <input
              type="text"
              value={filters.network}
              onChange={(e) => handleFilterChange("network", e.target.value)}
              placeholder="Search by network..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={paymentGateways?.data || []}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      {/* Create/Edit Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={handleModalClose}
        title={editMode ? "Edit Payment Gateway" : "Create Payment Gateway"}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
        className="!max-w-[100vw] md:!max-w-[80vw]"
      >
        <PaymentGatewayForm
          formData={formData}
          setFormData={setFormData}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
        />
      </ReusableModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Payment Gateway"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default PaymentGatewaysPage;
