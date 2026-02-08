import { RequestHandler } from "express";
import appAssert from "../utils/app-assert";
import AppError from "../constants/app-error";
import { verifyToken } from "../utils/jwt";
import { UNAUTHORIZED } from "../constants/http-status";

const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken as string | undefined;
    appAssert(
      accessToken,
      UNAUTHORIZED,
      "Not authorized.",
      AppError.InvalidAccessToken,
    );

    const { error, payload } = verifyToken(accessToken);
    appAssert(
      payload,
      UNAUTHORIZED,
      error === "jwt expired" ? "Token expired." : "Invalid Token.",
      AppError.InvalidAccessToken,
    );

    req.userId = payload.userId;
    req.sessionId = payload.sessionId;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
