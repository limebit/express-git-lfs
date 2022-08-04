import type { Express, Request, Response } from "express";
import { z } from "zod";
import { getDownloadAction, getUploadAction } from "../utils";
import { validateZodSchema } from "../utils/zod-middleware";

const batchRouteSchema = z.object({
  body: z.object({
    operation: z.enum(["upload", "download"]),
    transfers: z.string().array().nullish(),
    ref: z.object({ name: z.string() }).nullish(),
    objects: z.object({ oid: z.string(), size: z.number() }).array(),
    hash_algo: z.string().nullish(),
  }),
  params: z.object({
    user: z.string(),
    repo: z.string(),
  }),
});

const handleBatchRequest = (req: Request, res: Response) => {
  res.set("Content-Type", "application/vnd.git-lfs+json");

  type reqType = z.infer<typeof batchRouteSchema>;

  const { operation, transfers, objects } = req.body as reqType["body"];

  const { user, repo } = req.params as reqType["params"];

  if (transfers && !transfers?.includes("basic")) {
    return res.sendStatus(422);
  }

  const body = {
    transfer: "basic",
    objects: objects.map((object) => {
      let actions: Record<string, { href: string }> = {};

      if (operation === "upload")
        actions["upload"] = getUploadAction(user, repo, object.oid);

      if (operation === "download")
        actions["download"] = getDownloadAction(user, repo, object.oid);

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
    "/:user/:repo/objects/batch",
    validateZodSchema(batchRouteSchema),
    handleBatchRequest
  );
};
