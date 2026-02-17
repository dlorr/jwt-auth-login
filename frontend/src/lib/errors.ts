import axios from "axios";
import type { ApiError, FieldErrors } from "@/types";

export const parseApiError = (
  error: unknown,
): { message: string; fieldErrors: FieldErrors } => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;

    if (data?.errors && Array.isArray(data.errors)) {
      const fieldErrors: FieldErrors = {};
      data.errors.forEach((e) => {
        fieldErrors[e.path] = e.message;
      });
      return {
        message: data.message || "Validation failed.",
        fieldErrors,
      };
    }

    return {
      message: data?.message || "An error occurred. Please try again.",
      fieldErrors: {},
    };
  }

  return {
    message: "An unexpected error occurred.",
    fieldErrors: {},
  };
};
