import type { Request } from "express";
import fs from "fs";
import { getRequiredEnvVar } from "../utils/env";
import path from "path";
import type { Store } from ".";

interface LocalStoreType extends Store {
  getFilePath(gitUser: string, repo: string, oid: string): string;
}

export const LocalStore: LocalStoreType = {
  put(gitUser: string, repo: string, oid: string, req: Request) {
    const filePath = this.getFilePath(gitUser, repo, oid);

    req.pipe(fs.createWriteStream(filePath));
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
    const dataFolder = getRequiredEnvVar("DATA_FOLDER");

    const pathWithoutFile = path.join(dataFolder, gitUser, repo);

    if (!fs.existsSync(pathWithoutFile))
      fs.mkdirSync(pathWithoutFile, { recursive: true });

    const filePath = path.join(pathWithoutFile, oid);

    return filePath;
  },
};
