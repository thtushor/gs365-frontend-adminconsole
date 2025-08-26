import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";

const QUERY_KEYS = {
  PAYMENT_GATEWAYS: "payment-gateways",
  PAYMENT_GATEWAY: "payment-gateway",
};

// Get all payment gateways with optional filters
export const usePaymentGateways = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_GATEWAYS, filters],
    queryFn: async () => {
      const params = {
        page: 1,
        pageSize: 10000,
      };
      if (filters.status) params.status = filters.status;
      if (filters.countryId) params.countryId = filters.countryId;
      if (filters.methodId) params.methodId = filters.methodId;
      if (filters.name) params.name = filters.name;
      if (filters.network) params.network = filters.network;
      if (filters.paymentMethodTypeId)
        params.paymentMethodTypeId = filters.paymentMethodTypeId;
      if (filters.page) params.page = filters.page;
      if (filters.pageSize) params.pageSize = filters.pageSize;

      const response = await Axios.get(API_LIST.PAYMENT_GATEWAY, { params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get payment gateway by ID
export const usePaymentGateway = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_GATEWAY, id],
    queryFn: async () => {
      const response = await Axios.get(`${API_LIST.PAYMENT_GATEWAY}/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create payment gateway
export const useCreatePaymentGateway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await Axios.post(API_LIST.PAYMENT_GATEWAY, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Payment gateway created successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PAYMENT_GATEWAYS],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create payment gateway"
      );
    },
  });
};

// Update payment gateway
export const useUpdatePaymentGateway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await Axios.post(
        `${API_LIST.UPDATE_PAYMENT_GATEWAY}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Payment gateway updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PAYMENT_GATEWAYS],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENT_GATEWAY] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update payment gateway"
      );
    },
  });
};

// Delete payment gateway
export const useDeletePaymentGateway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await Axios.post(
        `${API_LIST.DELETE_PAYMENT_GATEWAY}/${id}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Payment gateway deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PAYMENT_GATEWAYS],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete payment gateway"
      );
    },
  });
};
