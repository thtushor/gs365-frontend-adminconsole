// utils/apiClient.js

import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// --- Reusable POST Request Hook ---
export const usePostRequest = () => {
  const { logout } = useAuth();

  return async ({
    url,
    body,
    contentType = "application/json",
    successMessage,
    errorMessage,
    setLoading = false,
    onSuccessFn = false,
  }) => {
    if (setLoading) {
      setLoading(true);
    }
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": contentType,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        toast.error("Session expired. Logging out!");
        logout();
        return;
      }

      if (!res.ok || data.status === false) {
        throw new Error(
          errorMessage || data.message || "Something went wrong."
        );
      }

      toast.success(successMessage || data.message || "Success");
      if (onSuccessFn) {
        onSuccessFn(data);
      }
      return data;
    } catch (err) {
      console.log(err);
      toast.error(err.message || errorMessage || "Failed to send request.");
      throw err;
    } finally {
      if (setLoading) {
        setLoading(false);
      }
    }
  };
};

// --- Reusable GET Request Hook ---
export const useGetRequest = () => {
  const { logout } = useAuth();

  return async ({
    url,
    params = {}, // ✅ Accept params here
    contentType = "application/json",
    successMessage,
    errorMessage,
    onSuccessFn = false,
  }) => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Build query string from params
      const queryString = new URLSearchParams(params).toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const res = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": contentType,
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        console.log("Session expired. Logging out!");
        logout();
        return;
      }

      if (!res.ok || data.status === false) {
        throw new Error(
          errorMessage || data.message || "Something went wrong."
        );
      }

      if (successMessage || data.message) {
        console.log(successMessage || data.message || "Success");
      }
      if (onSuccessFn) {
        onSuccessFn(data);
      }
      return data;
    } catch (err) {
      console.log(err.message || errorMessage || "Failed to fetch.");
      throw err;
    }
  };
};

export const useUpdateRequest = () => {
  const { logout } = useAuth();

  /**
   * Generic update API request function.
   *
   * @param {Object} params
   * @param {string} params.url - API endpoint
   * @param {Object} params.body - Request payload
   * @param {"POST" | "PUT" | "PATCH"} [params.method="PUT"] - HTTP method
   * @param {string} [params.contentType="application/json"] - Content-Type header
   * @param {string} [params.successMessage] - Custom success toast message
   * @param {string} [params.errorMessage] - Custom error toast message
   */
  return async ({
    url,
    body = null,
    method = "POST",
    contentType = "application/json",
    successMessage,
    errorMessage,
    refetch = false,
  }) => {
    try {
      const token = localStorage.getItem("token");

      const options = {
        method,
        headers: {
          "Content-Type": contentType,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body
          ? {
              body:
                contentType === "application/json"
                  ? JSON.stringify(body)
                  : body,
            }
          : {}),
      };

      const res = await fetch(url, options);
      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        toast.error("Session expired. Logging out!");
        logout();
        return null;
      }

      if (!res.ok || data.status === false) {
        throw new Error(
          errorMessage || data.message || "Something went wrong."
        );
      }

      if (refetch) {
        await refetch();
      }
      toast.success(successMessage || data.message || "Success");
      return data;
    } catch (err) {
      console.error("Update request error:", err);
      toast.error(
        err.message || errorMessage || "Failed to send update request."
      );
      throw err;
    }
  };
};
