import type stream from "stream";
import { LocalStore } from "./local-store";

export interface Store {
  put(gitUser: string, repo: string, oid: string): stream.Writable;
  get(gitUser: string, repo: string, oid: string): stream.Readable;
  getFileSize(gitUser: string, repo: string, oid: string): number;
}

export const getStore = (): Store => {
  return LocalStore;
};
