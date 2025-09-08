import React from "react";
import { usePaymentGateways } from "../../hooks/usePaymentGateways";
import { usePaymentProviders } from "../../hooks/usePaymentProviders";

const GatewayProviderForm = ({
  formData,
  setFormData,
  isEditMode = false,
  editData = null,
}) => {
  const { data: paymentGateways } = usePaymentGateways();
  const { data: paymentProviders } = usePaymentProviders();

  // Initialize form data with edit data if in edit mode
  React.useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        gatewayId: editData.gateway?.id || "",
        providerId: editData.provider?.id || "",
        priority: editData.priority || "",
        status: editData.status || "active",
        commission: 0,
        licenseKey: editData.licenseKey || "",
        isRecommended: editData.isRecommended || false,
      });
    }
  }, [isEditMode, editData, setFormData]);

  return (
    <div className="space-y-6">
      {/* First Row - Gateway and Provider */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gateway *
          </label>
          <select
            value={formData.gatewayId}
            onChange={(e) =>
              setFormData({
                ...formData,
                gatewayId: parseInt(e.target.value),
              })
            }
            disabled={isEditMode} // Disable gateway selection in edit mode
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select Gateway</option>
            {paymentGateways?.data?.map((gateway) => (
              <option key={gateway.id} value={gateway.id}>
                {gateway.name}
              </option>
            ))}
          </select>
          {isEditMode && (
            <p className="text-xs text-gray-500 mt-1">
              Gateway cannot be changed in edit mode
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider *
          </label>
          <select
            value={formData.providerId}
            onChange={(e) =>
              setFormData({
                ...formData,
                providerId: parseInt(e.target.value),
              })
            }
            disabled={isEditMode} // Disable provider selection in edit mode
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select Provider</option>
            {paymentProviders?.data?.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
          {isEditMode && (
            <p className="text-xs text-gray-500 mt-1">
              Provider cannot be changed in edit mode
            </p>
          )}
        </div>
      </div>

      {/* Second Row - Priority and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <input
            type="number"
            min="1"
            value={formData.priority || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Third Row - Commission and License Key */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commission (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={0}
            // onChange={(e) =>
            //   setFormData({
            //     ...formData,
            //     commission: parseFloat(e.target.value) || "",
            //   })
            // }
            placeholder="0.00"
            className="w-full px-3 py-2 border disabled:opacity-40 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
          <p className="text-sm text-gray-500 mt-1">
            Commission percentage (0-100)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Key
          </label>
          <input
            type="text"
            value={formData.licenseKey || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                licenseKey: e.target.value,
              })
            }
            placeholder="Enter license key"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Fourth Row - Is Recommended */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mark as Recommended
          </label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  isRecommended: !formData.isRecommended,
                })
              }
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out
                ${
                  formData.isRecommended
                    ? "bg-blue-500 hover:bg-blue-600 shadow-lg"
                    : "bg-gray-300 hover:bg-gray-400"
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ease-in-out shadow-md
                  ${formData.isRecommended ? "translate-x-6" : "translate-x-1"}
                `}
              />
            </button>
            <span className="text-sm text-gray-600">
              {formData.isRecommended ? "Recommended" : "Not Recommended"}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Recommended providers will be prioritized in the selection process
          </p>
        </div>
      </div>
    </div>
  );
};

export default GatewayProviderForm;
