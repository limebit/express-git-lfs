import type { Express, Request, Response } from "express";
import { z } from "zod";
import { getAuthenticator, setMissingAuthHeaders } from "../authenticators";
import {
  getDownloadAction,
  getUploadAction,
  getVerifyAction,
} from "../utils/actions";
import { validateZodSchema } from "../utils/zod-middleware";

const batchRouteSchema = z.object({
  body: z.object({
    operation: z.enum(["upload", "download"]),
    transfers: z.string().array().optional(),
    ref: z.object({ name: z.string() }).optional(),
    objects: z.object({ oid: z.string(), size: z.number() }).array(),
    hash_algo: z.string().optional(),
  }),
  params: z.object({
    gitUser: z.string(),
    repo: z.string(),
  }),
});

const handleBatchRequest = async (req: Request, res: Response) => {
  res.set("Content-Type", "application/vnd.git-lfs+json");

  type reqType = z.infer<typeof batchRouteSchema>;

  const { operation, transfers, objects } = req.body as reqType["body"];

  const { gitUser, repo } = req.params as reqType["params"];

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

  if (transfers && !transfers?.includes("basic")) {
    return res.sendStatus(422);
  }

  const body = {
    transfer: "basic",
    objects: objects.map((object) => {
      let actions: Record<string, { href: string }> = {};

      if (operation === "upload") {
        actions["upload"] = getUploadAction(gitUser, repo, object.oid);
        actions["verify"] = getVerifyAction(gitUser, repo);
      }

      if (operation === "download")
        actions["download"] = getDownloadAction(gitUser, repo, object.oid);

      return {
        oid: object.oid,
        size: object.size,
        authenticated: true,
        actions,
      };
    }),
  };

  return res.status(200).json(body).end();
};

export const batchRoute = (app: Express) => {
  app.post(
    "/:gitUser/:repo/objects/batch",
    validateZodSchema(batchRouteSchema),
    handleBatchRequest
  );
};
