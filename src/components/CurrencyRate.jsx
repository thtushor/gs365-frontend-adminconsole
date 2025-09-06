import React, { useState, useEffect } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import Select from "react-select";
import { useMutation } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { usePostRequest } from "../Utils/apiClient";
import { toast } from "react-toastify";

const CurrencyRate = ({
  currencyLoading,
  currencyOptions = [],
  editData,
  onSuccess,
  onCancel,
}) => {
  const [form, setForm] = useState({
    id: undefined,
    fromCurrency: null,
    toCurrency: null,
    rate: "",
  });

  const postRequest = usePostRequest();

  // find USD
  const usDollar = currencyOptions.find((c) => c.label === "US Dollar (USD)");

  // load form when editData changes
  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id,
        fromCurrency:
          currencyOptions.find((c) => c.value === editData.fromId) || null,
        toCurrency:
          currencyOptions.find((c) => c.value === editData.toId) || null,
        rate: editData.rate,
      });
    } else {
      // reset form (default: USD auto select)
      setForm({
        id: undefined,
        fromCurrency: usDollar || null,
        toCurrency: null,
        rate: "",
      });
    }
  }, [editData, currencyOptions, usDollar]);

  // mutation for create/update
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        id: formData.id || undefined,
        fromCurrency: formData.fromCurrency?.value,
        toCurrency: formData.toCurrency?.value,
        rate: Number(formData.rate),
      };

      return await postRequest({
        url: BASE_URL + API_LIST.CREATE_OR_UPDATE_CONVERSION,
        body: payload,
        contentType: "application/json",
      });
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fromCurrency || !form.toCurrency || !form.rate) {
      toast.error("Please fill all fields");
      return;
    }

    mutation.mutate(form);
  };

  return (
    <div className="bg-white py-4 pb-5 px-5 pt-3 rounded-md border border-green-500">
      <h1 className="text-[14px] font-medium mb-1">
        {form.fromCurrency && form.toCurrency
          ? `${form.fromCurrency.label} to ${form.toCurrency.label} Conversion`
          : "Currency Conversion"}
      </h1>

      <div className="flex items-center w-full gap-2 md:gap-5 md:flex-row flex-col">
        {/* From Currency */}
        <div className="flex flex-col relative w-full">
          {currencyLoading ? (
            <p className="text-gray-500 text-sm">Loading currencies...</p>
          ) : (
            <Select
              options={currencyOptions}
              value={form.fromCurrency}
              isDisabled={!!usDollar} // force USD
              onChange={(selected) =>
                setForm((prev) => ({ ...prev, fromCurrency: selected }))
              }
              isSearchable
              placeholder="Select Currency"
            />
          )}
        </div>

        <FaExchangeAlt className="text-[30px] text-green-500" />

        {/* To Currency */}
        <div className="flex flex-col relative w-full">
          {currencyLoading ? (
            <p className="text-gray-500 text-sm">Loading currencies...</p>
          ) : (
            <Select
              options={currencyOptions}
              value={form.toCurrency}
              onChange={(selected) =>
                setForm((prev) => ({
                  ...prev,
                  toCurrency: selected,
                  rate: "",
                }))
              }
              isSearchable
              placeholder="Select Currency"
            />
          )}
        </div>

        {/* Input + Submit */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full md:max-w-[300px] items-center gap-3"
        >
          <input
            type="number"
            placeholder={`Enter rate (1 ${
              form.fromCurrency?.label?.match(/\(([^)]+)\)/)?.[1] || ""
            } = ? )`}
            className="border px-2 outline-none border-green-500 h-[36px] rounded w-full"
            disabled={!form.toCurrency}
            value={form.rate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rate: e.target.value }))
            }
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 h-[36px] rounded disabled:bg-gray-400"
            disabled={mutation.isLoading || !form.rate || !form.toCurrency}
          >
            {mutation.isLoading ? "Saving..." : form.id ? "Update" : "Submit"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-400 text-white px-3 h-[36px] rounded"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CurrencyRate;
