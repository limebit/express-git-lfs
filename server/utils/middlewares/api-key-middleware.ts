import type { Response, Request, NextFunction } from "express";
import { env } from "../env";
import { timingSafeEqualCheck } from "../crypt";

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

  const apiKeyBuffer = Buffer.from(env.API_KEY);

  if (timingSafeEqualCheck(tokenBuffer, apiKeyBuffer)) {
    return next();
  } else {
    return res.sendStatus(403);
  }
};
