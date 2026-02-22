import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetRequest, usePostRequest } from "../../Utils/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../../api/ApiList";
import { useCurrencies } from "../shared/useCurrencies";
import { useAuth } from "../../hooks/useAuth";
import Select from "react-select";
import { toast } from "react-toastify";
import { useTransactions } from "../../hooks/useTransactions";
import { useSettings } from "../../hooks/useSettings";
import { PiShieldWarningBold } from "react-icons/pi";

const defaultFilters = {
  page: 1,
  pageSize: 20,
  type: "withdraw",
  status: "pending",
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  userId: "",
  historyType: "affiliate",
  affiliateId: "",
};

const WithdrawBalance = () => {
  const navigate = useNavigate();
  const { data: settingsData } = useSettings();
  const isTodayWithdrawDay = (days) => {
    if (!days) return "N/A";
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    if (Array.isArray(days)) {
      return days.map((d) => d.toLowerCase()).includes(today);
    }

    return days.toLowerCase().includes(today);
  };

  const { affiliateInfo, user } = useAuth();
  console.log(affiliateInfo);
  const [filters, setFilters] = useState({
    ...defaultFilters,
    affiliateId: affiliateInfo?.id || "",
  });
  const { data: affiliatePreviousWithdraws } = useTransactions(filters);

  const getRequest = useGetRequest();
  const { data: affiliateBalanceDetails } = useQuery({
    queryKey: ["affiliateBalance", affiliateInfo?.id],
    queryFn: () =>
      getRequest({
        url: `${BASE_URL}${API_LIST.GET_AFFILIATE_BALANCE}/${affiliateInfo?.id}`,
        errorMessage: "Failed to fetch affiliate balance details",
      }),
    enabled: !!affiliateInfo?.id,
  });

  const withdrawAbleBalance = () => {
    if (!affiliateBalanceDetails?.data) return 0;
    return Number(affiliateBalanceDetails?.data?.currentBalance || 0).toFixed(2);
  };

  const { data: currencyList, isLoading: currencyLoading } = useCurrencies();
  const queryClient = useQueryClient();
  const postRequest = usePostRequest();

  const [form, setForm] = useState({
    amount: "",
    currencyId: affiliateInfo?.currency || "",
    withdrawMethod: "bank",
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
    givenTransactionId: "",
    settleCommissions: false,
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const currencyOptions =
    currencyList?.map((currency) => ({
      value: currency.id,
      label: `${currency.name} (${currency.code})`,
    })) || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (value === "crypto") {
      const usdCurrency =
        currencyOptions?.length > 0
          ? currencyOptions.find(
            (option) => option?.label === "US Dollar (USD)"
          )
          : null;

      setForm((prev) => ({ ...prev, currencyId: usdCurrency?.value }));
    }
  };

  const mutation = useMutation({
    mutationFn: (payload) =>
      postRequest({
        url: BASE_URL + API_LIST.CREATE_AFFILIATE_WITHDRAW,
        body: payload,
      }),
    onSuccess: () => {
      console.log("Withdraw request submitted!");
      setResponse({ status: true, message: "Withdraw request submitted!" });
      queryClient.invalidateQueries({
        queryKey: ["affiliateBalance", affiliateInfo?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["affiliateProfile"],
      });
      queryClient.invalidateQueries({
        queryKey: ["affiliateDetailedStats", affiliateInfo?.id],
      });
      setForm({
        amount: "",
        currencyId: affiliateInfo?.currency || "",
        withdrawMethod: "bank",
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
        givenTransactionId: "",
        settleCommissions: false,
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setLoading(true);

    if (!form.currencyId) {
      toast.error("Please select a currency");
      setLoading(false);
      return;
    }
    if (!form.amount) {
      toast.error("Please enter an amount");
      setLoading(false);
      return;
    }

    const isUSD = currencyOptions?.find((c) => c.value === form.currencyId);
    const bdtConversionAmount =
      isUSD?.label === "US Dollar (USD)"
        ? Number(form.amount || 0) *
        Number(settingsData?.data[0]?.conversionRate || 1)
        : form.amount;

    const isFullWithdrawal = Number(bdtConversionAmount) === Number(withdrawAbleBalance());

    if (
      Number(bdtConversionAmount) < affiliateInfo?.minTrx ||
      Number(bdtConversionAmount) > affiliateInfo?.maxTrx
    ) {
      setResponse({
        status: false,
        message: `Your withdraw amount must be between ${affiliateInfo?.minTrx} and ${affiliateInfo?.maxTrx}`,
      });
      toast.error(
        `Your withdraw amount must be between ${affiliateInfo?.minTrx} and ${affiliateInfo?.maxTrx}`
      );
      setLoading(false);
      return;
    }
    console.log("bdtConversionAmount", bdtConversionAmount);
    try {
      if (bdtConversionAmount > Number(withdrawAbleBalance() || 0)) {
        toast.error(
          `Your USD amount after conversion is ${Number(
            bdtConversionAmount || 0
          ).toFixed(
            2
          )} BDT, (You have only ${withdrawAbleBalance()} BDT balance to withdraw)!`
        );
        setLoading(false);
        return;
      }
      const payload = {
        affiliateId: affiliateInfo?.id,
        amount: Number(bdtConversionAmount),
        currencyId: form.currencyId || 0,
        type: "withdraw",
        status: "pending",
        notes: form.notes,
        withdrawMethod: form.withdrawMethod,
        remainingBalance: withdrawAbleBalance() - Number(bdtConversionAmount),
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
        settleCommissions: isFullWithdrawal ? form.settleCommissions : false,
      };
      mutation.mutate(payload, {
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
    } finally {
      setLoading(false);
    }
  };

  const checkWithdrawValidity = () => {
    const minWithdraw = Number(affiliateInfo?.minTrx) || 0;
    const maxWithdraw = Number(affiliateInfo?.maxTrx) || 0;
    const currentBalance = withdrawAbleBalance();
    return currentBalance >= minWithdraw && currentBalance <= maxWithdraw;
  };

  useEffect(() => {
    const balance = withdrawAbleBalance();
    if (balance > 0) {
      setForm((prev) => ({ ...prev, amount: balance }));
    }
  }, [withdrawAbleBalance()]);

  const bdtConversionAmount =
    currencyOptions?.find((c) => c.value === form.currencyId)?.label === "US Dollar (USD)"
      ? Number(form.amount || 0) * Number(settingsData?.data[0]?.conversionRate || 1)
      : Number(form.amount || 0);

  const isFullWithdrawal = Number(bdtConversionAmount) === Number(withdrawAbleBalance());

  return (
    <div className="bg-white p-4 rounded-md mb-6" id="withdraw-section">
      <h1 className="text-base font-semibold bg-[#07122b] text-white px-3 w-fit rounded-full py-1 mb-2">
        Withdraw Balance
      </h1>

      {affiliatePreviousWithdraws?.data?.length > 0 ? (
        <div className="border-blue-500 border bg-blue-100 rounded-lg py-3 max-w-[500px] px-5">
          <p className="font-bold text-black uppercase text-[18px]">
            <span className="font-bold text-blue-500">
              Existing Request in Process
            </span>
          </p>
          <p className="text-black/70 mt-1">
            You are eligible to withdraw. However, you currently have a pending
            withdrawal request. Please wait until the existing request is
            processed before submitting a new one.
          </p>
        </div>
      ) : affiliateInfo?.kyc_status === "required" ? (
        <div className="border-purple-500 border bg-purple-100 rounded-lg py-3 max-w-[500px] px-5">
          <p className="font-bold text-black uppercase text-[18px]">
            <span className="font-bold text-purple-500">
              KYC Verification Needed!
            </span>
          </p>
          <p className="text-black/70 mt-1">
            To keep your account secure and enjoy smooth withdrawals, please
            complete your KYC verification. This one-time step helps us confirm
            your identity and ensures faster processing of future requests.
          </p>
        </div>
      ) : settingsData?.data?.length > 0 &&
        !isTodayWithdrawDay(settingsData?.data[0]?.affiliateWithdrawTime) ? (
        <div className="border-orange-500 border bg-orange-100 rounded-lg py-3 max-w-[500px] px-5">
          <p className="font-bold flex uppercase text-[18px] text-orange-500">
            <span className="text-[19px] block mt-[4px] mr-[2px] ">
              <PiShieldWarningBold />
            </span>{" "}
            Withdraw OFF Today
          </p>
          <p className="text-black/70 mt-1">
            You are not eligible to withdraw today. Withdrawals are only allowed
            on the{" "}
            <span className="capitalize font-medium text-orange-500">
              {Array.isArray(settingsData?.data[0]?.affiliateWithdrawTime)
                ? settingsData?.data[0]?.affiliateWithdrawTime.join(", ")
                : settingsData?.data[0]?.affiliateWithdrawTime || "Any Time"}
            </span>
            .
          </p>
        </div>
      ) : checkWithdrawValidity() ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Main Balance */}
          <div className="bg-green-300 border border-gray-300 shadow-md rounded-lg px-3 py-1 pb-[6px] w-fit">
            <label htmlFor="" className="text-[12px] uppercase font-semibold">
              Withdrawable Balance
            </label>
            <p className="text-[20px] font-bold">{withdrawAbleBalance()} BDT</p>
            {settingsData?.data[0]?.conversionRate && (
              <p className="text-[14px] opacity-60 font-bold">
                {Number(withdrawAbleBalance()) /
                  Number(settingsData?.data[0]?.conversionRate)}{" "}
                USD
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
            {/* Withdraw Method */}
            <div>
              <label className="font-semibold text-xs mb-1 block">
                Withdraw Method
              </label>
              <select
                name="withdrawMethod"
                value={form.withdrawMethod}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="bank">Bank</option>
                <option value="ewallet">E-wallet</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>

            {/* Currency - not for Crypto */}
            {form.withdrawMethod !== "crypto" && (
              <div className="flex flex-col relative">
                <label className="font-semibold text-xs mb-1">Currency</label>
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
            )}

            {/* Amount */}
            <div>
              <label className="font-semibold text-xs mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                defaultValue={form.amount || withdrawAbleBalance()}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                step="0.01"
              />
            </div>

            {/* Conditional Fields */}
            {form.withdrawMethod === "bank" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 col-span-full">
                {[
                  "Account Number",
                  "Account Holder Name",
                  "Bank Name",
                  "Branch Name",
                  "Branch Address",
                  "SWIFT Code",
                  "IBAN",
                ].map((label, idx) => (
                  <div key={idx}>
                    <label className="font-semibold text-xs mb-1 block">
                      {label}
                    </label>
                    <input
                      type="text"
                      name={
                        label.replace(/\s+/g, "").charAt(0).toLowerCase() +
                        label.replace(/\s+/g, "").slice(1)
                      }
                      placeholder={label}
                      value={
                        form[
                        label.replace(/\s+/g, "").charAt(0).toLowerCase() +
                        label.replace(/\s+/g, "").slice(1)
                        ]
                      }
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 col-span-full">
                <div>
                  <label className="font-semibold text-xs mb-1 block">
                    Wallet Address / Phone Number
                  </label>
                  <input
                    type="text"
                    name="walletAddress"
                    placeholder={
                      form.withdrawMethod === "crypto"
                        ? "Wallet Address"
                        : "Phone / Email / Wallet Address"
                    }
                    value={form.walletAddress}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-xs mb-1 block">
                    Network
                  </label>
                  <input
                    type="text"
                    name="network"
                    placeholder={
                      form.withdrawMethod === "crypto"
                        ? "ex. TRC20, ERC20 etc."
                        : "ex. bKash / PayPal / Skrill etc."
                    }
                    value={form.network}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}

            {isFullWithdrawal && (
              <div className="col-span-full border-green-200 border bg-green-50 rounded-lg p-3 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="settle-commissions"
                  name="settleCommissions"
                  checked={form.settleCommissions}
                  onChange={(e) => setForm({ ...form, settleCommissions: e.target.checked })}
                  className="w-5 h-5 cursor-pointer accent-green-600"
                />
                <label htmlFor="settle-commissions" className="text-sm font-semibold text-green-800 cursor-pointer">
                  I want to settle all my approved commissions with this withdrawal request.
                </label>
              </div>
            )}

            <div className="col-span-full">
              <label className="font-semibold text-xs mb-1">Notes</label>
              <textarea
                name="notes"
                placeholder="Notes"
                value={form.notes}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-500 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {response && (
            <p
              className={`text-sm mt-2 ${response.status ? "text-green-600" : "text-red-600"
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
