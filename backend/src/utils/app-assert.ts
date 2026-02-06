import assert from "node:assert";
import { HttpStatus } from "../constants/http-status";
import AppError from "../constants/app-error";
import CustomError from "./custom-error";

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatus,
  message: string,
  appErrorCode?: AppError,
) => asserts condition;

const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode,
) => assert(condition, new CustomError(httpStatusCode, message, appErrorCode));

export default appAssert;
