import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePostRequest, useGetRequest } from "../Utils/apiClient";
import { BASE_URL, API_LIST, SINGLE_IMAGE_UPLOAD_URL } from "../api/ApiList";
import { toast } from "react-toastify";
import TextEditor from "./shared/TextEditor";
import { useNavigate, useLocation } from "react-router-dom";
import { Select } from "antd";
import { MdToggleOff, MdToggleOn } from "react-icons/md";

const { Option } = Select;

const defaultForm = {
  promotionName: "",
  promotionTypeId: [],
  startDate: "",
  endDate: "",
  minimumDepositAmount: "",
  maximumDepositAmount: "",
  turnoverMultiply: "",
  bannerImg: null,
  bonus: "",
  description: "",
  status: "active",
  isRecommended: false,
};

const CreatePromotion = () => {
  const [form, setForm] = useState(defaultForm);
  const [submitLoading, setSubmitLoading] = useState(false);

  const postRequest = usePostRequest();
  const getRequest = useGetRequest();
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const promotionId = queryParams.get("promotionId");

  const { data: dropdownData, isLoading: isDropdownLoading } = useQuery({
    queryKey: ["promotionTypes"],
    queryFn: () =>
      getRequest({
        url: `${BASE_URL + API_LIST.GET_DROPDOWN}?id=1`,
      }),
    select: (res) =>
      res?.data?.options?.filter((opt) => opt.status === "active") || [],
  });

  const handleUpdatedData = (fetchData) => {
    const data = fetchData.data || false;
    if (!data) return;

    const [startRaw, endRaw] = (data.dateRange || "")
      .split("to")
      .map((s) => s.trim());

    const parseDate = (str) => {
      const date = new Date(str);
      return date.toISOString().slice(0, 16);
    };

    setForm({
      promotionName: data.promotionName || "",
      promotionTypeId: Array.isArray(data.promotionType?.id)
        ? data.promotionType.id
        : [],
      startDate: parseDate(startRaw),
      endDate: parseDate(endRaw),
      minimumDepositAmount: data.minimumDepositAmount || "",
      maximumDepositAmount: data.maximumDepositAmount || "",
      turnoverMultiply: data.turnoverMultiply?.toString() || "",
      bannerImg: data.bannerImg
        ? data.bannerImg?.replace(/^"+|"+$/g, "")
        : null,
      bonus: data.bonus?.toString() || "",
      description: data.description || "",
      status: data.status || "inactive",
      isRecommended: data.isRecommended || false,
    });
  };

  useQuery({
    queryKey: ["promotion", promotionId],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_PROMOTION,
        params: { id: promotionId },
        errorMessage: "Failed to fetch promotion details",
        onSuccessFn: handleUpdatedData,
      }),
    keepPreviousData: true,
    enabled: !!promotionId,
  });

  const mutation = useMutation({
    mutationFn: async (formWithImageUrl) => {
      const jsonBody = {};
      Object.entries(formWithImageUrl).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          jsonBody[key] = value;
        }
      });

      return await postRequest({
        url: BASE_URL + API_LIST.CREATE_PROMOTION,
        body: { ...jsonBody, id: promotionId || false },
        contentType: "application/json",
        setLoading: setSubmitLoading,
        onSuccessFn: handleUpdatedData,
        successMessage: promotionId
          ? "Promotion updated successfully."
          : "Promotion created successfully.",
      });
    },
    onSuccess: () => {
      if (!promotionId) setForm(defaultForm);
      setSubmitLoading(false);
    },
    onError: () => {
      setSubmitLoading(false);
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
    const requiredFields = [
      "promotionName",
      "promotionTypeId",
      "startDate",
      "endDate",
      "minimumDepositAmount",
      "maximumDepositAmount",
      "turnoverMultiply",
      "bonus",
      "description",
    ];

    for (let field of requiredFields) {
      if (
        field === "promotionTypeId"
          ? form.promotionTypeId.length === 0
          : !form[field]
      ) {
        toast.error(
          `${field.charAt(0).toUpperCase()}${field.slice(1)} is required`
        );
        return false;
      }
    }

    const min = parseFloat(form.minimumDepositAmount);
    const max = parseFloat(form.maximumDepositAmount);

    if (!isNaN(min) && !isNaN(max) && max <= min) {
      toast.error(
        "Maximum deposit amount must be greater than minimum deposit amount"
      );
      return false;
    }

    if (new Date(form.endDate) <= new Date(form.startDate)) {
      toast.error("End date must be after start date.");
      return false;
    }

    return true;
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const pad = (n) => n.toString().padStart(2, "0");
    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`
    );
  };

  const handleSubmit = async (e) => {
    setSubmitLoading(true);
    e.preventDefault();

    try {
      if (!validate()) return;

      let imageUrl = form.bannerImg;

      if (form.bannerImg instanceof File) {
        const imageForm = new FormData();
        imageForm.append("file", form.bannerImg);

        const uploadResponse = await fetch(SINGLE_IMAGE_UPLOAD_URL, {
          method: "POST",
          body: imageForm,
        });

        if (!uploadResponse.ok) {
          toast.error(`Image upload failed`);
          return;
        }

        const imageData = await uploadResponse.json();

        if (!imageData?.status || !imageData.data?.original) {
          toast.error("Image uploaded but format is invalid.");
          return;
        }

        imageUrl = imageData.data.original;
      }

      const formattedStart = formatDateTime(form.startDate);
      const formattedEnd = formatDateTime(form.endDate);
      const dateRange = `${formattedStart} to ${formattedEnd}`;

      const formWithImageUrl = {
        ...form,
        dateRange,
        bannerImg: imageUrl,
      };
      delete formWithImageUrl.startDate;
      delete formWithImageUrl.endDate;

      mutation.mutate(formWithImageUrl);
    } catch (error) {
      setSubmitLoading(false);
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen p-6">
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 pt-4 border border-green-400 rounded"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between col-span-full w-full">
          <h2 className="text-lg font-semibold">
            {promotionId ? "Edit Promotion" : "Create Promotion"}
          </h2>
          <button
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
            onClick={() => navigate("/promotion-list")}
            type="button"
          >
            Promotion List
          </button>
        </div>
        <div className="w-full">
          <label className="block text-sm mb-1">Promotion Name</label>

          <input
            className="border rounded px-3 py-2 w-full"
            name="promotionName"
            placeholder="Promotion Name"
            value={form.promotionName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="w-full custom-promotion-type">
          <label className="block text-sm mb-1">Promotion Types</label>
          <Select
            allowClear
            style={{ width: "100%" }}
            placeholder="Select promotion types"
            value={form.promotionTypeId}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, promotionTypeId: value }))
            }
            loading={isDropdownLoading}
          >
            {dropdownData?.map((opt) => (
              <Option key={opt.id} value={opt.id}>
                {opt.title}
              </Option>
            ))}
          </Select>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <label className="block text-sm mb-1">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div className="w-full">
            <label className="block text-sm mb-1">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm mb-1">Minimum Deposit Amount</label>
          <input
            className="border rounded px-3 py-2 w-full"
            name="minimumDepositAmount"
            type="number"
            placeholder="Minimum deposit amount"
            value={form.minimumDepositAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full">
          <label className="block text-sm mb-1">Maximum Deposit Amount</label>

          <input
            className="border rounded px-3 py-2 w-full"
            name="maximumDepositAmount"
            type="number"
            placeholder="Maximum deposit amount"
            value={form.maximumDepositAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full">
          <label className="block text-sm mb-1">Turnover Multiply</label>
          <input
            className="border rounded px-3 py-2 w-full"
            name="turnoverMultiply"
            type="number"
            placeholder="Enter turnover multiply"
            value={form.turnoverMultiply}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full">
          <label className="block text-sm mb-1">Bonus Percentage (%)</label>
          <input
            className="border rounded px-3 py-2 w-full"
            name="bonus"
            type="number"
            placeholder="Enter bonus percentage (%)"
            value={form.bonus}
            onChange={handleChange}
            required
          />
        </div>

        <div className="w-full col-span-full lg:col-span-1">
          <label className="block text-sm mb-1">Banner Image</label>
          <div className="flex gap-2 w-full">
            {promotionId &&
              typeof form.bannerImg === "string" &&
              form.bannerImg && (
                <img
                  src={form.bannerImg}
                  alt="preview"
                  className="h-[40px] rounded-md"
                />
              )}
            <input
              className="border rounded px-3 py-2 w-full"
              name="bannerImg"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required={!promotionId}
            />
          </div>
        </div>

        {promotionId && (
          <div className="w-full">
            <label className="block text-sm mb-1">Status</label>
            <select
              name="status"
              className="border rounded px-3 py-2 w-full"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}

        <div className="col-span-full sm:col-span-1">
          <label className="block text-sm mb-1">Is Recommended?</label>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                isRecommended: !prev.isRecommended,
              }))
            }
            className={`w-full border border-black flex items-center gap-1 px-3 py-[3px] rounded cursor-pointer ${
              form.isRecommended ? "text-green-500" : "text-red-500"
            }`}
          >
            Is Recommended
            {form.isRecommended ? (
              <MdToggleOn className="text-green-500" size={33} />
            ) : (
              <MdToggleOff className="text-red-500" size={33} />
            )}
          </button>
        </div>

        <div className="md:col-span-2">
          <TextEditor
            value={form.description}
            setValue={(val) =>
              setForm((prev) => ({
                ...prev,
                description: val,
              }))
            }
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 cursor-pointer py-2 rounded hover:bg-green-600 transition"
            disabled={submitLoading}
          >
            {submitLoading
              ? "Submitting..."
              : promotionId
              ? "Update Promotion"
              : "Create Promotion"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePromotion;
