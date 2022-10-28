import type { Request } from "express";
import fs from "fs";
import path from "path";
import { env } from "../utils/env";
import type { Store } from ".";

interface LocalStoreType extends Store {
  getFilePath(gitUser: string, repo: string, oid: string): string;
}

export const LocalStore: LocalStoreType = {
  put(gitUser: string, repo: string, oid: string, req: Request) {
    return new Promise((resolve) => {
      const filePath = this.getFilePath(gitUser, repo, oid);

      const file = fs.createWriteStream(filePath);

      const stream = req.pipe(file);

      stream.on("finish", () => {
        resolve();
      });
    });
  },
  get(gitUser: string, repo: string, oid: string) {
    const filePath = this.getFilePath(gitUser, repo, oid);

    return fs.createReadStream(filePath);
  },
  getFileSize(gitUser: string, repo: string, oid: string) {
    const filePath = this.getFilePath(gitUser, repo, oid);

    if (!fs.existsSync(filePath)) return -1;

    const stats = fs.statSync(filePath);

    return stats.size;
  },
  getFilePath(gitUser: string, repo: string, oid: string) {
    const dataFolder = env.DATA_FOLDER;

    if (!dataFolder) throw Error("DATA_FOLDER not defined");

    const pathWithoutFile = path.join(dataFolder, gitUser, repo);

    if (!fs.existsSync(pathWithoutFile))
      fs.mkdirSync(pathWithoutFile, { recursive: true });

    const filePath = path.join(pathWithoutFile, oid);

    return filePath;
  },
};
