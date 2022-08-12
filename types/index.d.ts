export interface JWTPayload {
  gitUser: string;
  repo: string;
  action: "upload" | "download" | "verify";
  oid?: string;
}
