import type { Express, Request, Response } from "express";
import { LocalStore } from "../stores/local-store";
import { z } from "zod";
import { validateZodSchema } from "../utils/zod-middleware";

const objectsRouteSchema = z.object({
  params: z.object({
    user: z.string(),
    repo: z.string(),
    oid: z.string(),
  }),
});

const handleDownload = (_req: Request, res: Response) => {
  res.download("/Users/jakobkraus/express-git-lfs/server/testfile.txt");
};

const handleUpload = (req: Request, res: Response) => {
  type reqType = z.infer<typeof objectsRouteSchema>;

  const { user, repo, oid } = req.params as reqType["params"];

  const store = new LocalStore();
  store.put(user, repo, oid, req);

  return res.sendStatus(200);
};

export const objectsRoute = (app: Express) => {
  app.get(
    "/:user/:repo/objects/:oid",
    validateZodSchema(objectsRouteSchema),
    handleDownload
  );
  app.put(
    "/:user/:repo/objects/:oid",
    validateZodSchema(objectsRouteSchema),
    handleUpload
  );
};
