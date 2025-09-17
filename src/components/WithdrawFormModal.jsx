import React, { useState, useEffect, useMemo } from "react";
import ReusableModal from "./ReusableModal";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../hooks/useTransactions";
import Select from "react-select";
import { usePaymentMethodTypes } from "../hooks/usePaymentMethodTypes";
import { usePaymentGateways } from "../hooks/usePaymentGateways";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import { useCurrencies } from "./shared/useCurrencies";

const WithdrawFormModal = ({ open, onClose, selectedPlayer, onSuccess }) => {
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    paymentGatewayId: "",
    paymentGatewayId: "",
    notes: "",
    attachment: null,
    accountNumber: "",
    accountHolderName: "",
    bankName: "",
    branchName: "",
    branchAddress: "",
    swiftCode: "",
    iban: "",
    network: "",
  });
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedPaymentMethodType, setSelectedPaymentMethodType] =
    useState(null);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState(null);

  console.log({ selectedPlayer })

  const withdrawMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await Axios.post(API_LIST.PLAYER_WITHDRAW_TRANSACTION, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Withdrawal added successfully");
      
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      onSuccess(); // Callback to refresh player data in parent
      setErrors({});
      // Reset form fields
      setWithdrawForm({
        amount: "",
        currencyId: "",
        paymentGatewayId: "",
        notes: "",
        attachment: null,
        accountNumber: "",
        accountHolderName: "",
        bankName: "",
        branchName: "",
        branchAddress: "",
        swiftCode: "",
        iban: "",
        network: "",
      });
      setSelectedPaymentMethodType(null);
      setSelectedPaymentGateway(null);
      onClose();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.data?.withdrawReason || error?.response?.data?.message || "Failed to add withdrawal";

        console.log({message})
      toast.error(message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Fetch payment method types using the custom hook
  const { data: paymentMethod, isLoading: paymentMethodTypesLoading } =
    usePaymentMethods("active");

  // Fetch payment gateways using the custom hook
  const { data: paymentGatewaysData, isLoading: paymentGatewaysLoading } =
    usePaymentGateways({ status: "active" });

  const { data: currenciesData, isLoading: currenciesLoading } = useCurrencies(
    selectedPlayer?.currencyCode ? { searchKey: selectedPlayer.currencyCode } : {}
  );

  console.log({ paymentMethod, paymentGatewaysData, currenciesData })

  const transformedPaymentTypes = useMemo(() => {
    return paymentMethod?.map((type) => ({
      value: type.id,
      label: type.name,
      gateways: paymentGatewaysData?.data?.filter(
        (gateway) => gateway.methodId === type.id
      ),
    }));
  }, [paymentMethod, paymentGatewaysData]);

  const paymentGatewayOptions = useMemo(() => {
    if (!selectedPaymentMethodType) return [];
    return selectedPaymentMethodType.gateways?.map((gateway) => ({
      value: gateway.id,
      label: gateway.name,
    }));
  }, [selectedPaymentMethodType]);

  useEffect(() => {
    if (selectedPlayer && currenciesData && currenciesData.length > 0) {
      const playerCurrency = currenciesData?.[0]
      console.log({ playerCurrency })
      if (playerCurrency) {
        setWithdrawForm((prev) => ({
          ...prev,
          currencyId: playerCurrency.id,
        }));
      }
    }
  }, [selectedPlayer, currenciesData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWithdrawForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePaymentMethodTypeChange = (selectedOption) => {
    setSelectedPaymentMethodType(selectedOption);
    setSelectedPaymentGateway(null); // Reset gateway when method type changes
    setWithdrawForm((prev) => ({
      ...prev,
      paymentGatewayId: "",
      accountNumber: "",
      accountHolderName: "",
      bankName: "",
      branchName: "",
      branchAddress: "",
      swiftCode: "",
      iban: "",
      network: "",
    }));
    if (errors.paymentMethodType) {
      setErrors((prev) => ({ ...prev, paymentMethodType: null }));
    }
  };

  const handlePaymentGatewayChange = (selectedOption) => {
    setSelectedPaymentGateway(selectedOption);
    setWithdrawForm((prev) => ({
      ...prev,
      paymentGatewayId: selectedOption ? selectedOption.value : "",
    }));
    if (errors.paymentGateway) {
      setErrors((prev) => ({ ...prev, paymentGateway: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!withdrawForm.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(withdrawForm.amount) || Number(withdrawForm.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!selectedPaymentMethodType) {
      newErrors.paymentMethodType = "Payment method type is required";
    }

    if (!selectedPaymentGateway) {
      newErrors.paymentGateway = "Payment gateway is required";
    }


    if (!withdrawForm.accountNumber) {
      newErrors.accountNumber = "Account number is required";
    }

    const paymentMethodName = selectedPaymentMethodType?.label?.toLowerCase();

    // For bank transfers, validate specific required fields
    if (paymentMethodName?.includes("bank")) {
      if (!withdrawForm.accountHolderName)
        newErrors.accountHolderName = "Account holder name is required";
      if (!withdrawForm.bankName) newErrors.bankName = "Bank name is required";
      if (!withdrawForm.branchName)
        newErrors.branchName = "Branch name is required";
      // SWIFT code and IBAN are now optional.
    }

    // For crypto, network is required
    if (paymentMethodName?.includes("crypto")) {
      if (!withdrawForm.network) newErrors.network = "Network is required";
    }

    // For wallet, network is required
    if (paymentMethodName?.includes("wallet")) {
      if (!withdrawForm.network) newErrors.network = "Network is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWithdrawSubmit = async () => {
    if (!selectedPlayer) return;

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    const playerCurrency = currenciesData?.[0]

    console.log({ playerCurrency })

    const requestData = {
      userId: selectedPlayer.id,
      amount: Number(withdrawForm.amount),
      currencyId: playerCurrency?.id || withdrawForm.currencyId,
      paymentGatewayId: selectedPaymentGateway?.value,
      notes: withdrawForm.notes || "",
      attachment: withdrawForm.attachment,
    };

    const paymentMethodName = selectedPaymentMethodType?.label?.toLowerCase();

    if (paymentMethodName?.includes("bank")) {
      requestData.accountNumber = withdrawForm.accountNumber;
      requestData.accountHolderName = withdrawForm.accountHolderName;
      requestData.bankName = withdrawForm.bankName;
      requestData.branchName = withdrawForm.branchName;
      requestData.branchAddress = withdrawForm.branchAddress;
      requestData.swiftCode = withdrawForm.swiftCode;
      requestData.iban = withdrawForm.iban;
    } else if (
      paymentMethodName?.includes("wallet") ||
      paymentMethodName?.includes("crypto")
    ) {
      requestData.network = withdrawForm.network;
    }

    await withdrawMutation.mutateAsync(requestData);
  };

  console.log({ transformedPaymentTypes, paymentGatewayOptions })

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title={`Withdraw from ${selectedPlayer?.fullname || "Player"}`}
      onSave={handleWithdrawSubmit}
      isLoading={isSubmitting || withdrawMutation.isPending}
      loadingText="Processing Withdrawal..."
      className={"min-w-[65vw]"}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Player ID
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value={selectedPlayer?.id || ""}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value={`${selectedPlayer?.currencyCode || ""} (${selectedPlayer?.currencyName || ""
                })`}
              readOnly
            />
          </div>

          {/* Amount and Payment Method Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              className={`w-full border rounded px-3 py-2 ${errors.amount ? "border-red-500" : ""
                }`}
              placeholder="Enter amount"
              name="amount"
              value={withdrawForm.amount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method Type *
            </label>
            <Select
              isClearable
              isSearchable
              placeholder="Select payment method type..."
              options={transformedPaymentTypes}
              value={selectedPaymentMethodType}
              onChange={handlePaymentMethodTypeChange}
              isLoading={paymentMethodTypesLoading}
              className={`w-full ${errors.paymentMethodType ? "border-red-500" : ""
                }`}
              classNamePrefix="react-select"
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
            />
            {errors.paymentMethodType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.paymentMethodType}
              </p>
            )}
          </div>

          {/* Payment Gateway and Account Number */}
          {selectedPaymentMethodType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Gateway *
              </label>
              <Select
                isClearable
                isSearchable
                placeholder="Select payment gateway..."
                options={paymentGatewayOptions}
                value={selectedPaymentGateway}
                onChange={handlePaymentGatewayChange}
                isLoading={paymentGatewaysLoading}
                className={`w-full ${errors.paymentGateway ? "border-red-500" : ""
                  }`}
                classNamePrefix="react-select"
              />
              {errors.paymentGateway && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.paymentGateway}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number *
            </label>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 ${errors.accountNumber ? "border-red-500" : ""
                }`}
              placeholder="Enter account number"
              name="accountNumber"
              value={withdrawForm.accountNumber}
              onChange={handleInputChange}
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.accountNumber}
              </p>
            )}
          </div>

          {selectedPaymentMethodType?.label?.toLowerCase().includes("bank") && (
            <>
              {/* Account Holder Name and Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 ${errors.accountHolderName ? "border-red-500" : ""
                    }`}
                  placeholder="Enter account holder name"
                  name="accountHolderName"
                  value={withdrawForm.accountHolderName}
                  onChange={handleInputChange}
                />
                {errors.accountHolderName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.accountHolderName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 ${errors.bankName ? "border-red-500" : ""
                    }`}
                  placeholder="Enter bank name"
                  name="bankName"
                  value={withdrawForm.bankName}
                  onChange={handleInputChange}
                />
                {errors.bankName && (
                  <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
                )}
              </div>

              {/* Branch Name and Branch Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 ${errors.branchName ? "border-red-500" : ""
                    }`}
                  placeholder="Enter branch name"
                  name="branchName"
                  value={withdrawForm.branchName}
                  onChange={handleInputChange}
                />
                {errors.branchName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.branchName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Address (Optional)
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter branch address"
                  name="branchAddress"
                  value={withdrawForm.branchAddress}
                  onChange={handleInputChange}
                />
              </div>

              {/* SWIFT Code and IBAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SWIFT Code (Optional)
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter SWIFT code"
                  name="swiftCode"
                  value={withdrawForm.swiftCode}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IBAN (Optional)
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter IBAN"
                  name="iban"
                  value={withdrawForm.iban}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          {(selectedPaymentMethodType?.label?.toLowerCase().includes("crypto") ||
            selectedPaymentMethodType?.label?.toLowerCase().includes("wallet")) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network *
                </label>
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 ${errors.network ? "border-red-500" : ""
                    }`}
                  placeholder="Enter network (e.g., ERC20, TRC20)"
                  name="network"
                  value={withdrawForm.network}
                  onChange={handleInputChange}
                />
                {errors.network && (
                  <p className="text-red-500 text-xs mt-1">{errors.network}</p>
                )}
              </div>
            )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Enter notes"
            rows={3}
            name="notes"
            value={withdrawForm.notes}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </ReusableModal>
  );
};

export default WithdrawFormModal;
