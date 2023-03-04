import type { Response, Request, NextFunction } from "express";
import { getAuthenticator, setMissingAuthHeaders } from "../../authenticators";
import { env } from "../env";

export const validateAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (env.DISABLE_AUTHENTICATION) {
    return next();
  }

  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader) {
    setMissingAuthHeaders(res);
    return res.status(401).end();
  }

  const authenticator = getAuthenticator(authorizationHeader);

  if (!authenticator) {
    setMissingAuthHeaders(res);
    return res.status(401).end();
  }

  const authorized = await authenticator.checkAuthorization(
    res,
    authorizationHeader
  );

  if (!authorized) return res.status(401).end();

  return next();
};
