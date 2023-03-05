import type { Express, Response } from "express";
import { z } from "zod";
import { validateAuthorization } from "../utils/middlewares/auth-middleware";
import {
  getDownloadAction,
  getUploadAction,
  getVerifyAction,
} from "../utils/actions";
import { validateZodSchema } from "../utils/middlewares/zod-middleware";
import type { TypedRequest } from "../../types";

const batchRouteSchema = z.object({
  body: z.object({
    operation: z.enum(["upload", "download"]),
    transfers: z.string().array().nullish(),
    ref: z.object({ name: z.string() }).nullish(),
    objects: z.object({ oid: z.string(), size: z.number() }).array(),
    hash_algo: z.string().nullish(),
  }),
  params: z.object({
    gitUser: z.string(),
    repo: z.string(),
  }),
});

const handleBatchRequest = async (
  req: TypedRequest<typeof batchRouteSchema>,
  res: Response
) => {
  res.set("Content-Type", "application/vnd.git-lfs+json");

  const { operation, transfers, objects } = req.body;

  const { gitUser, repo } = req.params;

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
    validateAuthorization,
    handleBatchRequest
  );
};
