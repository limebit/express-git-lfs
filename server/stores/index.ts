import type { Request } from "express";
import type stream from "stream";
import { LocalStore } from "./local-store";

export interface Store {
  put(gitUser: string, repo: string, oid: string, req: Request): Promise<void>;
  get(gitUser: string, repo: string, oid: string): stream.Readable;
  getFileSize(gitUser: string, repo: string, oid: string): number;
}

export const getStore = (): Store => {
  return LocalStore;
};
