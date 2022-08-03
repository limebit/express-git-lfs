import type { Request } from "express";
import fs from "fs";
import { Store } from ".";

export class LocalStore extends Store {
  put(user: string, repo: string, oid: string, req: Request): void {
    const filePath = `/Users/jakobkraus/Desktop/data/${user}/${repo}/${oid}`;

    req.pipe(fs.createWriteStream(filePath, { flags: "a" }));
  }
}
