import type { Express, Request, Response } from "express";
import { z } from "zod";
import { validateZodSchema } from "../utils/zod-middleware";
import { getStore } from "../stores";

const objectsRouteSchema = z.object({
  params: z.object({
    user: z.string(),
    repo: z.string(),
    oid: z.string(),
  }),
});

const handleDownload = (req: Request, res: Response) => {
  type reqType = z.infer<typeof objectsRouteSchema>;

  const { user, repo, oid } = req.params as reqType["params"];

  const store = getStore();

  const fileSize = store.getFileSize(user, repo, oid);

  res.set("Content-Length", fileSize.toString());

  const readStream = store.get(user, repo, oid);

  readStream.pipe(res);
};

const handleUpload = (req: Request, res: Response) => {
  type reqType = z.infer<typeof objectsRouteSchema>;

  const { user, repo, oid } = req.params as reqType["params"];

  const store = getStore();

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
