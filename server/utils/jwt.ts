import jwt from "jsonwebtoken";
import { env } from "./env";

export const getExpiresIn = () => {
  return env.JWT_EXPIRES_IN;
};

export const getJWTSecret = () => {
  return env.JWT_SECRET;
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
