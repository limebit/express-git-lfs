import type { Response, NextFunction } from "express";
import { verifyJWT } from "../jwt";
import type { JWTPayload, TypedRequest } from "../../../types";
import type { z } from "zod";

export const validateJWT =
  <
    T extends z.Schema<{
      params: { gitUser: string; repo: string; oid?: string };
    }>
  >(
    action: "upload" | "download" | "verify"
  ) =>
  async (req: TypedRequest<T>, res: Response, next: NextFunction) => {
    const { gitUser, repo, oid } = req.params;

    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) return res.sendStatus(403);

    const bearer = authorizationHeader.split(" ");

    const token = bearer[1];

    if (bearer[0] != "Bearer" || !token) return res.sendStatus(403);

    const credentials = verifyJWT<JWTPayload>(token);

    if (!credentials.isVerified || !credentials.payload)
      return res.sendStatus(403);

    const {
      gitUser: tokenGitUser,
      repo: tokenRepo,
      action: tokenAction,
      oid: tokenOid,
    } = credentials.payload;

    if (
      gitUser != tokenGitUser ||
      repo != tokenRepo ||
      action != tokenAction ||
      oid != tokenOid
    )
      return res.sendStatus(403);

    return next();
  };
