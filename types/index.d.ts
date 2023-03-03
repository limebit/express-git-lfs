import type { z } from "zod";
import type { Request } from "express";

export interface JWTPayload {
  gitUser: string;
  repo: string;
  action: "upload" | "download" | "verify";
  oid?: string;
}

export type TypedRequest<
  T extends z.Schema<{ params?: any; body?: any; query?: any }>,
  ResBody = any
> = Request<
  z.infer<T>["params"],
  ResBody,
  z.infer<T>["body"],
  z.infer<T>["query"]
>;
