import type { Express, Request, Response } from "express";
import { z } from "zod";
import { validateZodSchema } from "../utils/middlewares/zod-middleware";
import { getStore } from "../stores";
import { validateJWT } from "../utils/middlewares/jwt-middleware";

const objectsRouteSchema = z.object({
  params: z.object({
    gitUser: z.string(),
    repo: z.string(),
    oid: z.string(),
  }),
});

const handleDownload = (req: Request, res: Response) => {
  type reqType = z.infer<typeof objectsRouteSchema>;

  const { gitUser, repo, oid } = req.params as reqType["params"];

  const store = getStore();

  const fileSize = store.getFileSize(gitUser, repo, oid);

  res.set("Content-Length", fileSize.toString());

  const readStream = store.get(gitUser, repo, oid);

  const stream = readStream.pipe(res);

  stream.on("finish", () => {
    res.end();
  });
};

const handleUpload = async (req: Request, res: Response) => {
  type reqType = z.infer<typeof objectsRouteSchema>;

  const { gitUser, repo, oid } = req.params as reqType["params"];

  const store = getStore();

  await store.put(gitUser, repo, oid, req);

  return res.sendStatus(200);
};

export const objectsRoute = (app: Express) => {
  app.get(
    "/:gitUser/:repo/objects/:oid",
    validateZodSchema(objectsRouteSchema),
    validateJWT("download"),
    handleDownload
  );
  app.put(
    "/:gitUser/:repo/objects/:oid",
    validateZodSchema(objectsRouteSchema),
    validateJWT("upload"),
    handleUpload
  );
};
