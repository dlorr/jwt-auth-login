import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8005",
  withCredentials: true, // send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Response interceptor: 401 + InvalidAccessToken → refresh → retry ─────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized = error.response?.status === 401;
    const isInvalidAccessToken =
      error.response?.data?.errorCode === "InvalidAccessToken";

    // Attempt token refresh for ANY 401 InvalidAccessToken,
    // EXCEPT when the failing request is already the refresh endpoint itself.
    if (
      (isUnauthorized || isInvalidAccessToken) &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (originalRequest.url?.includes("/auth/")) {
        // Return formatted error for auth endpoints
        return Promise.reject(error);
      }
      if (isRefreshing) {
        // Queue other requests that come in while refresh is in-flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.get("/auth/refresh");
        processQueue(null);
        isRefreshing = false;
        // Retry the original request (including the /user fetch on page load)
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        const currentPath = window.location.pathname;
        if (
          !currentPath.startsWith("/login") &&
          !currentPath.startsWith("/register") &&
          !currentPath.startsWith("/password") &&
          !currentPath.startsWith("/email")
        ) {
          // Use window.location.href for hard reload to clear all state
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
