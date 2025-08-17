import React, { useState } from "react";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";
import { FaCogs, FaTimes, FaEdit, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";

const SystemSettingsPage = () => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  
  const { data: settingsData, isLoading, isError } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const settings = settingsData?.data || [];

  const handleEdit = (setting) => {
    setEditingId(setting.id);
    setEditValue(setting.defaultTurnover || "");
  };

  const handleSave = async (settingId) => {
    if (!editValue || editValue < 1) {
      toast.error("Please enter a valid turnover value (minimum 1)");
      return;
    }

    try {
      await updateSettingsMutation.mutateAsync({
        id: settingId,
        data: { defaultTurnover: Number(editValue) }
      });
      setEditingId(null);
      setEditValue("");
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load settings. Please try again later.</p>
        </div>
      </div>
    );
  }

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

      {/* Turnover Settings Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Turnover Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure default turnover multipliers for different products
          </p>
        </div>
        
        <div className="p-6">
          {settings.length === 0 ? (
            <div className="text-center py-8">
              <FaCogs className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No settings found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Settings will appear here once configured.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                    Default turnover settings
                    </h3>
                    <p className="text-sm text-gray-600">
                      Current value: {setting.defaultTurnover || 0} times
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {editingId === setting.id ? (
                      <>
                        <input
                          type="number"
                          min="1"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter value"
                        />
                        <button
                          onClick={() => handleSave(setting.id)}
                          disabled={updateSettingsMutation.isLoading}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <FaSave className="mr-2" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          <FaTimes className="mr-2" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(setting)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <FaEdit className="mr-2" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Future Settings Sections - Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Additional Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            More configuration options will be added here
          </p>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">More settings coming soon</h3>
            <p className="mt-1 text-sm text-gray-500">
              Additional configuration options will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
