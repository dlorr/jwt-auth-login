import { APP_ORIGIN } from "../constants/env";
import { CONFLICT } from "../constants/http-status";
import Verification from "../constants/verification";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verification-code.model";
import { CreateUserParams } from "../types/auth.type";
import appAssert from "../utils/app-assert";
import { oneYearFromNow, thirtyDaysFromNow } from "../utils/time";
import { refreshTokenSignOptions, signToken } from "../utils/jwt";

export const createUser = async (params: CreateUserParams) => {
  //verify existence of email
  const existingEmail = await UserModel.exists({ email: params.email });
  appAssert(!existingEmail, CONFLICT, "Email already exists");

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

  //send verification email
  //   const { data, error } = await sendEmail({
  //     to: user.email,
  //     ...getVerifyEmailTemplate(url),
  //   });
  //   appAssert(
  //     data?.id,
  //     INTERNAL_SERVER_ERROR,
  //     `${error?.name} - ${error?.message}`
  //   );

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
