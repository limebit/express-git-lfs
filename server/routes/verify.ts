import type { Express, Response } from "express";
import { z } from "zod";
import { getStore } from "../stores";
import { validateZodSchema } from "../utils/middlewares/zod-middleware";
import { validateJWT } from "../utils/middlewares/jwt-middleware";
import type { TypedRequest } from "../../types";

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

const handleVerifyRequest = (
  req: TypedRequest<typeof verifyRouteSchema>,
  res: Response
) => {
  res.set("Content-Type", "application/vnd.git-lfs+json");

  const { oid, size } = req.body;

  const { gitUser, repo } = req.params;

  const store = getStore();

  const fileSize = store.getFileSize(gitUser, repo, oid);

  if (fileSize !== size) return res.status(422).end();

  return res.status(200).end();
};

export const verifyRoute = (app: Express) => {
  app.post(
    "/:gitUser/:repo/verify",
    validateZodSchema(verifyRouteSchema),
    validateJWT<typeof verifyRouteSchema>("verify"),
    handleVerifyRequest
  );
};
