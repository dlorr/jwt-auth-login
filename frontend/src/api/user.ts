import api from "./apiClient";
import type { User } from "@/types";

// ── User ──────────────────────────────────────────────────

export const getUserApi = async (): Promise<User> => {
  const res = await api.get<User>("/user");
  return res.data;
};

export const resendVerificationApi = async (): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/user/resend-verification");
  return res.data;
};
