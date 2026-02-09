import { CREATED, OK, UNAUTHORIZED } from "../constants/http-status";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  requestPasswordSchema,
  verificationCodeSchema,
} from "../schemas/auth.schema";
import {
  createUser,
  loginUser,
  logoutUser,
  refreshUserAccessToken,
  resetUserPassword,
  sendPasswordResetEmail,
  verifyUserEmail,
} from "../services/auth.service";
import appAssert from "../utils/app-assert";
import asyncHandler from "../utils/async-handler";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/auth-cookies";

export const register = asyncHandler(async (req, res) => {
  //validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  //call service
  const { user, accessToken, refreshToken } = await createUser(request);

  //return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});

export const login = asyncHandler(async (req, res) => {
  //validate request
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  //call service
  const { user, accessToken, refreshToken } = await loginUser(request);

  //return response
  return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
    message: "Login successful.",
  });
});

export const logout = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  await logoutUser(accessToken);

  return clearAuthCookies(res).status(OK).json({
    message: "Logout successful.",
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token.");

  const { accessToken, newRefreshToken } =
    await refreshUserAccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
      message: "Access token refreshed.",
      refreshToken: newRefreshToken,
    });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  await verifyUserEmail(verificationCode);

  return res.status(OK).json({
    message: "Email was successfully verified.",
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = emailSchema.parse(req.body.email);

  await sendPasswordResetEmail(email);

  return res.status(OK).json({
    message: "Password reset email sent.",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const request = requestPasswordSchema.parse(req.body);

  await resetUserPassword(request);

  return clearAuthCookies(res).status(OK).json({
    message: "Password reset successful.",
  });
});
