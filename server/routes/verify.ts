import type { Express, Request, Response } from "express";
import { z } from "zod";
import { getStore } from "../stores";
import { validateZodSchema } from "../utils/zod-middleware";
import { validateJWT } from "../utils/jwt-middleware";

const verifyRouteSchema = z.object({
  body: z.object({
    oid: z.string(),
    size: z.number(),
  }),
  params: z.object({
    gitUser: z.string(),
    repo: z.string(),
  }),
});

const handleBatchRequest = (req: Request, res: Response) => {
  res.set("Content-Type", "application/vnd.git-lfs+json");

  type reqType = z.infer<typeof verifyRouteSchema>;

  const { oid, size } = req.body as reqType["body"];

  const { gitUser, repo } = req.params as reqType["params"];

  const store = getStore();

  const fileSize = store.getFileSize(gitUser, repo, oid);

  if (fileSize !== size) return res.status(422).end();

  return res.status(200).end();
};

export const verifyRoute = (app: Express) => {
  app.post(
    "/:gitUser/:repo/verify",
    validateZodSchema(verifyRouteSchema),
    validateJWT("verify"),
    handleBatchRequest
  );
};
