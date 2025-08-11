import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";

const QUERY_KEYS = {
  PAYMENT_PROVIDERS: "payment-providers",
  PAYMENT_PROVIDER: "payment-provider",
};

// Get all payment providers with optional filters
export const usePaymentProviders = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_PROVIDERS, filters],
    queryFn: async () => {
      const params = {};
      if (filters.page) params.page = filters.page;
      if (filters.pageSize) params.pageSize = filters.pageSize;
      if (filters.status) params.status = filters.status;
      if (filters.name) params.name = filters.name;
      if (filters.commissionPercentage)
        params.commissionPercentage = filters.commissionPercentage;
      if (filters.gatewayId) params.gatewayId = filters.gatewayId;
      if (filters.providerId) params.providerId = filters.providerId;

      const response = await Axios.get(API_LIST.PAYMENT_PROVIDER, { params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get payment provider by ID
export const usePaymentProvider = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_PROVIDER, id],
    queryFn: async () => {
      const response = await Axios.get(`${API_LIST.PAYMENT_PROVIDER}/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create payment provider
export const useCreatePaymentProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await Axios.post(API_LIST.PAYMENT_PROVIDER, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Payment provider created successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PAYMENT_PROVIDERS],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create payment provider"
      );
    },
  });
};

// Update payment provider
export const useUpdatePaymentProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await Axios.post(
        `${API_LIST.UPDATE_PAYMENT_PROVIDER}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Payment provider updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PAYMENT_PROVIDERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PAYMENT_PROVIDER],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update payment provider"
      );
    },
  });
};

// Delete payment provider
export const useDeletePaymentProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await Axios.post(
        `${API_LIST.DELETE_PAYMENT_PROVIDER}/${id}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Payment provider deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PAYMENT_PROVIDERS],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete payment provider"
      );
    },
  });
};
