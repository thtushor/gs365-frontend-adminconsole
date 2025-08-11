import React, { useState, useEffect } from "react";
import { useCountryData } from "../hooks/useCountryData";

const AssignCountryLanguageModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    countryId: "",
    languageId: "",
    status: "active",
  });

  const {
    useCountries,
    useLanguages,
    assignCountryLanguage,
    isAssigningCountryLanguage,
  } = useCountryData();

  // Get countries and languages for dropdowns
  const { data: countriesResponse, isLoading: countriesLoading } = useCountries(
    {
      status: "active",
    }
  );
  const { data: languagesResponse, isLoading: languagesLoading } = useLanguages(
    {
      status: "active",
    }
  );

  // Extract arrays from API responses
  const countries = countriesResponse || [];
  const languages = languagesResponse?.data || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    assignCountryLanguage(formData, {
      onSuccess: () => {
        setFormData({ countryId: "", languageId: "", status: "active" });
        onClose();
        if (onSuccess) onSuccess();
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Assign Country Language</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              name="countryId"
              value={formData.countryId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={countriesLoading}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              name="languageId"
              value={formData.languageId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={languagesLoading}
            >
              <option value="">Select Language</option>
              {languages.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.code.toUpperCase()} - {language.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAssigningCountryLanguage}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isAssigningCountryLanguage ? "Assigning..." : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignCountryLanguageModal;
