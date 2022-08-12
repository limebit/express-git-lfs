import type { Response, Request, NextFunction } from "express";
import { getRequiredEnvVar } from ".";
import crypto from "crypto";

export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader) return res.sendStatus(403);

  const bearer = authorizationHeader.split(" ");

  const token = bearer[1];

  if (bearer[0] != "Bearer" || !token) return res.sendStatus(403);

  const tokenBuffer = Buffer.from(token);

  const apiKeyBuffer = Buffer.from(getRequiredEnvVar("API_KEY"));

  if (
    tokenBuffer.byteLength === apiKeyBuffer.byteLength &&
    crypto.timingSafeEqual(tokenBuffer, apiKeyBuffer)
  ) {
    return next();
  } else {
    return res.sendStatus(403);
  }
};
