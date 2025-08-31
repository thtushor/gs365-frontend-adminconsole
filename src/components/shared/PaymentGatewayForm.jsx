import React from "react";
import ImageUploader from "./ImageUploader";
import { usePaymentMethodTypes } from "../../hooks/usePaymentMethodTypes";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import { useCountryData } from "../../hooks/useCountryData";

const PaymentGatewayForm = ({
  formData,
  setFormData,
  uploadedImage,
  setUploadedImage,
}) => {
  const { data: paymentMethodTypes } = usePaymentMethodTypes();
  const { data: paymentMethods } = usePaymentMethods();

  const { useCountries } = useCountryData();
  const { data: countries } = useCountries();

  return (
    <div className="space-y-6">
      {/* First Row - Name and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gateway Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter gateway name"
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

      {/* Second Row - Payment Method Types and Country */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method Types *
          </label>
          <select
            multiple
            value={formData.paymentMethodTypeIds}
            onChange={(e) => {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => parseInt(option.value)
              );
              setFormData({
                ...formData,
                paymentMethodTypeIds: selectedOptions,
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {paymentMethodTypes?.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Hold Ctrl/Cmd to select multiple
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method *
          </label>
          <select
            value={formData.methodId}
            onChange={(e) =>
              setFormData({
                ...formData,
                methodId: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Payment Method</option>
            {paymentMethods?.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Third Row - Country and Network */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <select
            value={formData.countryId}
            onChange={(e) =>
              setFormData({
                ...formData,
                countryId: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Country</option>
            {countries?.data?.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Network
          </label>
          <input
            type="text"
            value={formData.network}
            onChange={(e) =>
              setFormData({ ...formData, network: e.target.value })
            }
            placeholder="e.g., bKash, PayPal"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Fourth Row - Currency Conversion Rate */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency Conversion Rate
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.currencyConversionRate}
            onChange={(e) =>
              setFormData({
                ...formData,
                currencyConversionRate: e.target.value,
              })
            }
            placeholder="1.0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Fifth Row - Min/Max Deposit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Deposit
          </label>
          <input
            type="number"
            value={formData.minDeposit}
            onChange={(e) =>
              setFormData({ ...formData, minDeposit: e.target.value })
            }
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Deposit
          </label>
          <input
            type="number"
            value={formData.maxDeposit}
            onChange={(e) =>
              setFormData({ ...formData, maxDeposit: e.target.value })
            }
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sixth Row - Min/Max Withdraw */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Withdraw
          </label>
          <input
            type="number"
            value={formData.minWithdraw}
            onChange={(e) =>
              setFormData({ ...formData, minWithdraw: e.target.value })
            }
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Withdraw
          </label>
          <input
            type="number"
            value={formData.maxWithdraw}
            onChange={(e) =>
              setFormData({ ...formData, maxWithdraw: e.target.value })
            }
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bonus (%)
          </label>
          <input
            type="number"
            value={formData.bonus}
            onChange={(e) =>
              setFormData({ ...formData, bonus: e.target.value })
            }
            placeholder="0"
            min={0}
            max={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}
      </div>

      {/* Full Width - Icon Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Icon
        </label>
        <ImageUploader
          isMultiple={false}
          previewImage={uploadedImage}
          setUploadRes={(uploadResult) => {
            setUploadedImage(uploadResult);
            // If upload was successful and we have a URL, update the form data
            if (uploadResult && uploadResult.status && uploadResult.data) {
              setFormData({
                ...formData,
                iconUrl: uploadResult.data?.original,
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default PaymentGatewayForm;
