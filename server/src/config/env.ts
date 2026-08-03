import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),

  NODE_ENV: z.string().default("development"),

  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),

  JWT_SECRET: z.string(),

  MONGODB_URI: z.string(),

  FIREBASE_PROJECT_ID: z.string().default(""),
  FIREBASE_CLIENT_EMAIL: z.string().default(""),
  FIREBASE_PRIVATE_KEY: z.string().default(""),

  YOUCAM_API_KEY: z.string().default(""),
  YOUCAM_API_SECRET: z.string().default(""),
});

export const env = envSchema.parse(process.env);