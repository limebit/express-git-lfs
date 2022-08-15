import jwt from "jsonwebtoken";
import { env } from "./env";

export const generateJWT = <T extends string | object | Buffer>(payload: T) => {
  const secret = env.JWT_SECRET;

  return jwt.sign(payload, secret, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const verifyJWT = <T extends string | object | Buffer>(
  token: string
) => {
  const secret = env.JWT_SECRET;

  try {
    const payload = jwt.verify(token, secret) as T;

    return { isVerified: true, payload };
  } catch {
    return { isVerified: false };
  }
};
