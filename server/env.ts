import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_WEBSOCKET_SERVER_ID: z.string(),
    NEXT_PUBLIC_WEBSOCKET_SERVER_REGION: z.string(),
  },
  server: {
    BASE_URL: z.string(),
    SIGNING_KEY: z.string(),
    REDIS_TOKEN: z.string(),
    DATABASE_URL: z.string(),
    REDIS_URL: z.string().url(),
    EMAIL_USERNAME: z.string(),
    EMAIL_PASSWORD: z.string(),
    WEBSOCKET_SERVER_PASSWORD: z.string(),
  },
  runtimeEnv: {
    BASE_URL: process.env.BASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
    SIGNING_KEY: process.env.SIGNING_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    NEXT_PUBLIC_WEBSOCKET_SERVER_REGION:
      process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_REGION,
    NEXT_PUBLIC_WEBSOCKET_SERVER_ID:
      process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_ID,
    WEBSOCKET_SERVER_PASSWORD: process.env.WEBSOCKET_SERVER_PASSWORD,
  },
});
