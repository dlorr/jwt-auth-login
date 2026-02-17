// ── User ────────────────────────────────────────────────
export interface User {
  _id: string;
  email: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Session ─────────────────────────────────────────────
export interface Session {
  _id: string;
  userId: string;
  userAgent?: string;
  createdAt: string;
  expiresAt: string;
  isCurrent?: boolean;
}

// ── Auth ─────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  verificationCode: string;
}

// ── API Errors ────────────────────────────────────────────
export interface ApiFieldError {
  path: string;
  message: string;
}

export interface ApiError {
  message: string;
  errorCode?: string;
  errors?: ApiFieldError[];
}

// ── Form field errors map ─────────────────────────────────
export type FieldErrors = Record<string, string>;
