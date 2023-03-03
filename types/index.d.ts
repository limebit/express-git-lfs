import type { z } from "zod";
import type { Request } from "express";

export interface JWTPayload {
  gitUser: string;
  repo: string;
  action: "upload" | "download" | "verify";
  oid?: string;
}

export type ExpressRequestSchema = z.Schema<{
  params?: any;
  body?: any;
  query?: any;
}>;

export type TypedRequest<
  T extends ExpressRequestSchema,
  ResBody = any
> = Request<
  z.infer<T>["params"],
  ResBody,
  z.infer<T>["body"],
  z.infer<T>["query"]
>;
