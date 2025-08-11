import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";

const QUERY_KEYS = {
  PAYMENT_METHOD_TYPES: "payment-method-types",
  PAYMENT_METHOD_TYPE: "payment-method-type",
};

// Get all payment method types with optional status filter
export const usePaymentMethodTypes = (status = null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_METHOD_TYPES, status],
    queryFn: async () => {
      const params = status ? { status } : {};
      const response = await Axios.get(API_LIST.PAYMENT_METHOD_TYPES, {
        params,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get payment method type by ID
export const usePaymentMethodType = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_METHOD_TYPE, id],
    queryFn: async () => {
      const response = await Axios.get(
        `${API_LIST.PAYMENT_METHOD_TYPES}/${id}`
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create payment method type
export const useCreatePaymentMethodType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await Axios.post(API_LIST.PAYMENT_METHOD_TYPES, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Payment method type created successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PAYMENT_METHOD_TYPES],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create payment method type"
      );
    },
  });
};

// Update payment method type
export const useUpdatePaymentMethodType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await Axios.post(
        `${API_LIST.UPDATE_PAYMENT_METHOD_TYPES}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Payment method type updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PAYMENT_METHOD_TYPES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PAYMENT_METHOD_TYPE],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update payment method type"
      );
    },
  });
};

// Delete payment method type
export const useDeletePaymentMethodType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await Axios.post(
        `${API_LIST.DELETE_PAYMENT_METHOD_TYPES}/${id}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Payment method type deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PAYMENT_METHOD_TYPES],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete payment method type"
      );
    },
  });
};
