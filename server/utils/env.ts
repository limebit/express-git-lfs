import "dotenv/config";
import { z } from "zod";

const envSchema = z
  .object({
    PORT: z.string().default("8000"),
    HOST: z.string().default("localhost"),
    PROTOCOL: z.enum(["http", "https"]).default("http"),

    DATA_FOLDER: z.string().optional(),

    API_KEY: z.string(),

    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default("900"),
  })
  .and(
    z.discriminatedUnion("SSH_ENABLED", [
      z.object({
        SSH_ENABLED: z.literal("true"),
        SSH_PRIVATE_KEY_PATH: z.string(),
      }),
      z.object({ SSH_ENABLED: z.literal("false") }),
      z.object({ SSH_ENABLED: z.literal(undefined) }),
    ])
  );

export const env = envSchema.parse(process.env);

export const getProtocol = () => {
  return env.PROTOCOL;
};

export const getPort = () => {
  return env.PORT;
};

export const getHost = () => {
  return env.HOST;
};
