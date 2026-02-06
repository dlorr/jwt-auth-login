import AppError from "../constants/app-error";
import { HttpStatus } from "../constants/http-status";

class CustomError extends Error {
  constructor(
    public statusCode: HttpStatus,
    public message: string,
    public errorCode?: AppError,
  ) {
    super(message);
  }
}

export default CustomError;
