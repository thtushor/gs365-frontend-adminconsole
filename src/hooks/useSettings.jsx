import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";

const QUERY_KEYS = {
  SETTINGS: "settings",
};

// Get all settings
export const useSettings = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SETTINGS],
    queryFn: async () => {
      const response = await Axios.get(API_LIST.GET_SETTINGS);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update settings by ID
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await Axios.post(`${API_LIST.UPDATE_SETTINGS}/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Settings updated successfully!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update settings"
      );
    },
  });
};
