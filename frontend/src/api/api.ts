import API from "./apiClient";

// ----- Types -----
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  verificationCode: string;
  password: string;
  confirmPassword: string;
}

// ----- Auth API -----
export const login = (data: LoginData) => API.post("/auth/login", data);
export const logout = () => API.get("/auth/logout");
export const register = (data: RegisterData) =>
  API.post("/auth/register", data);
export const verifyEmail = (code: string) =>
  API.get(`/auth/email/verify/${code}`);
export const sendPasswordResetEmail = (email: string) =>
  API.post("/auth/password/forgot", { email });
export const resetPassword = (data: ResetPasswordData) =>
  API.post("/auth/password/reset", data);

// ----- User / Session API -----
export const getUser = () => API.get("/user");
export const getSessions = () => API.get("/session/sessions");
export const deleteSession = (id: string) => API.delete(`/session/${id}`);
