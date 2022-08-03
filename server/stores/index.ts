import type { Request } from "express";

export class Store {
  put(user: string, repo: string, oid: string, req: Request) {
    throw new Error("Can not use put from Store class");
  }
  get(user: string, repo: string, oid: string, req: Request) {
    throw new Error("Can not use get from Store class");
  }
}
