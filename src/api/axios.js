import axios from "axios";
import { BASE_URL } from "./ApiList";

const Axios = axios.create({
  baseURL: BASE_URL, // Change to your API base URL
  timeout: 30000,
});

// Request interceptor for adding auth token
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optionally handle unauthorized globally
      window.location.href = "/login";
      localStorage.removeItem("token");
    } else if (error.code==="ERR_NETWORK") {

      // console.log({error})
      // Handle network errors (e.g., server unreachable)
      // if(!window.location.pathname?.includes("/server-error"))
      // window.location.replace("/server-error");
    }
    return Promise.reject(error);
  }
);

export default Axios;
