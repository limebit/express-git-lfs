import "dotenv/config";
import { z } from "zod";

const envSchema = z
  .object({
    PORT: z.string().regex(/^\d+$/).default("8000").transform(Number),
    HOST: z.string().default("localhost"),
    PROTOCOL: z.enum(["http", "https"]).default("http"),

    DATA_FOLDER: z.string().optional(),

    API_KEY: z.string(),

    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().regex(/^\d+$/).default("900").transform(Number),
  })
  .and(
    z.discriminatedUnion("SSH_ENABLED", [
      z.object({
        SSH_ENABLED: z.literal("true"),
        SSH_PRIVATE_KEY_PATH: z.string(),
        SSH_PORT: z.string().regex(/^\d+$/).default("22").transform(Number),
      }),
      z.object({ SSH_ENABLED: z.literal("false") }),
      z.object({ SSH_ENABLED: z.literal(undefined) }),
    ])
  );

export const env = envSchema.parse(process.env);
