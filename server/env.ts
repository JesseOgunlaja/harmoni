import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {},
  server: {
    BASE_URL: z.string(),
    SIGNING_KEY: z.string(),
    REDIS_TOKEN: z.string(),
    DATABASE_URL: z.string(),
    REDIS_URL: z.string().url(),
    EMAIL_USERNAME: z.string(),
    EMAIL_PASSWORD: z.string(),
  },
  runtimeEnv: {
    BASE_URL: process.env.BASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
    SIGNING_KEY: process.env.SIGNING_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  },
});
