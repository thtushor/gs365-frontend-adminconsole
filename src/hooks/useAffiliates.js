import { useQuery } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";

export const useAffiliates = (filters = {}) => {
  return useQuery({
    queryKey: ["affiliates", filters],
    queryFn: async () => {
      const params = {
        pageSize: 10000, // Get all affiliates for dropdown
        ...filters
      };
      const res = await Axios.get(API_LIST.AFFILIATE_LIST, { params });
      if (!res.data.status) throw new Error("Failed to fetch affiliates");
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
