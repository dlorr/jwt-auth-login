import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import queryClient from "../config/queryClient";
import { navigate } from "../lib/navigation";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use((response) => response.data);

const API = axios.create(options);

API.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<{ errorCode?: string }>) => {
    const config = error.config as AxiosRequestConfig;
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401 && data?.errorCode === "InvalidAccessToken") {
      try {
        await TokenRefreshClient.get("/auth/refresh");
        return TokenRefreshClient(config);
      } catch (err) {
        queryClient.clear();
        navigate("/login", {
          state: { redirectUrl: window.location.pathname },
        });
      }
    }

    return Promise.reject({ status, ...data });
  },
);

export default API;
