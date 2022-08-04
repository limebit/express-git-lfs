import type { Request } from "express";
import fs from "fs";
import { getRequiredEnvVar } from "../utils";
import path from "path";
import type { Store } from ".";

interface LocalStoreType extends Store {
  getFilePath(user: string, repo: string, oid: string): string;
}

export const LocalStore: LocalStoreType = {
  put(user: string, repo: string, oid: string, req: Request) {
    const filePath = this.getFilePath(user, repo, oid);

    req.pipe(fs.createWriteStream(filePath));
  },
  get(user: string, repo: string, oid: string) {
    const filePath = this.getFilePath(user, repo, oid);

    return fs.createReadStream(filePath);
  },
  getFileSize(user: string, repo: string, oid: string) {
    const filePath = this.getFilePath(user, repo, oid);

    if (!fs.existsSync(filePath)) return -1;

    const stats = fs.statSync(filePath);

    return stats.size;
  },
  getFilePath(user: string, repo: string, oid: string) {
    const dataFolder = getRequiredEnvVar("DATA_FOLDER");

    const pathWithoutFile = path.join(dataFolder, user, repo);

    if (!fs.existsSync(pathWithoutFile))
      fs.mkdirSync(pathWithoutFile, { recursive: true });

    const filePath = path.join(pathWithoutFile, oid);

    return filePath;
  },
};
