import z from "zod";
import {
  AT_LEAST_ONE_NUMBER,
  AT_LEAST_ONE_LETTER,
  AT_LEAST_ONE_LOWERCASE,
  AT_LEAST_ONE_UPPERCASE,
  AT_LEAST_ONE_SPECIAL_CHAR,
} from "../constants/regex";

/**
 * Email Schema
 */
export const emailSchema = z
  .string()
  .min(6, { message: "Email must be at least 6 characters." })
  .max(100, { message: "Email cannot exceed 100 characters." })
  .email({ message: "Invalid email address." });

/**
 * Password Schema
 */
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .max(100, { message: "Password cannot exceed 100 characters." })
  .regex(AT_LEAST_ONE_NUMBER, { message: "At least one number is required." })
  .regex(AT_LEAST_ONE_LETTER, { message: "At least one letter is required." })
  .regex(AT_LEAST_ONE_LOWERCASE, {
    message: "At least one lowercase letter is required.",
  })
  .regex(AT_LEAST_ONE_UPPERCASE, {
    message: "At least one uppercase letter is required.",
  })
  .regex(AT_LEAST_ONE_SPECIAL_CHAR, {
    message: "At least one special character is required.",
  });

/**
 * Confirm Password Schema
 */
export const confirmPasswordSchema = z
  .string()
  .min(8, { message: "Confirm password must be at least 8 characters." })
  .max(100, { message: "Confirm password cannot exceed 100 characters." });

/**
 * Register Schema
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

/**
 * Login Schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(100, { message: "Password cannot exceed 100 characters." }),
  userAgent: z.string().optional(),
});

/**
 * Verification Code Schema
 */
export const verificationCodeSchema = z
  .string()
  .length(24, { message: "Invalid or expired verification code." });

/**
 * Request Password Schema
 */
export const requestPasswordSchema = z
  .object({
    verificationCode: verificationCodeSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

/**
 * Session Schema
 */
export const sessionSchema = z
  .string()
  .length(24, { message: "Invalid session id." });
