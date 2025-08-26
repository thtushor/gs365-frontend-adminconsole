import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_LIST, BASE_URL, SINGLE_IMAGE_UPLOAD_URL } from "../../api/ApiList";
import { useCurrencies } from "../shared/useCurrencies";
import { usePostRequest } from "../../Utils/apiClient";
import { useAuth } from "../../hooks/useAuth";

const WithdrawBalance = () => {
  const { affiliateInfo, affiliateCommission } = useAuth();
  console.log(affiliateInfo);
  const withdrawAbleBalance = () => {
    if (!affiliateCommission) {
      return 0;
    }
    const totalLoss = (
      Number(affiliateInfo?.remainingBalance) +
      Math.abs(Number(affiliateCommission?.totalLossCommission || 0))
    ).toFixed(2);
    const totalWin = Math.abs(
      Number(affiliateCommission?.totalWinCommission || 0)
    );

    return (totalLoss - totalWin).toFixed(2);
  };
  const { data: currencyList, isLoading: currencyLoading } = useCurrencies();
  const queryClient = useQueryClient();
  const postRequest = usePostRequest();

  const [form, setForm] = useState({
    amount: withdrawAbleBalance() || 0,
    currencyId: affiliateInfo?.currency || "",
    withdrawMethod: "bank",
    attachment: null,
    notes: "",
    accountNumber: "",
    accountHolderName: "",
    bankName: "",
    branchName: "",
    branchAddress: "",
    swiftCode: "",
    iban: "",
    walletAddress: "",
    network: "",
    givenTransactionId: "", // <-- new field
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const currencyOptions =
    currencyList?.map((currency) => ({
      value: currency.id,
      label: `${currency.name} (${currency.code})`,
    })) || [];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setForm({ ...form, attachment: file });

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const mutation = useMutation({
    mutationFn: (payload) =>
      postRequest({
        url: BASE_URL + API_LIST.CREATE_AFFILIATE_WITHDRAW,
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdraw"] });
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setLoading(true);

    try {
      let uploadedImage = null;

      if (form.attachment) {
        const imgData = new FormData();
        imgData.append("file", form.attachment);

        const imgRes = await axios.post(SINGLE_IMAGE_UPLOAD_URL, imgData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (!imgRes.data.status || !imgRes.data.data)
          throw new Error("Image upload failed");

        uploadedImage = imgRes.data.data.original;
      }

      const payload = {
        affiliateId: affiliateInfo?.id,
        amount: Number(form.amount),
        currencyId: form.currencyId,
        type: "withdraw",
        status: "pending",
        notes: form.notes,
        attachment: uploadedImage,
        withdrawMethod: form.withdrawMethod,
        givenTransactionId: form.givenTransactionId,
        remainingBalance: withdrawAbleBalance() - Number(form.amount),
        ...(form.withdrawMethod === "bank"
          ? {
              accountNumber: form.accountNumber,
              accountHolderName: form.accountHolderName,
              bankName: form.bankName,
              branchName: form.branchName,
              branchAddress: form.branchAddress,
              swiftCode: form.swiftCode,
              iban: form.iban,
            }
          : {
              walletAddress: form.walletAddress,
              network: form.network,
            }),
      };

      console.log("Payload:", payload);

      mutation.mutate(payload, {
        onSuccess: () => {
          setResponse({ status: true, message: "Withdraw request submitted!" });

          // Reset form **only on success**
          setForm({
            amount: "",
            currencyId: "",
            withdrawMethod: "bank",
            attachment: null,
            notes: "",
            accountNumber: "",
            accountHolderName: "",
            bankName: "",
            branchName: "",
            branchAddress: "",
            swiftCode: "",
            iban: "",
            walletAddress: "",
            network: "",
          });
          setPreview(null);
        },
        onError: (err) => {
          setResponse({
            status: false,
            message: err?.message || "Something went wrong",
          });
        },
        onSettled: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      setResponse({
        status: false,
        message: err.message || "Something went wrong",
      });
      setLoading(false);
    }
  };

  const checkWithdrawValidity = () => {
    const minWithdraw = Number(affiliateInfo?.minTrx) || 0;
    const maxWithdraw = Number(affiliateInfo?.maxTrx) || 0;
    const currentBalance = withdrawAbleBalance();

    return currentBalance >= minWithdraw && currentBalance <= maxWithdraw;
  };

  return (
    <div className="bg-white p-4 rounded-md mb-6" id="withdraw-section">
      <h1 className="text-base font-semibold bg-[#07122b] text-white px-3 w-fit rounded-full py-1 mb-2">
        Withdraw Balance
      </h1>

      {checkWithdrawValidity() ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Main Balance */}
          <div className="bg-green-300 border border-gray-300 shadow-md rounded-lg px-3 py-1 pb-[6px] w-fit">
            <label htmlFor="" className="text-[12px] uppercase font-semibold">
              Withdrawable Balance
            </label>
            <p className="text-[20px] font-bold">{withdrawAbleBalance()}</p>
          </div>

          {/* Withdraw Method */}
          <select
            name="withdrawMethod"
            value={form.withdrawMethod}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="bank">Bank</option>
            <option value="wallet">Wallet</option>
          </select>

          {/* Currency */}
          <div className="flex flex-col relative">
            <label className="font-semibold text-xs mb-1">CURRENCY</label>
            {currencyLoading ? (
              <p className="text-gray-500 text-sm">Loading currencies...</p>
            ) : (
              <Select
                options={currencyOptions}
                value={
                  currencyOptions.find(
                    (opt) => opt.value === form.currencyId
                  ) || null
                }
                onChange={(selected) =>
                  setForm({
                    ...form,
                    currencyId: selected ? selected.value : "",
                  })
                }
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

          {/* Amount */}
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Conditional Fields */}
          {form.withdrawMethod === "bank" ? (
            <div className="space-y-2">
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={form.accountNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="accountHolderName"
                placeholder="Account Holder Name"
                value={form.accountHolderName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={form.bankName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="branchName"
                placeholder="Branch Name"
                value={form.branchName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="branchAddress"
                placeholder="Branch Address"
                value={form.branchAddress}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="swiftCode"
                placeholder="SWIFT Code"
                value={form.swiftCode}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="iban"
                placeholder="IBAN"
                value={form.iban}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                name="walletAddress"
                placeholder="Wallet Address"
                value={form.walletAddress}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="network"
                placeholder="Network"
                value={form.network}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          {/* Transaction ID */}
          <input
            type="text"
            name="givenTransactionId"
            placeholder="Transaction ID"
            value={form.givenTransactionId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          {/* Notes */}
          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          {/* Attachment */}
          <input
            type="file"
            name="attachment"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-20 object-cover border rounded"
            />
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-500 text-white px-4 py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {response && (
            <p
              className={`text-sm mt-2 ${
                response.status ? "text-green-600" : "text-red-600"
              }`}
            >
              {response.message}
            </p>
          )}
        </form>
      ) : (
        <div className="border-red-500 border bg-red-100 rounded-lg py-3 max-w-[500px] px-5">
          <p className="font-bold text-black uppercase text-[18px]">
            BALANCE{" "}
            <span className="font-bold text-red-500">
              {withdrawAbleBalance()}
            </span>
          </p>
          <p className="text-black/70 mt-1">
            You are not eligible to withdraw. Your withdrawable balance must be
            within your minimum or maximum withdrawal limit.
          </p>
        </div>
      )}
    </div>
  );
};

export default WithdrawBalance;
