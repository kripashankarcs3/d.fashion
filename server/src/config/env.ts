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

  ANTHROPIC_API_KEY: z.string().default(""),
});

export const env = envSchema.parse(process.env);

/** True when a secret is short or still a guessable default. */
export const isWeakJwtSecret = (secret: string): boolean =>
  secret.length < 32 || /deestyle|change-me|secret|replace/i.test(secret);

export const assertJwtSecretForProduction = (nodeEnv = env.NODE_ENV): void => {
  if (nodeEnv === "production" && isWeakJwtSecret(env.JWT_SECRET)) {
    console.error(
      "[startup] JWT_SECRET is weak or still the default. Generate one: openssl rand -base64 48"
    );
    process.exit(1);
  }
};