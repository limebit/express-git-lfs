import type { Response } from "express";
import { BasicAuthenticator } from "./basic-authenticator";
import { SSHAuthenticator } from "./ssh-authenticator";

export interface Authenticator {
  checkAuthorization(
    res: Response,
    authorizationHeader: string
  ): Promise<boolean>;
}

export const getAuthenticator = (authHeader: string): Authenticator | null => {
  const authorization = authHeader.split(" ");

  switch (authorization[0]) {
    case "Basic":
      return BasicAuthenticator;
    case "Bearer":
      return SSHAuthenticator;
    default:
      return null;
  }
};

export const setMissingAuthHeaders = (res: Response) => {
  res.set("LFS-Authenticate", 'Basic realm="Git LFS"');
};
