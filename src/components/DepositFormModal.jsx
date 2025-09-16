import React, { useState } from "react";
import ReusableModal from "./ReusableModal";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { formatAmount } from "./BettingWagerPage"; // Assuming this utility is available

// Custom hook to fetch promotions
const usePromotions = () => {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const response = await Axios.get(API_LIST.GET_PUBLIC_PROMOTION);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const DepositFormModal = ({ open, onClose, selectedPlayer, onSuccess }) => {
  const queryClient = useQueryClient();
  const [depositForm, setDepositForm] = useState({
    amount: "",
    promotionId: "",
    notes: "",
    attachment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch promotions using react-query
  const { data: promotionsData, isLoading: promotionsLoading } =
    usePromotions();

  const handleDepositSubmit = async () => {
    if (!selectedPlayer) return;

    if (!depositForm.amount || parseFloat(depositForm.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Validate promotion requirements if a promotion is selected
    if (depositForm.promotionId) {
      const selectedPromotion = promotionsData?.data?.find(
        (p) => p.id === depositForm.promotionId
      );
      if (selectedPromotion) {
        const amount = parseFloat(depositForm.amount);
        const minAmount = parseFloat(selectedPromotion.minimumDepositAmount);
        const maxAmount = parseFloat(selectedPromotion.maximumDepositAmount);

        if (amount < minAmount) {
          toast.error(
            `Minimum deposit amount for this promotion is ${formatAmount(
              minAmount
            )}`
          );
          return;
        }

        if (amount > maxAmount) {
          toast.error(
            `Maximum deposit amount for this promotion is ${formatAmount(
              maxAmount
            )}`
          );
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: selectedPlayer.id,
        amount: parseFloat(depositForm.amount),
        currencyId: selectedPlayer.currencyId || 10, // Default to 10 if not available
        promotionId: depositForm.promotionId || null,
        notes: depositForm.notes || null,
        attachment: depositForm.attachment || null,
      };

      await Axios.post(API_LIST.DEPOSIT_TRANSACTION, payload);
      toast.success("Deposit added successfully");
      onClose();
      setDepositForm({
        amount: "",
        promotionId: "",
        notes: "",
        attachment: "",
      });
      // Invalidate and refetch player profile to update balances
      queryClient.invalidateQueries({ queryKey: ["playerProfile", selectedPlayer.id] });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to add deposit";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transform promotions data for react-select
  const promotionOptions =
    promotionsData?.data?.map((promotion) => ({
      value: promotion.id,
      label: `${promotion.promotionName} (${promotion.bonus}% bonus)`,
      promotion: promotion,
    })) || [];

  const handlePromotionChange = (selectedOption) => {
    setDepositForm({
      ...depositForm,
      promotionId: selectedOption ? selectedOption.value : "",
    });
  };

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title={`Add Deposit for ${selectedPlayer?.fullname || "Player"}`}
      onSave={handleDepositSubmit}
      isLoading={isSubmitting}
      loadingText="Adding Deposit..."
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
              value={`${selectedPlayer?.currency?.code || ""} (${selectedPlayer?.currency?.name || ""})`}
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount *
          </label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter amount"
            value={depositForm.amount}
            onChange={(e) =>
              setDepositForm({ ...depositForm, amount: e.target.value })
            }
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Promotion (Optional)
          </label>
          <Select
            isClearable
            isSearchable
            placeholder="Select a promotion..."
            options={promotionOptions}
            value={
              promotionOptions.find(
                (option) => option.value === depositForm.promotionId
              ) || null
            }
            onChange={handlePromotionChange}
            isLoading={promotionsLoading}
            className="w-full"
            classNamePrefix="react-select"
            noOptionsMessage={() => "No promotions available"}
            loadingMessage={() => "Loading promotions..."}
          />
          {depositForm.promotionId && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
              <div className="font-medium">Selected Promotion Details:</div>
              {(() => {
                const selectedPromotion = promotionsData?.data?.find(
                  (p) => p.id === depositForm.promotionId
                );
                if (selectedPromotion) {
                  return (
                    <div className="mt-1 space-y-1">
                      <div>• Bonus: {selectedPromotion.bonus}%</div>
                      <div>
                        • Min Deposit:{" "}
                        {formatAmount(selectedPromotion.minimumDepositAmount)}
                      </div>
                      <div>
                        • Max Deposit:{" "}
                        {formatAmount(selectedPromotion.maximumDepositAmount)}
                      </div>
                      <div>
                        • Turnover: {selectedPromotion.turnoverMultiply}x
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
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
            value={depositForm.notes}
            onChange={(e) =>
              setDepositForm({ ...depositForm, notes: e.target.value })
            }
          />
        </div>
      </div>
    </ReusableModal>
  );
};

export default DepositFormModal;
