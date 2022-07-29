import type { Express, Request, Response } from "express";

const handleDownload = (_req: Request, res: Response) => {
  res.download("/Users/jakobkraus/express-git-lfs/server/testfile.txt");
};

const handleUpload = (req: Request, res: Response) => {
  console.log(req);

  return res.sendStatus(200);
};

export const objectsRoute = (app: Express) => {
  app.get("/:user/:repo/objects/:oid", handleDownload);
  app.put("/:user/:repo/objects/:oid", handleUpload);
};
