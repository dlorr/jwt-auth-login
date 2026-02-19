import asyncHandler from "../utils/async-handler";
import { OK } from "../constants/http-status";
import { getUserById, sendVerificationEmail } from "../services/user.service";

export const getUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.userId);
  return res.status(OK).json(user);
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  await sendVerificationEmail(req.userId);
  return res.status(OK).json({ message: "Verification email sent." });
});
