import { APP_ORIGIN } from "../constants/env";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
} from "../constants/http-status";
import Verification from "../constants/verification";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verification-code.model";
import appAssert from "../utils/app-assert";
import { getVerifyEmailTemplate } from "../utils/email-template";
import { sendEmail } from "../utils/send-email";
import { fiveMinutesAgo, oneYearFromNow } from "../utils/time";

export const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, "User not found.");
  return user.omitPassword();
};

export const sendVerificationEmail = async (userId: string) => {
  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, "User not found.");
  appAssert(!user.verified, BAD_REQUEST, "Email is already verified.");

  // Rate limit: max 1 per 5 minutes
  const fiveMinsAgo = fiveMinutesAgo();
  const count = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: Verification.EmailVerification,
    createdAt: { $gt: fiveMinsAgo },
  });
  appAssert(
    count <= 1,
    TOO_MANY_REQUESTS,
    "Too many requests, please try again later.",
  );

  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: Verification.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
  const { data, error } = await sendEmail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });
  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`,
  );

  return { url, emailId: data.id };
};
