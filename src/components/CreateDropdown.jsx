import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetRequest, usePostRequest } from "../Utils/apiClient";
import { API_LIST, BASE_URL } from "../api/ApiList";
import ImageUploader from "./shared/ImageUploader";

// Define field schemas by dropdown ID
const FIELD_SCHEMA = {
  1: [
    { name: "title", label: "Title", type: "text", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["active", "inactive"],
      required: false,
    },
  ],
  2: [
    { name: "title", label: "Title", type: "text", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["active", "inactive"],
      required: false,
    },
    {
      name: "imgUrl",
      label: "Icon",
      type: "file",
      required: true,
    },
    {
      name: "isMenu",
      label: "Is Menu?",
      type: "select",
      options: ["Yes", "No"],
      required: false,
    },
  ],
};

const CreateDropdown = () => {
  const queryClient = useQueryClient();
  const [dropdownId, setDropdownId] = useState("");
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [uploadRes, setUploadRes] = useState(null);

  const getRequest = useGetRequest();
  const postRequest = usePostRequest();

  const {
    data: dropdowns,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dropdowns"],
    queryFn: () =>
      getRequest({
        url: `${BASE_URL + API_LIST.GET_DROPDOWN}`,
        errorMessage: "Failed to fetch dropdowns",
      }),
  });

  const mutation = useMutation({
    mutationFn: (payload) =>
      postRequest({
        url: BASE_URL + API_LIST.CREATE_DROPDOWN,
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropdowns"] });
      setForm({});
      setDropdownId("");
      setUploadRes(null);
    },
  });

  const activeFields = FIELD_SCHEMA[Number(dropdownId)] || [];

  const validate = () => {
    const tempErrors = {};
    if (!dropdownId) tempErrors.dropdownId = "Please select a dropdown.";
    activeFields.forEach((field) => {
      if (field.required) {
        if (field.type === "file") {
          if (!uploadRes?.data?.original) {
            tempErrors[field.name] = `${field.label} is required.`;
          }
        } else if (!form[field.name]) {
          tempErrors[field.name] = `${field.label} is required.`;
        }
      }
    });
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      dropdownId: Number(dropdownId),
      ...form,
    };

    // ✅ attach uploaded image url
    if (uploadRes?.status === true && uploadRes.data?.original) {
      payload.imgUrl = uploadRes.data.original;
    }

    mutation.mutate(payload);
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="text-center text-xl font-semibold text-gray-700 mt-20">
        Loading dropdowns...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-bold mt-20">
        Failed to load dropdowns.
      </div>
    );
  }

  return (
    <div className="max-w-md py-3 px-5 bg-white rounded-xl border border-green-300">
      <h2 className="text-[18px] font-semibold mb-2 text-left">
        Create Dropdown
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropdown Selector */}
        <div>
          <select
            className="w-full px-3 py-2 rounded capitalize bg-[#f5f5f5] border border-gray-300 text-base font-normal"
            value={dropdownId}
            onChange={(e) => {
              setDropdownId(e.target.value);
              setForm({});
              setErrors({});
              setUploadRes(null);
            }}
          >
            <option value="">Select Dropdown</option>
            {dropdowns?.data?.map((dd) => (
              <option key={dd.id} value={dd.id}>
                {dd.name || "Not Available"}
              </option>
            ))}
          </select>
          {errors.dropdownId && (
            <p className="text-red-500 text-sm font-medium">
              {errors.dropdownId}
            </p>
          )}
        </div>

        {/* Dynamic Fields */}
        {activeFields.map((field) => (
          <div key={field.name}>
            {field.type === "select" ? (
              <select
                className="w-full px-3 py-2 rounded capitalize bg-[#f5f5f5] border border-gray-300 text-base font-normal"
                value={form[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              >
                <option value="">{`${
                  field.label === "Is Menu?" ? "" : "Select "
                }${field.label}`}</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "file" ? (
              <ImageUploader
                setUploadRes={setUploadRes}
                previewImage={form[field.name]}
                showBg
              />
            ) : (
              <input
                type={field.type}
                placeholder={field.label}
                className="w-full px-3 py-2 rounded bg-[#f5f5f5] border border-gray-300 text-base font-normal"
                value={form[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm font-medium">
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="bg-green-500 text-white px-8 py-2 rounded hover:bg-green-600 transition font-semibold text-sm"
        >
          {mutation.isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreateDropdown;
