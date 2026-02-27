import React from "react";

const PaymentProviderForm = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      {/* First Row - Name and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter provider name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

      {/* Second Row - Contact Info and Commission Percentage */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Info *
          </label>
          <textarea
            value={formData.contactInfo}
            onChange={(e) =>
              setFormData({ ...formData, contactInfo: e.target.value })
            }
            placeholder="Enter contact information"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commission Percentage *
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.commissionPercentage || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                commissionPercentage: e.target.value
                  ? parseInt(e.target.value)
                  : "",
              })
            }
            placeholder="0-100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter a value between 0 and 100
          </p>
        </div>
      </div>

      {/* Third Row - Automated and Tag */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isAutomated"
            checked={formData.isAutomated || false}
            onChange={(e) =>
              setFormData({ ...formData, isAutomated: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isAutomated"
            className="text-sm font-medium text-gray-700"
          >
            Is Automated Payment Provider?
          </label>
        </div>

        {formData.isAutomated && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider Tag
            </label>
            <select
              value={formData.tag || ""}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Tag</option>
              <option value="VEXORA">VEXORA</option>
              <option value="OXAPAY">OXAPAY</option>
              <option value="COINSPAY">COINSPAY</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentProviderForm;
