import type { Express, Request, Response } from "express";
import { z } from "zod";
import { validateZodSchema } from "../utils/zod-middleware";

const verifyRouteSchema = z.object({
  body: z.object({
    oid: z.string(),
    size: z.number(),
  }),
  params: z.object({
    user: z.string(),
    repo: z.string(),
  }),
});

const handleBatchRequest = (req: Request, res: Response) => {
  res.set("Content-Type", "application/vnd.git-lfs+json");

  type reqType = z.infer<typeof verifyRouteSchema>;

  const { oid, size } = req.body as reqType["body"];

  const { user, repo } = req.params as reqType["params"];

  console.log(oid, size, user, repo);

  // res.sendStatus(422).end();
  res.set("LFS-Authenticate", 'Basic realm="Git LFS"');
  return res.status(200).end();
};

export const verifyRoute = (app: Express) => {
  app.post(
    "/:user/:repo/verify",
    validateZodSchema(verifyRouteSchema),
    handleBatchRequest
  );
};
