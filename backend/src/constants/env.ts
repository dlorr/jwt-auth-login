import getEnv from "../config/env.config";

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "8005");
export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:3005");
export const MONGO_URI = getEnv("MONGO_URI");
export const JWT_CONFIG = {
  SECRET: getEnv("JWT_SECRET"),
  REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
};
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
