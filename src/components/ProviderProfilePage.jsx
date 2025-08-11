import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import Tabs from "./Tabs";
import ReusableModal from "./ReusableModal";
import PaymentProviderForm from "./shared/PaymentProviderForm";
import ProviderGatewayList from "./ProviderGatewayList";
import {
  FaUser,
  FaCreditCard,
  FaExchangeAlt,
  FaArrowLeft,
  FaUsers,
  FaEdit,
} from "react-icons/fa";
import StatusChip from "./shared/StatusChip";
import { toast } from "react-toastify";

const ProviderProfilePage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactInfo: "",
    commissionPercentage: "",
    status: "active",
  });

  // Fetch provider details
  const {
    data: provider,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["providerProfile", providerId],
    queryFn: async () => {
      const res = await Axios.get(`${API_LIST.PAYMENT_PROVIDER}/${providerId}`);
      if (!res?.data) throw new Error("Failed to fetch provider details");
      return res.data?.data;
    },
    enabled: !!providerId,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await Axios.post(
        `${API_LIST.UPDATE_PAYMENT_PROVIDER}/${id}`,
        data
      );
      if (!res.data.status)
        throw new Error(res.data.message || "Failed to update provider");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["providerProfile", providerId],
      });
      setModalOpen(false);
      toast.success("Provider updated successfully!");
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast.error("Failed to update provider");
    },
  });

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      name: provider?.name || "",
      contactInfo: provider?.contactInfo || "",
      commissionPercentage: provider?.commissionPercentage || "",
      status: provider?.status || "active",
    });
  };

  const handleEdit = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
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
      await updateMutation.mutateAsync({
        id: providerId,
        data: formData,
      });
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#f5f5f5] w-full min-h-full p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-gray-500 py-8">
            Loading provider details...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#f5f5f5] w-full min-h-full p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-500 py-8">
            Error loading provider details: {error?.message}
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="bg-[#f5f5f5] w-full min-h-full p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-gray-500 py-8">
            Provider not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] w-full min-h-full p-4">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/payment-providers")}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <FaArrowLeft />
          <span>Back to Payment Providers</span>
        </button>
      </div>

      <Tabs
        tabs={[
          { label: "Profile", value: "profile", icon: <FaUsers /> },

          { label: "Gateway", value: "gateway", icon: <FaCreditCard /> },
          {
            label: "Transactions",
            value: "transactions",
            icon: <FaExchangeAlt />,
          },
        ]}
        value={activeTab}
        onChange={setActiveTab}
      >
        {/* Providers Tab */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">PROVIDER DETAILS</h2>
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="border border-green-400 text-green-500 px-4 py-1 rounded hover:bg-green-50 transition text-sm font-medium mr-2 flex items-center space-x-1"
              >
                <FaEdit />
                <span>Edit Provider</span>
              </button>
              <button className="border border-green-400 text-green-500 px-4 py-1 rounded hover:bg-green-50 transition text-sm font-medium">
                Print
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {provider.name}
              </h2>
              <StatusChip status={provider.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider ID
                  </label>
                  <p className="text-gray-900 font-medium">{provider.id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Information
                  </label>
                  <p className="text-gray-900">
                    {provider.contactInfo || "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission Percentage
                  </label>
                  <p className="text-gray-900 font-medium">
                    {provider.commissionPercentage || 0}%
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <StatusChip status={provider.status} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <p className="text-gray-900">
                    {provider.created_at
                      ? new Date(provider.created_at).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Updated At
                  </label>
                  <p className="text-gray-900">
                    {provider.updated_at
                      ? new Date(provider.updated_at).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gateway Tab */}
        <div>
          <ProviderGatewayList
            providerId={providerId}
            providerName={provider.name}
          />
        </div>

        {/* Transactions Tab */}
        <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
          <FaExchangeAlt className="text-4xl mb-2" />
          <div className="text-lg font-semibold">Transactions</div>
          <div className="mt-2">
            Transaction history for {provider.name} will be displayed here.
          </div>
        </div>
      </Tabs>

      {/* Edit Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={handleModalClose}
        title="Edit Payment Provider"
        onSave={handleSubmit}
        isLoading={updateMutation.isPending}
        className="!max-w-[100vw] md:!max-w-[80vw]"
      >
        <PaymentProviderForm formData={formData} setFormData={setFormData} />
      </ReusableModal>
    </div>
  );
};

export default ProviderProfilePage;
