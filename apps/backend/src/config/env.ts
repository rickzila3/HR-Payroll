
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(4000),

  LOG_LEVEL: z
    .enum(["error", "warn", "info", "debug"])
    .default("info"),

  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),

  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment configuration:");

  for (const issue of result.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }

  throw new Error("Environment configuration validation failed.");
}

export const env = result.data;
export type Env = z.infer<typeof envSchema>;
