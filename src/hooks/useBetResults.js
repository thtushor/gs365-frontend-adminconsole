import { useQuery } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";

export const useBetResults = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["betResults", filters],
    queryFn: async () => {
      const res = await Axios.get(API_LIST.GET_BET_RESULTS, { params: filters });
      return res.data;
    },
    keepPreviousData: true,
    ...options,
  });
};

export const usePlayerRankings = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["playerRankings", params],
    queryFn: async () => {
      const res = await Axios.get(API_LIST.GET_PLAYER_RANKINGS, { params });
      return res.data;
    },
    keepPreviousData: true,
    ...options,
  });
};

export const useGames = () => {
  return useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const res = await Axios.get(API_LIST.GET_ALL_GAMES, { 
        params: { pageSize: 10000 } 
      });
      return res.data;
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await Axios.get(API_LIST.GET_ALL_USERS, { 
        params: { pageSize: 10000 } 
      });
      return res.data;
    },
  });
};
