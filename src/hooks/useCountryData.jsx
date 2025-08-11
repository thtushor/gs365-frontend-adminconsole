import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";

// Query keys for React Query
export const QUERY_KEYS = {
  CURRENCIES: "currencies",
  LANGUAGES: "languages",
  COUNTRIES: "countries",
  COUNTRY_LANGUAGES: "countryLanguages",
};

// API functions
const api = {
  // Get currencies
  getCurrencies: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.searchKey) queryParams.append("searchKey", params.searchKey);

    return Axios.get(`${API_LIST.GET_CURRENCIES}?${queryParams.toString()}`);
  },

  // Get languages
  getLanguages: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.searchKey) queryParams.append("searchKey", params.searchKey);

    return Axios.get(`${API_LIST.GET_LANGUAGES}?${queryParams.toString()}`);
  },

  // Get countries
  getCountries: (params = {}) => {
    return Axios.get(`${API_LIST.GET_COUNTRIES}`, {
      params: { ...params },
    });
  },

  // Assign country language
  assignCountryLanguage: (data) => {
    return Axios.post(API_LIST.ASSIGN_COUNTRY_LANGUAGES, data);
  },

  // Update language status
  updateLanguageStatus: (data) => {
    return Axios.post(API_LIST.UPDATE_LANGUAGE_STATUS, data);
  },

  // Update country language
  updateCountryLanguage: (data) => {
    return Axios.post(API_LIST.UPDATE_COUNTRY_LANGUAGE, data);
  },

  // Update country status
  updateCountryStatus: (data) => {
    return Axios.post(API_LIST.UPDATE_COUNTRY_STATUS, data);
  },
};

// Custom hook for managing country data
export const useCountryData = () => {
  const queryClient = useQueryClient();

  // Get currencies query
  const useCurrencies = (params = {}) => {
    return useQuery({
      queryKey: [QUERY_KEYS.CURRENCIES, params],
      queryFn: () => api.getCurrencies(params),
      select: (response) => response.data,
    });
  };

  // Get languages query
  const useLanguages = (params = {}) => {
    return useQuery({
      queryKey: [QUERY_KEYS.LANGUAGES, params],
      queryFn: () => api.getLanguages(params),
      select: (response) => response.data,
    });
  };

  // Get countries query
  const useCountries = (params = {}) => {
    console.log({ params });
    return useQuery({
      queryKey: [QUERY_KEYS.COUNTRIES, { ...params }],
      queryFn: () => api.getCountries(params),
      select: (response) => response.data,
    });
  };

  // Mutations
  const assignCountryLanguageMutation = useMutation({
    mutationFn: api.assignCountryLanguage,
    onSuccess: (response) => {
      toast.success("Country language assigned successfully!");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COUNTRIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LANGUAGES] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to assign country language"
      );
    },
  });

  const updateLanguageStatusMutation = useMutation({
    mutationFn: api.updateLanguageStatus,
    onSuccess: (response) => {
      toast.success("Language status updated successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LANGUAGES] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update language status"
      );
    },
  });

  const updateCountryLanguageMutation = useMutation({
    mutationFn: api.updateCountryLanguage,
    onSuccess: (response) => {
      toast.success("Country language updated successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COUNTRIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LANGUAGES] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update country language"
      );
    },
  });

  const updateCountryStatusMutation = useMutation({
    mutationFn: api.updateCountryStatus,
    onSuccess: (response) => {
      toast.success("Country status updated successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COUNTRIES] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update country status"
      );
    },
  });

  return {
    // Queries
    useCurrencies,
    useLanguages,
    useCountries,

    // Mutations
    assignCountryLanguage: assignCountryLanguageMutation.mutate,
    updateLanguageStatus: updateLanguageStatusMutation.mutate,
    updateCountryLanguage: updateCountryLanguageMutation.mutate,
    updateCountryStatus: updateCountryStatusMutation.mutate,

    // Loading states
    isAssigningCountryLanguage: assignCountryLanguageMutation.isPending,
    isUpdatingLanguageStatus: updateLanguageStatusMutation.isPending,
    isUpdatingCountryLanguage: updateCountryLanguageMutation.isPending,
    isUpdatingCountryStatus: updateCountryStatusMutation.isPending,
  };
};
