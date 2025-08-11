import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";

const QUERY_KEYS = {
  PAYMENT_METHODS: "payment-methods",
  PAYMENT_METHOD: "payment-method",
};

// Get all payment methods with optional status filter
export const usePaymentMethods = (status = null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_METHODS, status],
    queryFn: async () => {
      const params = status ? { status } : {};
      const response = await Axios.get(API_LIST.PAYMENT_METHOD, { params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get payment method by ID
export const usePaymentMethod = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_METHOD, id],
    queryFn: async () => {
      const response = await Axios.get(`${API_LIST.PAYMENT_METHOD}/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create payment method
export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await Axios.post(API_LIST.PAYMENT_METHOD, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Payment method created successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENT_METHODS] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create payment method"
      );
    },
  });
};

// Update payment method
export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await Axios.post(
        `${API_LIST.UPDATE_PAYMENT_METHOD}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Payment method updated successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENT_METHODS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENT_METHOD] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update payment method"
      );
    },
  });
};

// Delete payment method
export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await Axios.delete(
        `${API_LIST.DELETE_PAYMENT_METHOD}/${id}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Payment method deleted successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENT_METHODS] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete payment method"
      );
    },
  });
};
