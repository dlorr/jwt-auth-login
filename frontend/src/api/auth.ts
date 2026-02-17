import api from "./apiClient";
import type {
  User,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "@/types";

// ── Auth ──────────────────────────────────────────────────

export const registerApi = async (data: RegisterPayload): Promise<User> => {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
};

export const loginApi = async (
  data: LoginPayload,
): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/auth/login", data);
  return res.data;
};

export const logoutApi = async (): Promise<{ message: string }> => {
  const res = await api.get<{ message: string }>("/auth/logout");
  return res.data;
};

export const refreshApi = async (): Promise<{ message: string }> => {
  const res = await api.get<{ message: string }>("/auth/refresh");
  return res.data;
};

export const verifyEmailApi = async (
  code: string,
): Promise<{ message: string }> => {
  const res = await api.get<{ message: string }>(`/auth/email/verify/${code}`);
  return res.data;
};

export const forgotPasswordApi = async (
  data: ForgotPasswordPayload,
): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>(
    "/auth/password/forgot",
    data,
  );
  return res.data;
};

export const resetPasswordApi = async (
  data: ResetPasswordPayload,
): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/auth/password/reset", data);
  return res.data;
};
