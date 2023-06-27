import type { Express, Response } from "express";
import { z } from "zod";
import { validateZodSchema } from "../utils/middlewares/zod-middleware";
import { getStore } from "../stores";
import { validateJWT } from "../utils/middlewares/jwt-middleware";
import type { TypedRequest } from "../../types";

const objectsRouteSchema = z.object({
  params: z.object({
    gitUser: z.string(),
    repo: z.string(),
    oid: z.string(),
  }),
});

const handleDownload = (
  req: TypedRequest<typeof objectsRouteSchema>,
  res: Response
) => {
  const { gitUser, repo, oid } = req.params;

  const store = getStore();

  const fileSize = store.getFileSize(gitUser, repo, oid);

  res.set("Content-Length", fileSize.toString());

  const readStream = store.get(gitUser, repo, oid);

  const stream = readStream.pipe(res);

  stream.on("finish", () => {
    res.end();
  });
};

const handleUpload = (
  req: TypedRequest<typeof objectsRouteSchema>,
  res: Response
) => {
  const { gitUser, repo, oid } = req.params;

  const store = getStore();

  const writeStream = store.put(gitUser, repo, oid);

  const stream = req.pipe(writeStream);

  stream.on("finish", () => {
    res.sendStatus(200);
  });
};

export const objectsRoute = (app: Express) => {
  app.get(
    "/:gitUser/:repo/objects/:oid",
    validateZodSchema(objectsRouteSchema),
    validateJWT<typeof objectsRouteSchema>("download"),
    handleDownload
  );
  app.put(
    "/:gitUser/:repo/objects/:oid",
    validateZodSchema(objectsRouteSchema),
    validateJWT<typeof objectsRouteSchema>("upload"),
    handleUpload
  );
};
