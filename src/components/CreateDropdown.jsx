import React, { useState, useEffect } from "react";
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

const CreateDropdown = ({ editedData, setEditedData }) => {
  const queryClient = useQueryClient();
  const [dropdownId, setDropdownId] = useState("");
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [uploadRes, setUploadRes] = useState(null);

  const getRequest = useGetRequest();
  const postRequest = usePostRequest();

  // ✅ Fetch dropdown list
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

  // ✅ Pre-fill form for edit
  useEffect(() => {
    if (editedData && editedData.id) {
      // Assume dropdownId comes from editedData or infer from context
      // If you don't have dropdownId in editedData, you'll need to manage this based on the UI
      const detectedDropdownId = dropdowns?.data?.find((d) =>
        d.options?.some((opt) => opt.id === editedData.id)
      )?.id;

      if (detectedDropdownId) {
        setDropdownId(detectedDropdownId.toString());
      }

      setForm({
        title: editedData.title || "",
        status: editedData.status || "",
        isMenu: editedData.isMenu ? "Yes" : "No",
        imgUrl: editedData.imgUrl || "",
      });
    }
  }, [editedData, dropdowns]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      postRequest({
        url: BASE_URL + API_LIST.CREATE_DROPDOWN,
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropdowns"] });
      resetForm();
    },
  });

  const activeFields = FIELD_SCHEMA[Number(dropdownId)] || [];

  const validate = () => {
    const tempErrors = {};
    if (!dropdownId) tempErrors.dropdownId = "Please select a dropdown.";
    activeFields.forEach((field) => {
      if (field.required) {
        if (field.type === "file") {
          if (!uploadRes?.data?.original && !form.imgUrl) {
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

    // ✅ attach uploaded image url if new image uploaded
    if (uploadRes?.status === true && uploadRes.data?.original) {
      payload.imgUrl = uploadRes.data.original;
    }

    // ✅ If editing, include id
    if (editedData?.id) {
      payload.id = editedData.id;
    }

    mutation.mutate(payload);
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({});
    setDropdownId("");
    setErrors({});
    setUploadRes(null);
    setEditedData(null); // clear edit mode
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
        {editedData ? "Update Dropdown" : "Create Dropdown"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropdown Selector */}
        <div>
          <label htmlFor="" className="uppercase text-[14px] font-medium">
            Select Dropdown
          </label>
          <select
            className="w-full px-3 py-2 rounded capitalize bg-[#f5f5f5] border border-gray-300 text-base font-normal"
            value={dropdownId}
            onChange={(e) => {
              setDropdownId(e.target.value);
              setForm({});
              setErrors({});
              setUploadRes(null);
            }}
            disabled={!!editedData} // prevent changing dropdown in edit mode
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
              <div>
                <label htmlFor="" className="uppercase text-[14px] font-medium">
                  {field?.label || ""}
                </label>

                <select
                  className="w-full px-3 py-2 rounded capitalize bg-[#f5f5f5] border border-gray-300 text-base font-normal"
                  value={form[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  <option value="">{`${
                    field?.label === "Is Menu?" ? "" : "Select "
                  }${field?.label || "Select"}`}</option>
                  {field.options?.length > 0 &&
                    field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                </select>
              </div>
            ) : field.type === "file" ? (
              <div>
                <label htmlFor="" className="uppercase text-[14px] font-medium">
                  {field?.label || ""}
                </label>
                <ImageUploader
                  setUploadRes={setUploadRes}
                  previewImage={form.imgUrl}
                  showBg
                />
              </div>
            ) : (
              <div>
                <label htmlFor="" className="uppercase text-[14px] font-medium">
                  {field?.label || ""}
                </label>
                <input
                  type={field.type}
                  placeholder={field.label}
                  className="w-full px-3 py-2 rounded bg-[#f5f5f5] border border-gray-300 text-base font-normal"
                  value={form[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              </div>
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm font-medium">
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="bg-green-500 cursor-pointer text-white px-8 py-2 rounded hover:bg-green-600 transition font-semibold text-sm"
          >
            {mutation.isLoading
              ? "Processing..."
              : editedData
              ? "Update"
              : "Submit"}
          </button>

          {editedData && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-5 py-2 rounded cursor-pointer hover:bg-gray-600 transition font-semibold text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateDropdown;
