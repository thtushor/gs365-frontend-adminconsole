import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";

const QUERY_KEYS = {
  TRANSACTIONS: "transactions",
};

// Fetch transactions with filters
export const useTransactions = ({
  page = 1,
  pageSize,
  limit,
  type,
  status,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  userId,
  affiliateId,
} = {}) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.TRANSACTIONS,
      {
        page,
        pageSize,
        limit,
        type,
        status,
        search,
        sortBy,
        sortOrder,
        userId,
        affiliateId,
      },
    ],
    queryFn: async () => {
      const params = {
        page,
        sortBy,
        sortOrder,
      };

      if (pageSize != null) params.pageSize = pageSize;
      if (limit != null) params.limit = limit;
      if (type) params.type = type;
      if (status) params.status = status;
      if (search) params.search = search;
      if (userId) params.userId = userId;
      if (affiliateId) params.affiliateId = affiliateId;

      const { data } = await Axios.get(API_LIST.PAYMENT_TRANSACTION, {
        params,
      });
      return data;
    },
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });
};

// Update transaction status with optional notes
export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, notes, dynamicUrl }) => {
      const staticUrl = `${API_LIST.PAYMENT_TRANSACTION}/${id}/status`;
      if (!id) throw new Error("Transaction id is required");
      if (!status) throw new Error("Status is required");
      const { data } = await Axios.post(dynamicUrl || staticUrl, {
        status,
        notes,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Transaction status updated");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to update transaction status";
      toast.error(message);
    },
  });
};
