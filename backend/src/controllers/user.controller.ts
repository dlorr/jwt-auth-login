import asyncHandler from "../utils/async-handler";
import { OK } from "../constants/http-status";
import { getUserById } from "../services/user.service";

export const getUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.userId);
  return res.status(OK).json(user);
});
