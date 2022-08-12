import type { Request, Response } from "express";
import { BasicAuthenticator } from "./basic-authenticator";

export interface Authenticator {
  checkAuthorization(req: Request, res: Response): Promise<boolean>;
}

export const getAuthenticator = (): Authenticator => {
  return BasicAuthenticator;
};
