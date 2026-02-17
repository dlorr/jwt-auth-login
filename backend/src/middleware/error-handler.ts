import { Response, ErrorRequestHandler } from "express";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "../constants/http-status";
import { z } from "zod";
import { clearAuthCookies, REFRESH_PATH } from "../utils/auth-cookies";
import CustomError from "../utils/custom-error";

const handleZodErrror = (
  res: Response,
  error: z.ZodError,
  reqPath?: string,
) => {
  if (reqPath?.includes("/email/verify")) {
    return res.status(NOT_FOUND).json({
      message: "Invalid or expired verification code.",
    });
  }

  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  res.status(BAD_REQUEST).json({
    errors,
    message: "Validation failed.",
  });
};

const handleAppError = (res: Response, error: CustomError) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }
  if (error instanceof z.ZodError) {
    return handleZodErrror(res, error, req.path);
  }
  if (error instanceof CustomError) {
    return handleAppError(res, error);
  }
  res.status(INTERNAL_SERVER_ERROR).send("Internal server error.");
};

export default errorHandler;
