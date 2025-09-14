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
  const [authStateToken, setAuthStateToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });
  const [isValidating, setIsValidating] = useState(true);
  const queryClient = useQueryClient();

  // Profile query using react-query
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
        // If token is invalid, clear it and throw an error.
        // The onError handler will manage the redirection.
        throw new Error("Profile fetch failed");
      }

      return res.data.data;
    },
    // Use authStateToken for enabling the query
    enabled: !!authStateToken && !user, // Only fetch profile if token exists and user is not yet set
    retry: false,
    onError: (error) => {
      setUser(null);
      setIsValidating(false); // Stop validation immediately on error
      setAuthStateToken(null); // Clear state token on error
      localStorage.removeItem("token");

      // Redirect to login if the error indicates an invalid token or unauthorized access.
      // This check is more robust than just checking for any error.
      // We assume that if the profile fetch fails and we have no token, it's an invalid session.
      // The condition `!authStateToken` in the useEffect below will also trigger a redirect if the token is cleared.
      if (error.response?.status === 401 || error.message === "Profile fetch failed") {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    },
  });

  // Effect to handle redirection when token is missing or invalid
  useEffect(() => {
    // If there's no token in state AND no user data, it means the user is not authenticated.
    // We should stop validating and redirect to login if not already there.
    if (!authStateToken && !user) {
      setIsValidating(false); // Stop validation as we are unauthenticated
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (authStateToken && !user && !isProfileLoading) {
      // This case handles when a token exists, but user data hasn't loaded yet, and the profile fetch is not ongoing.
      // This might happen if the profile fetch failed previously but the token is still in state.
      // The onError handler of the profile query should have already redirected if the token was invalid.
      // If we reach here, it might mean the token is valid but the user data fetch is stuck or failed in a way
      // that didn't trigger the redirect in onError. We set isValidating to false to prevent infinite loading.
      setIsValidating(false);
    } else if (user) {
      // If user data is loaded, validation is complete.
      setIsValidating(false);
    }
    // Dependencies: authStateToken, user, isProfileLoading.
    // If any of these change, this effect will re-run.
  }, [authStateToken, user, isProfileLoading]);

  // Keep user in sync with profileData
  useEffect(() => {
    if (profileData) {
      setUser(profileData);
      setIsValidating(false); // Profile data loaded, no longer validating
    }
  }, [profileData]);

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await axios.post(BASE_URL + API_LIST.LOGIN, credentials);
      if (!data.status) throw new Error(data.message || "Login failed");
      // Store accessToken in state and localStorage
      localStorage.setItem("token", data.accessToken);
      setAuthStateToken(data.accessToken); // Update state token
      setIsValidating(false);
      return data;
    },
    onSuccess: (data) => {
      setUser(data.data); // user info is in data.data
      setAuthStateToken(data.accessToken); // Ensure state token is set
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
      setAuthStateToken(null); // Clear state token on logout
      localStorage.removeItem("token");
      queryClient.invalidateQueries(["user"]);
    },
    onError: () => {
      setUser(null);
      setIsValidating(false);
      setAuthStateToken(null); // Clear state token on error
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
        token: authStateToken, // Expose the state token
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
