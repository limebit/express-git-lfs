import type { Express, Request, Response } from "express";
import { z } from "zod";
import { getUploadAction } from "../utils";
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
    user: z.string(),
    repo: z.string(),
  }),
});

const handleBatchRequest = (req: Request, res: Response) => {
  res.set("Content-Type", "application/vnd.git-lfs+json");

  type reqType = z.infer<typeof batchRouteSchema>;

  const {
    operation,
    transfers,
    ref,
    objects,
    hash_algo: hashAlgo,
  } = req.body as reqType["body"];

  const { user, repo } = req.params as reqType["params"];

  if (!transfers?.includes("basic")) {
    return res.sendStatus(422);
  }

  // console.log(operation, transfers, ref, objects, hashAlgo, user, repo);

  switch (operation) {
    case "upload":
      const body = {
        transfer: "basic",
        objects: objects.map((object) => ({
          oid: object.oid,
          size: object.size,
          authenticated: true,
          actions: {
            upload: getUploadAction(user, repo, object.oid, object.size),
          },
        })),
      };
      return res.status(200).json(body).end();
    case "download":
      break;
  }
};

export const batchRoute = (app: Express) => {
  app.post(
    "/:user/:repo/objects/batch",
    validateZodSchema(batchRouteSchema),
    handleBatchRequest
  );
};
