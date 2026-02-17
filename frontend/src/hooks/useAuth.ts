import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  loginApi,
  logoutApi,
  registerApi,
  forgotPasswordApi,
  resetPasswordApi,
  verifyEmailApi,
} from "@/api/auth";
import type {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "@/types";
import { getUserApi, resendVerificationApi } from "@/api/user";

export const USER_QUERY_KEY = ["user"] as const;

// ── Current User Query ────────────────────────────────────
export const useUser = () => {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: getUserApi,
    retry: false,
  });
};

// ── Login ─────────────────────────────────────────────────
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginPayload) => loginApi(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      navigate("/profile");
    },
  });
};

// ── Register ──────────────────────────────────────────────
export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterPayload) => registerApi(data),
    onSuccess: async (user) => {
      queryClient.setQueryData(USER_QUERY_KEY, user);
      navigate("/profile");
    },
  });
};

// ── Logout ────────────────────────────────────────────────
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      queryClient.clear();
      navigate("/login");
    },
  });
};

// ── Forgot Password ───────────────────────────────────────
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordPayload) => forgotPasswordApi(data),
  });
};

// ── Reset Password ────────────────────────────────────────
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPasswordApi(data),
    onSuccess: () => {
      setTimeout(() => navigate("/login"), 2000);
    },
  });
};

// ── Verify Email ──────────────────────────────────────────
export const useVerifyEmail = (code: string | undefined) => {
  return useQuery({
    queryKey: ["verifyEmail", code],
    queryFn: () => verifyEmailApi(code!),
    retry: false,
  });
};

// ── Resend Verification ───────────────────────────────────
export const useResendVerification = () => {
  return useMutation({
    mutationFn: resendVerificationApi,
  });
};
