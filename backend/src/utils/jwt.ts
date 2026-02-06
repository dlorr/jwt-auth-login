import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { SessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import { JWT_CONFIG } from "../constants/env";

export type RefreshTokenPayload = {
  sessionId: SessionDocument["_id"];
};
export type AccessTokenPayload = {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
};
const signDefaults: SignOptions = {
  audience: ["user"],
};

const verifyDefaults: VerifyOptions = {
  audience: ["user"],
};

// Define the SignOptionsAndSecret type
type SignOptionsAndSecret = SignOptions & {
  secret: string;
};
const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_CONFIG.SECRET,
};
export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_CONFIG.REFRESH_SECRET,
};

// Define the VerifyOptionsAndSecret type
type VerifyOptionsAndSecret = VerifyOptions & {
  secret: string;
};
const accessTokenVerifyOptions: VerifyOptionsAndSecret = {
  secret: JWT_CONFIG.SECRET,
};
export const refreshTokenVerifyOptions: VerifyOptionsAndSecret = {
  secret: JWT_CONFIG.REFRESH_SECRET,
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret,
) => {
  const { secret, ...signOptions } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...signDefaults,
    ...signOptions,
  });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptionsAndSecret,
) => {
  const { secret, ...verifyOptions } = options || accessTokenVerifyOptions;
  try {
    const payload = jwt.verify(token, secret, {
      ...verifyDefaults,
      ...verifyOptions,
    }) as TPayload;

    return {
      payload,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
