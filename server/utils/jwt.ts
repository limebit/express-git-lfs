import jwt from "jsonwebtoken";
import { getEnvVarWithDefault, getRequiredEnvVar } from "./env";

export const getExpiresIn = () => {
  return parseInt(getEnvVarWithDefault("JWT_EXPIRES_IN", "900"));
};

export const getJWTSecret = () => {
  return getRequiredEnvVar("JWT_SECRET");
};

export const generateJWT = <T extends string | object | Buffer>(payload: T) => {
  const secret = getJWTSecret();

  return jwt.sign(payload, secret, {
    expiresIn: getExpiresIn(),
  });
};

export const verifyJWT = <T extends string | object | Buffer>(
  token: string
) => {
  const secret = getJWTSecret();

  try {
    const payload = jwt.verify(token, secret) as T;

    return { isVerified: true, payload };
  } catch {
    return { isVerified: false };
  }
};
