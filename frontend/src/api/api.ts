import API from "./apiClient";

// ============================================
// REQUEST TYPES
// ============================================
export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordData = {
  verificationCode: string;
  password: string;
  confirmPassword: string;
};

// ============================================
// RESPONSE TYPES
// ============================================
export type User = {
  _id: string;
  email: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  _id: string;
  userAgent: string;
  createdAt: string;
  isCurrent?: boolean;
};

export type MessageResponse = {
  message: string;
};

// ============================================
// AUTH API
// ============================================

export const register = async (data: RegisterData): Promise<User> =>
  API.post("/auth/register", data);

export const login = async (data: LoginData): Promise<MessageResponse> =>
  API.post("/auth/login", data);

export const logout = async (): Promise<MessageResponse> =>
  API.get("/auth/logout");

export const verifyEmail = async (
  verificationCode: string,
): Promise<MessageResponse> =>
  API.get(`/auth/email/verify/${verificationCode}`);

export const sendPasswordResetEmail = async (
  email: string,
): Promise<MessageResponse> => API.post("/auth/password/forgot", { email });

export const resetPassword = async (
  data: ResetPasswordData,
): Promise<MessageResponse> => API.post("/auth/password/reset", data);

// ============================================
// USER API
// ============================================

export const getUser = async (): Promise<User> => API.get("/user");

// ============================================
// SESSION API
// ============================================

export const getSessions = async (): Promise<Session[]> =>
  API.get("/session/all");

export const deleteSession = async (id: string): Promise<MessageResponse> =>
  API.delete(`/session/${id}`);
