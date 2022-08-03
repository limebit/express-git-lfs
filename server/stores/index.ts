import type { Request } from "express";
import type stream from "stream";
import { LocalStore } from "./local-store";

export interface Store {
  put(user: string, repo: string, oid: string, req: Request): void;
  get(user: string, repo: string, oid: string): stream.Readable;
  getFileSize(user: string, repo: string, oid: string): number;
}

export const getStore = (): Store => {
  return LocalStore;
};
