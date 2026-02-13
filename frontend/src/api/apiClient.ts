import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import queryClient from "../config/queryClient";
import { navigate } from "../lib/navigation";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
);

const API = axios.create(options);

type ErrorResponse = {
  errors?: Array<{
    path: string;
    message: string;
  }>;
  message?: string;
  errorCode?: string;
};

API.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<ErrorResponse>) => {
    const { config } = error;
    const { status, data } = error.response || {};

    if (status === 401 && data?.errorCode === "InvalidAccessToken") {
      try {
        await TokenRefreshClient.get("/auth/refresh");
        return TokenRefreshClient(config as InternalAxiosRequestConfig);
      } catch (refreshError) {
        queryClient.clear();
        navigate("/login", {
          state: {
            redirectUrl: window.location.pathname,
          },
        });
      }
    }

    return Promise.reject({ status, ...data });
  },
);

export default API;
