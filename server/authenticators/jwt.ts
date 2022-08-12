import jwt from "jsonwebtoken";
import { getEnvVarWithDefault, getRequiredEnvVar } from "../utils";
import type { JWTPayload } from "../../types";

export const getExpiresIn = () => {
  return parseInt(getEnvVarWithDefault("JWT_EXPIRES_IN", "900"));
};

const getJWTSecret = () => {
  return getRequiredEnvVar("JWT_SECRET");
};

export const generateJWT = ({ gitUser, repo, action, oid }: JWTPayload) => {
  const secret = getJWTSecret();

  return jwt.sign({ gitUser, repo, action, oid }, secret, {
    expiresIn: getExpiresIn(),
  });
};

export const verifyJWT = (token: string) => {
  const secret = getJWTSecret();

  try {
    const payload = jwt.verify(token, secret) as JWTPayload;

    return { isVerified: true, payload };
  } catch {
    return { isVerified: false };
  }
};
