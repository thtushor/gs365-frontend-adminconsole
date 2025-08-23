import React, { useEffect, useState } from "react";
import ReusableModal from "./ReusableModal";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useGetRequest, usePostRequest } from "../Utils/apiClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_LIST, BASE_URL, SINGLE_IMAGE_UPLOAD_URL } from "../api/ApiList";
import { toast } from "react-toastify";
import { useCurrencies } from "./shared/useCurrencies";
import Select from "react-select";
import { MdToggleOff, MdToggleOn } from "react-icons/md";
// Updated default form to match backend keys
const defaultForm = {
  logo: null,
  name: "",
  parentId: "",
  providerIp: "",
  licenseKey: "",
  phone: "",
  email: "",
  minBalanceLimit: "",
  whatsapp: "",
  telegram: "",
  country: "",
  status: "inactive",
  isMenu: false,
  icon: null,
};

const AddGameProviderForm = ({
  isParentProvider = true,
  sectionTitle = "",
}) => {
  const [searchParams] = useSearchParams();
  const refParentId = searchParams.get("ref_parent_id");

  console.log(refParentId);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["game_providers", { publicList: true, isParent: true }],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_GAME_PROVIDER,
        params: { publicList: true, isParent: true },
        errorMessage: "Failed to fetch promotions list",
      }),
    keepPreviousData: true,
  });

  const parentProviderList = data?.data || [];
  console.log(parentProviderList);

  const { data: currencyList, isLoading: currencyLoading } = useCurrencies();
  const currencyOptions =
    currencyList?.map((currency) => ({
      value: currency.id,
      label: `${currency.name} (${currency.code})`,
    })) || [];

  const [form, setForm] = useState(defaultForm);
  const [submitLoading, setSubmitLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const providerId = queryParams.get("providerId");

  const postRequest = usePostRequest();
  const getRequest = useGetRequest();

  const handleUpdatedData = (fetchData) => {
    const data = fetchData?.data;
    if (!data && !refParentId) return;

    setForm({
      logo: data?.logo || null,
      isMenu: data?.isMenu || false,
      icon: data?.icon || null,
      name: data?.name || "",
      parentId:
        refParentId && data?.parentId
          ? refParentId
          : !refParentId && data?.parentId
          ? data?.parentId
          : "",
      providerIp: data?.providerIp || "",
      licenseKey: data?.licenseKey || "",
      phone: data?.phone || "",
      email: data?.email || "",
      minBalanceLimit: data?.minBalanceLimit || "",
      whatsapp: data?.whatsapp || "",
      telegram: data?.telegram || "",
      country: Number(data?.country) || "",
      status: data?.status || "inactive",
    });
  };
  useQuery({
    queryKey: ["game_providers", providerId],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_GAME_PROVIDER,
        params: { id: providerId },
        errorMessage: "Failed to fetch game_providers details",
        onSuccessFn: handleUpdatedData,
      }),
    enabled: !!providerId,
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        ...formData,
        id: providerId || undefined,
      };

      return await postRequest({
        url: BASE_URL + API_LIST.CREATE_GAME_PROVIDER,
        body: payload,
        contentType: "application/json",
        setLoading: setSubmitLoading,
        onSuccessFn: handleUpdatedData,
        successMessage: providerId
          ? "Game provider updated successfully."
          : "Game provider created successfully.",
      });
    },
    onSuccess: () => {
      if (!providerId)
        setForm({ ...defaultForm, parentId: refParentId ? refParentId : "" });
    },
  });

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const requiredFields = ["name"];
    for (let field of requiredFields) {
      if (!form[field]) {
        toast.error(
          `${field.charAt(0).toUpperCase()}${field.slice(1)} is required`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (!validate()) return;

      let logoUrl = form.logo;
      let iconUrl = form.icon;

      // Upload Logo if it's a File
      if (form.logo instanceof File) {
        const imageForm = new FormData();
        imageForm.append("file", form.logo);

        const uploadResponse = await fetch(SINGLE_IMAGE_UPLOAD_URL, {
          method: "POST",
          body: imageForm,
        });

        if (!uploadResponse.ok) {
          toast.error("Logo upload failed");
          return;
        }

        const imageData = await uploadResponse.json();
        if (!imageData?.status || !imageData.data?.original) {
          toast.error("Invalid logo upload response");
          return;
        }

        logoUrl = imageData.data.original;
      }

      // Upload Icon if isMenu is true and icon is a File
      if (form.isMenu && form.icon instanceof File) {
        const iconForm = new FormData();
        iconForm.append("file", form.icon);

        const uploadIconResponse = await fetch(SINGLE_IMAGE_UPLOAD_URL, {
          method: "POST",
          body: iconForm,
        });

        if (!uploadIconResponse.ok) {
          toast.error("Icon upload failed");
          return;
        }

        const iconData = await uploadIconResponse.json();
        if (!iconData?.status || !iconData.data?.original) {
          toast.error("Invalid icon upload response");
          return;
        }

        iconUrl = iconData.data.original;
      }

      const formWithUploads = {
        ...form,
        logo: logoUrl,
        icon: form.isMenu ? iconUrl : null,
        isMenu: !isParentProvider ? form.isMenu : false, // force false for parent provider
      };

      mutation.mutate(formWithUploads);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    if (refParentId) {
      setForm({ ...form, parentId: refParentId });
    }
  }, [refParentId]);

  return (
    <div className="bg-[#f5f5f5] min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold uppercase">
          {isParentProvider
            ? providerId
              ? "Edit Parent Provider"
              : "Add Parent Provider"
            : providerId
            ? "Edit Sub Provider"
            : "Add Sub Provider"}
        </h2>
        <button
          className="border border-green-400 text-green-600 px-4 py-1 rounded hover:bg-green-50 print:hidden"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>

      <div className="border border-green-400 rounded-md bg-white p-6">
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          {/* Provider or Parent Name */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              {isParentProvider ? "PARENT PROVIDER NAME" : "PROVIDER NAME"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="name"
              placeholder="Provider Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Parent Provider Select */}
          {isParentProvider ||
            (parentProviderList.length > 0 && (
              <div className={`flex flex-col `}>
                <label className="font-semibold text-xs mb-1">
                  SELECT PARENT PROVIDER <span className="text-red-500">*</span>
                </label>
                <select
                  className={`border rounded px-3 py-2 ${
                    refParentId ? "border-green-500 text-green-500" : ""
                  }`}
                  name="parentId"
                  value={form.parentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Parent Provider</option>
                  {parentProviderList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}

          {/* Provider IP */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              PROVIDER IP <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="providerIp"
              placeholder="Provider IP"
              value={form.providerIp}
              onChange={handleChange}
              required
            />
          </div>

          {/* License Key */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              LICENSE KEY <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="licenseKey"
              placeholder="License Key"
              value={form.licenseKey}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              PHONE NUMBER <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              EMAIL <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="border rounded px-3 py-2"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Min Balance */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              MIN BALANCE LIMIT <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="border rounded px-3 py-2"
              name="minBalanceLimit"
              placeholder="Minimum Balance"
              value={form.minBalanceLimit}
              onChange={handleChange}
              required
            />
          </div>

          {/* Currency Dropdown */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              COUNTRY/CURRENCY
            </label>
            {currencyLoading ? (
              <p className="text-gray-500 text-sm">Loading currencies...</p>
            ) : (
              <Select
                options={currencyOptions}
                value={
                  currencyOptions.find((opt) => opt.value === form.country) ||
                  null
                }
                onChange={(selected) => {
                  console.log(selected);
                  setForm((prev) => ({
                    ...prev,
                    country: selected ? selected.value : null,
                  }));
                }}
                isSearchable
                placeholder="Select Currency"
                styles={{
                  menuList: (base) => ({
                    ...base,
                    maxHeight: "300px",
                    overflowY: "auto",
                  }),
                }}
              />
            )}
          </div>

          {/* WhatsApp */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              WHATSAPP <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="whatsapp"
              placeholder="WhatsApp Number"
              value={form.whatsapp}
              onChange={handleChange}
              required
            />
          </div>

          {/* Telegram */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              TELEGRAM <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="telegram"
              placeholder="Telegram Number"
              value={form.telegram}
              onChange={handleChange}
              required
            />
          </div>

          {/* Logo Upload */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              PROVIDER LOGO <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required={!providerId}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">STATUS</label>
            <select
              className="border rounded px-3 py-2"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {!isParentProvider && (
            <>
              <div className="flex flex-col">
                <label className="font-semibold text-xs mb-1">
                  IS MENU ? <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, isMenu: !prev.isMenu }))
                  }
                  className="w-full border px-3 py-[3px] rounded cursor-pointer flex items-center justify-center"
                >
                  {form.isMenu ? (
                    <MdToggleOn className="text-green-500" size={33} />
                  ) : (
                    <MdToggleOff className="text-red-500" size={33} />
                  )}
                </button>
              </div>

              {/* Icon Upload Field (Visible only when isMenu is true) */}
              {form.isMenu && (
                <div className="flex flex-col">
                  <label className="font-semibold text-xs mb-1">
                    MENU ICON <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border rounded px-3 py-2"
                    name="icon"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    required={!providerId}
                  />
                </div>
              )}
            </>
          )}

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end mt-2">
            {!isParentProvider && parentProviderList.length < 1 ? (
              <button
                type="submit"
                className={`bg-red-500 uppercase cursor-pointer text-white px-6 py-2 rounded hover:bg-red-600 transition font-medium pointer-events-none`}
              >
                Add Parent Provider First
              </button>
            ) : (
              <button
                type="submit"
                className={`bg-green-500 uppercase cursor-pointer text-white px-6 py-2 rounded hover:bg-green-600 transition font-medium ${
                  submitLoading ? "pointer-events-none" : ""
                }`}
              >
                {!submitLoading
                  ? providerId && isParentProvider
                    ? "Edit Parent Provider"
                    : !providerId && isParentProvider
                    ? "ADD Parent Provider"
                    : !isParentProvider && !providerId
                    ? "Add Sub provider"
                    : "edit Sub provider"
                  : "Submitting..."}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGameProviderForm;
