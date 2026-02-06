import { CREATED } from "../constants/http-status";
import { registerSchema } from "../schemas/auth.schema";
import { createUser } from "../services/auth.service";
import asyncHandler from "../utils/async-handler";
import { setAuthCookies } from "../utils/auth-cookies";

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
