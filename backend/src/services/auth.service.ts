import { APP_ORIGIN } from "../constants/env";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../constants/http-status";
import Verification from "../constants/verification";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verification-code.model";
import appAssert from "../utils/app-assert";
import {
  fiveMinutesAgo,
  ONE_DAY_IN_MILLISECONDS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from "../utils/time";
import {
  refreshTokenSignOptions,
  refreshTokenVerifyOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";
import { sendEmail } from "../utils/send-email";
import {
  getForgotPasswordTemplate,
  getVerifyEmailTemplate,
} from "../utils/email-template";
import { hashValue } from "../utils/bcrypt";

type CreateUserParams = {
  email: string;
  password: string;
  userAgent?: string;
};

type LoginUserParams = {
  email: string;
  password: string;
  userAgent?: string;
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

export const createUser = async (params: CreateUserParams) => {
  //verify existence of email
  const existingEmail = await UserModel.exists({ email: params.email });
  appAssert(!existingEmail, CONFLICT, "Email already exists.");

  //create user
  const user = await UserModel.create({
    email: params.email,
    password: params.password,
  });
  const userId = user._id;

  //create verification token
  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: Verification.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;

  // send verification email
  const { data, error } = await sendEmail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });
  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`,
  );

  //create session
  const session = await SessionModel.create({
    userId,
    userAgent: params.userAgent,
    expiresAt: thirtyDaysFromNow(),
  });

  const sessionInfo = {
    sessionId: session._id,
  };

  //sign access token and refresh token
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId,
  });

  //return user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (params: LoginUserParams) => {
  //get user by email
  const user = await UserModel.findOne({ email: params.email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password.");

  //validate password
  const isValid = await user.comparePassword(params.password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password.");

  const userId = user._id;

  //create session
  const session = await SessionModel.create({
    userId,
    userAgent: params.userAgent,
    expiresAt: thirtyDaysFromNow(),
  });

  const sessionInfo = {
    sessionId: session._id,
  };

  //sign access token and refresh token
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId,
  });

  //return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const logoutUser = async (accessToken: string) => {
  const { payload } = verifyToken(accessToken);
  if (payload?.sessionId) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken(refreshToken, refreshTokenVerifyOptions);
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token.");

  const session = await SessionModel.findById(payload.sessionId);
  const dateNow = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > dateNow,
    UNAUTHORIZED,
    "Session expired.",
  );

  //refresh session if it expires in the next 24 hours
  const sessionNeedsRefresh =
    session.expiresAt.getTime() - dateNow < ONE_DAY_IN_MILLISECONDS;

  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const sessionInfo = {
    sessionId: session._id,
  };

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(sessionInfo, refreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    ...sessionInfo,
    userId: session.userId,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const verifyUserEmail = async (code: string) => {
  //get verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: Verification.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code.");

  //update user to verified true
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    { verified: true },
    { new: true },
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email.");

  //delete all existing verification code for this user
  await VerificationCodeModel.deleteMany({
    userId: validCode.userId,
    type: Verification.EmailVerification,
  });

  //return user
  return {
    user: updatedUser.omitPassword(),
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  //get user by email
  const user = await UserModel.findOne({ email });
  if (!user) return;

  //check email rate limit
  const fiveMinsAgo = fiveMinutesAgo();
  const count = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: Verification.ForgotPassword,
    createdAt: { $gt: fiveMinsAgo },
  });
  appAssert(
    count <= 1,
    TOO_MANY_REQUESTS,
    "Too many requests, please try again later.",
  );

  //create verification code
  const expiresAt = oneHourFromNow();
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: Verification.ForgotPassword,
    expiresAt,
  });

  //send verification email
  const url = `${APP_ORIGIN}/password/reset?code=${
    verificationCode._id
  }&exp=${expiresAt.getTime()}`;

  const { data, error } = await sendEmail({
    to: email,
    ...getForgotPasswordTemplate(url),
  });
  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`,
  );

  //return success
  return {
    url,
    emailId: data.id,
  };
};

export const resetUserPassword = async ({
  password,
  verificationCode,
}: ResetPasswordParams) => {
  //get verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: Verification.ForgotPassword,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code.");

  //update user's password
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    {
      password: await hashValue(password),
    },
    {
      new: true,
    },
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password.");

  //delete verification code
  await validCode.deleteOne();

  //clear all sessions
  await SessionModel.deleteMany({
    userId: updatedUser._id,
  });

  //return user
  return {
    user: updatedUser.omitPassword(),
  };
};
