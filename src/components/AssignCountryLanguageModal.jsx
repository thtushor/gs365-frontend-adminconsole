import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useCountryData } from "../hooks/useCountryData";

const AssignCountryLanguageModal = ({
  isOpen,
  onClose,
  onSuccess,
  selectedCountry,
}) => {
  const [formData, setFormData] = useState({
    countryId: "",
    languageIds: [],
    status: "active",
  });

  const {
    useCountries,
    useLanguages,
    assignCountryLanguage,
    isAssigningCountryLanguage,
    updateCountryLanguage,
  } = useCountryData();

  const { data: countriesResponse, isLoading: countriesLoading } = useCountries(
    { status: "" }
  );
  const { data: languagesResponse, isLoading: languagesLoading } = useLanguages(
    { status: "active" }
  );

  const countries = countriesResponse?.data || [];
  const languages = languagesResponse?.data || [];

  const countryOptions = countries.map((c) => ({ value: c.id, label: c.name }));
  const languageOptions = languages.map((l) => ({
    value: l.id,
    label: `${l.code.toUpperCase()} - ${l.name}`,
  }));

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // 🔹 Prefill when editing
  useEffect(() => {
    if (selectedCountry) {
      setFormData({
        countryId: selectedCountry.id,
        languageIds: selectedCountry.languages?.map((l) => l.id) || [],
        status: selectedCountry.status,
      });
    } else {
      setFormData({ countryId: "", languageIds: [], status: "active" });
    }
  }, [selectedCountry, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      countryId: formData.countryId,
      languageIds: formData.languageIds,
      status: formData.status,
    };

    if (selectedCountry) {
      // 🔹 Update existing
      updateCountryLanguage(
        { id: selectedCountry.id, ...payload },
        {
          onSuccess: () => {
            setFormData({ countryId: "", languageIds: [], status: "active" });
            onClose();
            if (onSuccess) onSuccess();
          },
        }
      );
    } else {
      // 🔹 Assign new
      assignCountryLanguage(payload, {
        onSuccess: () => {
          setFormData({ countryId: "", languageIds: [], status: "active" });
          onClose();
          if (onSuccess) onSuccess();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {selectedCountry
              ? "Edit Country Language"
              : "Assign Country Language"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Country (disabled when editing) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <Select
              options={countryOptions}
              value={
                countryOptions.find(
                  (opt) => opt.value === formData.countryId
                ) || null
              }
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  countryId: selected ? selected.value : "",
                }))
              }
              isSearchable
              placeholder="Select Country"
              isDisabled={!!selectedCountry || countriesLoading} // disable if editing
            />
          </div>

          {/* Languages */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language(s)
            </label>
            <Select
              options={languageOptions}
              value={languageOptions.filter((opt) =>
                formData.languageIds.includes(opt.value)
              )}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  languageIds: selected ? selected.map((s) => s.value) : [],
                }))
              }
              isMulti
              isSearchable
              placeholder="Select Language(s)"
              isDisabled={languagesLoading}
            />
          </div>

          {/* Status */}
          {/* <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              options={statusOptions}
              value={
                statusOptions.find((opt) => opt.value === formData.status) ||
                null
              }
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  status: selected ? selected.value : "active",
                }))
              }
              placeholder="Select Status"
            />
          </div> */}

          {/* Buttons */}
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
              {isAssigningCountryLanguage
                ? "Saving..."
                : selectedCountry
                ? "Update"
                : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignCountryLanguageModal;
