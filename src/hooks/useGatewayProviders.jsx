import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";

const QUERY_KEYS = {
  GATEWAY_PROVIDERS: "gateway-providers",
  GATEWAY_PROVIDER: "gateway-provider",
  GATEWAY_PROVIDERS_BY_GATEWAY: "gateway-providers-by-gateway",
  GATEWAY_PROVIDERS_BY_PROVIDER: "gateway-providers-by-provider",
};

// Get all gateway-provider relationships with optional filters
export const useGatewayProviders = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS, filters],
    queryFn: async () => {
      const params = {};
      if (filters.gatewayId) params.gatewayId = filters.gatewayId;
      if (filters.providerId) params.providerId = filters.providerId;
      if (filters.page) params.page = filters.page;
      if (filters.pageSize) params.pageSize = filters.pageSize;
      if (filters.status) params.status = filters.status;

      const response = await Axios.get(API_LIST.GATEWAY_PROVIDER, { params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get providers for a specific gateway
export const useGatewayProvidersByGateway = (gatewayId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_GATEWAY, gatewayId],
    queryFn: async () => {
      const response = await Axios.get(
        `${API_LIST.GATEWAY_PROVIDER_BY_GATEWAY}/${gatewayId}`
      );
      return response.data;
    },
    enabled: !!gatewayId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get gateways for a specific provider
export const useGatewayProvidersByProvider = (providerId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_PROVIDER, providerId],
    queryFn: async () => {
      const response = await Axios.get(
        `${API_LIST.GATEWAY_PROVIDER_BY_PROVIDER}/${providerId}`
      );
      return response.data;
    },
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Assign a provider to a gateway
export const useAssignProviderToGateway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await Axios.post(API_LIST.GATEWAY_PROVIDER, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Provider assigned to gateway successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_GATEWAY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_PROVIDER],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to assign provider to gateway"
      );
    },
  });
};

// Update relationship priority
export const useUpdateGatewayProviderPriority = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, priority }) => {
      const response = await Axios.post(
        `${API_LIST.UPDATE_GATEWAY_PROVIDER_PRIORITY}/${id}/priority`,
        { priority }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Priority updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_GATEWAY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_PROVIDER],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update priority");
    },
  });
};
// Update gateway provider data
export const useUpdateGatewayProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await Axios.post(
        `${API_LIST.UPDATE_GATEWAY_PROVIDER_RECOMMENDATION}/${id}/update`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Gateway provider updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_GATEWAY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_PROVIDER],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update gateway provider");
    },
  });
};

// Update recomended 
export const useUpdateGatewayProviderRecommendation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isRecommended }) => {
      const response = await Axios.post(
        `${API_LIST.UPDATE_GATEWAY_PROVIDER_RECOMMENDATION}/${id}/recommendation`,
        { isRecommended }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Recommendation updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_GATEWAY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_PROVIDER],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update recommendation");
    },
  });
};

// Update relationship status
export const useUpdateGatewayProviderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await Axios.post(
        `${API_LIST.UPDATE_GATEWAY_PROVIDER_STATUS}/${id}/status`,
        { status }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Status updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_GATEWAY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_PROVIDER],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
};

// Remove provider from gateway by relationship ID
export const useRemoveProviderFromGateway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await Axios.post(
        `${API_LIST.DELETE_PROVIDER_FROM_GATEWAY}/${id}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Provider removed from gateway successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_GATEWAY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_PROVIDER],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove provider from gateway"
      );
    },
  });
};

// Remove provider from gateway by IDs
export const useRemoveProviderFromGatewayByIds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gatewayId, providerId }) => {
      const response = await Axios.post(
        `${API_LIST.DELETE_PROVIDER_FROM_GATEWAY}/${gatewayId}/${providerId}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Provider removed from gateway successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_GATEWAY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GATEWAY_PROVIDERS_BY_PROVIDER],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove provider from gateway"
      );
    },
  });
};
