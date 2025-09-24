import React, { useState } from "react";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";
import { FaCogs, FaTimes, FaEdit, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { formatAmount } from "./BettingWagerPage";
import { useAuth } from "../hooks/useAuth"; // Import useAuth hook
import { hasPermission } from "../Utils/permissions";

const SystemSettingsPage = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];

  const hasAccess = (permission) =>
    isSuperAdmin || hasPermission(permissions, permission);

  // State to track which setting and field is being edited
  const [editingField, setEditingField] = useState(null); // { id, field }
  const [editValue, setEditValue] = useState({
    defaultTurnover: 0,
    adminBalance: 0,
    minWithdrawableBalance: 0,
    conversionRate: 0,
    affiliateWithdrawTime: [],
    systemActiveTime: { start: "", end: "" },
  });

  const { data: settingsData, isLoading, isError } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const settings = settingsData?.data || [];

  const handleEdit = (setting, field) => {
    setEditingField({ id: setting.id, field });
    setEditValue({
      defaultTurnover: setting.defaultTurnover,
      adminBalance: setting.adminBalance,
      minWithdrawableBalance: setting.minWithdrawableBalance,
      conversionRate: setting.conversionRate,
      affiliateWithdrawTime: Array.isArray(setting.affiliateWithdrawTime)
        ? setting.affiliateWithdrawTime
        : setting.affiliateWithdrawTime
        ? setting.affiliateWithdrawTime.split(",")
        : [],
      systemActiveTime: editValue.systemActiveTime,
    });
  };

  const handleSave = async (settingId) => {
    try {
      // Validation only on save
      if (editValue.defaultTurnover < 0) {
        toast.error("Please enter a valid turnover value (minimum 0)");
        return;
      }
      if (editValue.adminBalance < 0) {
        toast.error("Please enter a valid adminBalance value (minimum 0)");
        return;
      }
      if (!editValue.conversionRate || editValue.conversionRate < 0) {
        toast.error("Please enter a valid conversion rate");
        return;
      }
      if (editValue.systemActiveTime.start >= editValue.systemActiveTime.end) {
        toast.error("Start time must be before end time");
        return;
      }

      await updateSettingsMutation.mutateAsync({
        id: settingId,
        data: {
          defaultTurnover: Number(editValue.defaultTurnover),
          adminBalance: Number(editValue.adminBalance),
          minWithdrawableBalance: Number(editValue.minWithdrawableBalance),
          conversionRate: Number(editValue.conversionRate),
          affiliateWithdrawTime: editValue.affiliateWithdrawTime,
          systemActiveTime: editValue.systemActiveTime,
        },
      });

      setEditingField(null);
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Failed to load settings. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const daysOptions = [
    "saturday",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaCogs className="text-blue-600" />
          System Settings
        </h1>
        <p className="text-gray-600 mt-2">
          Manage system-wide configuration settings
        </p>
      </div>

      {/* Settings Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Turnover Settings
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure default system settings below
          </p>
        </div>

        <div className="p-6 space-y-4">
          {settings.length === 0 ? (
            <div className="text-center py-8">
              <FaCogs className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No settings found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Settings will appear here once configured.
              </p>
            </div>
          ) : (
            settings.map((setting) => (
              <React.Fragment key={setting.id}>
                {/* Default Turnover */}
                <SettingRow
                  label="Default Turnover Settings"
                  description={`Current value: ${
                    setting.defaultTurnover || 0
                  } times`}
                  field="defaultTurnover"
                  setting={setting}
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  handleEdit={handleEdit}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  hasAccess={hasAccess}
                  updateSettingsMutation={updateSettingsMutation}
                />

                {/* Admin Balance */}
                <SettingRow
                  label="Admin Balance"
                  description={`Current value: ${formatAmount(
                    setting.adminBalance || 0
                  )}`}
                  field="adminBalance"
                  setting={setting}
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  handleEdit={handleEdit}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  hasAccess={hasAccess}
                  updateSettingsMutation={updateSettingsMutation}
                />

                {/* Minimum Withdrawable Balance */}
                <SettingRow
                  label="Minimum Balance to Access Withdraw Button"
                  description={`Current value: ${formatAmount(
                    setting.minWithdrawableBalance || 0
                  )}`}
                  field="minWithdrawableBalance"
                  setting={setting}
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  handleEdit={handleEdit}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  hasAccess={hasAccess}
                  updateSettingsMutation={updateSettingsMutation}
                />

                {/* Conversion Rate */}
                <SettingRow
                  label="Conversion Rate"
                  description={`Current value: 1 USD = ${
                    setting.conversionRate || 0
                  } BDT`}
                  field="conversionRate"
                  setting={setting}
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  handleEdit={handleEdit}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  hasAccess={hasAccess}
                  updateSettingsMutation={updateSettingsMutation}
                  step="0.01"
                  min="0"
                />

                {/* Affiliate Withdraw Days */}
                <SettingRow
                  label="Affiliate Withdraw Days"
                  description={`Current value: ${
                    Array.isArray(setting.affiliateWithdrawTime)
                      ? setting.affiliateWithdrawTime.join(", ")
                      : setting.affiliateWithdrawTime || "Any Time"
                  }`}
                  field="affiliateWithdrawTime"
                  setting={setting}
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  handleEdit={handleEdit}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  hasAccess={hasAccess}
                  updateSettingsMutation={updateSettingsMutation}
                  options={daysOptions}
                />
                <SettingRow
                  label="System Active Time (Deposit/Withdraw)"
                  description={`Current: ${
                    setting.systemActiveTime?.start &&
                    setting.systemActiveTime?.end
                      ? `${setting.systemActiveTime?.start} - ${setting.systemActiveTime.end}`
                      : "No restriction"
                  }`}
                  field="systemActiveTime"
                  setting={setting}
                  editingField={editingField}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  handleEdit={handleEdit}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  hasAccess={hasAccess}
                  updateSettingsMutation={updateSettingsMutation}
                />
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const SettingRow = ({
  label,
  description,
  field,
  setting,
  editingField,
  editValue,
  setEditValue,
  handleEdit,
  handleSave,
  handleCancel,
  hasAccess,
  updateSettingsMutation,
  step = "1",
  min = "1",
  options,
}) => {
  const isEditing =
    editingField?.id === setting.id && editingField?.field === field;

  const formatTime12Hour = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-600">
          {setting.systemActiveTime?.start && setting.systemActiveTime?.end
            ? `Current: ${formatTime12Hour(
                setting.systemActiveTime.start
              )} - ${formatTime12Hour(setting.systemActiveTime.end)}`
            : "No restriction"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {isEditing ? (
          <>
            {options ? (
              <select
                multiple
                value={editValue[field]}
                onChange={(e) =>
                  setEditValue((prev) => ({
                    ...prev,
                    [field]: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                  }))
                }
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {options.map((day) => (
                  <option key={day} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </option>
                ))}
              </select>
            ) : field === "systemActiveTime" ? (
              <div className="flex gap-2">
                <input
                  type="time"
                  value={editValue?.systemActiveTime?.start}
                  onChange={(e) =>
                    setEditValue((prev) => ({
                      ...prev,
                      [field]: { ...prev[field], start: e.target.value },
                    }))
                  }
                  className="w-36 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="self-center text-gray-600">to</span>
                <input
                  type="time"
                  value={editValue?.systemActiveTime?.end}
                  onChange={(e) =>
                    setEditValue((prev) => ({
                      ...prev,
                      [field]: { ...prev[field], end: e.target.value },
                    }))
                  }
                  className="w-36 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <input
                type="number"
                min={min}
                step={step}
                value={editValue[field]}
                onChange={(e) =>
                  setEditValue((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            <button
              onClick={() => handleSave(setting.id)}
              disabled={
                updateSettingsMutation.isLoading ||
                !hasAccess("settings_update_system_settings")
              }
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
          </>
        ) : (
          hasAccess("settings_update_system_settings") && (
            <button
              onClick={() => handleEdit(setting, field)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaEdit className="mr-2" />
              Edit
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default SystemSettingsPage;
