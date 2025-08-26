/* eslint-disable react-refresh/only-export-components */
import {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
} from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [affiliateInfo, setAffiliateInfo] = useState(null);
  const [affiliateCommission, setAffiliateCommission] = useState(null);
  const [gameProviderInfo, setGameProviderInfo] = useState(null);
  const [sportProviderInfo, setSportProviderInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [isValidating, setIsValidating] = useState(true);
  const queryClient = useQueryClient();

  // Profile query using react-query
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await Axios.get(API_LIST.GET_PROFILE);
      if (!res.data || !res.data.status) {
        window.location.href = "/login";
        throw new Error("Profile fetch failed");
      }

      return res.data.data;
    },
    enabled: !!token && !user,
    retry: false,
    onError: () => {
      setUser(null);
      setIsValidating(false);
      localStorage.removeItem("token");
    },
  });

  useEffect(() => {
    if (!token) {
      setIsValidating(false);
    } else {
      setIsValidating(true);
    }
  }, [token]);

  // Keep user in sync with profileData
  useEffect(() => {
    if (profileData) {
      setUser(profileData);
      setIsValidating(false);
    }
  }, [profileData]);

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await axios.post(BASE_URL + API_LIST.LOGIN, credentials);
      if (!data.status) throw new Error(data.message || "Login failed");
      // Store accessToken
      localStorage.setItem("token", data.accessToken);
      return data;
    },
    onSuccess: (data) => {
      setUser(data.data); // user info is in data.data
      queryClient.invalidateQueries(["user"]);
      setIsValidating(false);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await Axios.post(API_LIST.LOGOUT);
    },
    onSuccess: () => {
      setUser(null);
      setIsValidating(false);
      localStorage.removeItem("token");
      queryClient.invalidateQueries(["user"]);
    },
    onError: () => {
      setUser(null);
      setIsValidating(false);
      localStorage.removeItem("token");
    },
  });

  const login = useCallback(
    (credentials) => loginMutation.mutateAsync(credentials),
    [loginMutation]
  );
  const logout = useCallback(() => logoutMutation.mutate(), [logoutMutation]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isValidating,
        isLogoutLoading: logoutMutation.isLoading,
        isLoading: loginMutation.isLoading || logoutMutation.isLoading,
        isProfileLoading,
        token,
        setAffiliateInfo,
        affiliateInfo,
        gameProviderInfo,
        setGameProviderInfo,
        sportProviderInfo,
        setSportProviderInfo,
        setAffiliateCommission,
        affiliateCommission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
