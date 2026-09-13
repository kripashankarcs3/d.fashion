import { z } from "zod";

/** Central environment schema. Every deploy-sensitive constant in the server
 *  reads from here with a sane default, so no runtime value is "hardcoded". */
const int = (name: string, fallback: number) =>
  z.coerce
    .number()
    .int()
    .positive()
    .default(fallback)
    .describe(name);

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

  /* ---------------------------------------------- OpenCode Zen stylist */
  /** Unset = the stylist chat answers from the built-in rules engine. */
  OPENCODE_API_KEY: z.string().default(""),
  OPENCODE_BASE_URL: z.string().default("https://opencode.ai/zen/v1"),
  /** Must be a model Zen serves on /chat/completions (DeepSeek, GLM, Kimi,
   *  MiniMax, …) — GPT and Claude models live on other endpoints. */
  OPENCODE_MODEL: z.string().default("deepseek-v4-flash"),
  OPENCODE_MAX_TOKENS: int("OPENCODE_MAX_TOKENS", 1024),
  OPENCODE_TIMEOUT_MS: int("OPENCODE_TIMEOUT_MS", 25000),

  /* -------------------------------------------------- brand / persona */
  PRODUCT_NAME: z.string().default("D'Fashion"),
  STYLIST_NAME: z.string().default("D'Style"),

  /* ------------------------------------------------ YouCam integration */
  YOUCAM_BASE_URL: z.string().default("https://yce-api-01.perfectcorp.com"),
  YOUCAM_TIMEOUT_MS: int("YOUCAM_TIMEOUT_MS", 120000),
  YOUCAM_POLL_MAX_RETRIES: int("YOUCAM_POLL_MAX_RETRIES", 30),
  YOUCAM_POLL_INTERVAL_MS: int("YOUCAM_POLL_INTERVAL_MS", 2000),
  YOUCAM_TASK_MAX_RETRIES: int("YOUCAM_TASK_MAX_RETRIES", 20),
  YOUCAM_TASK_INTERVAL_MS: int("YOUCAM_TASK_INTERVAL_MS", 2500),
  YOUCAM_TEMPLATE_PAGE_SIZE: int("YOUCAM_TEMPLATE_PAGE_SIZE", 20),

  /* --------------------------------------------------------- uploads */
  UPLOAD_MAX_BYTES: int("UPLOAD_MAX_BYTES", 10 * 1024 * 1024),
  UPLOAD_TTL_MS: int("UPLOAD_TTL_MS", 2 * 60 * 60 * 1000),

  /* ---------------------------------------------------- rate limiting */
  RATE_LIMIT_API_WINDOW_MS: int("RATE_LIMIT_API_WINDOW_MS", 60 * 1000),
  RATE_LIMIT_API_MAX: int("RATE_LIMIT_API_MAX", 100),

  RATE_LIMIT_AUTH_WINDOW_MS: int("RATE_LIMIT_AUTH_WINDOW_MS", 15 * 60 * 1000),
  RATE_LIMIT_AUTH_MAX: int("RATE_LIMIT_AUTH_MAX", 10),

  RATE_LIMIT_AI_HEAVY_WINDOW_MS: int("RATE_LIMIT_AI_HEAVY_WINDOW_MS", 60 * 60 * 1000),
  RATE_LIMIT_AI_HEAVY_MAX: int("RATE_LIMIT_AI_HEAVY_MAX", 8),

  RATE_LIMIT_AI_LIGHT_WINDOW_MS: int("RATE_LIMIT_AI_LIGHT_WINDOW_MS", 60 * 60 * 1000),
  RATE_LIMIT_AI_LIGHT_MAX: int("RATE_LIMIT_AI_LIGHT_MAX", 40),

  RATE_LIMIT_CHAT_WINDOW_MS: int("RATE_LIMIT_CHAT_WINDOW_MS", 60 * 60 * 1000),
  RATE_LIMIT_CHAT_MAX: int("RATE_LIMIT_CHAT_MAX", 60),

  RATE_LIMIT_HISTORY_WINDOW_MS: int("RATE_LIMIT_HISTORY_WINDOW_MS", 60 * 60 * 1000),
  RATE_LIMIT_HISTORY_MAX: int("RATE_LIMIT_HISTORY_MAX", 60),

  /* ------------------------------------------------- content security */
  /** Extra hosts allowed to load images via CSP, comma-separated. */
  CSP_IMG_HOSTS: z
    .string()
    .default("https://images.unsplash.com,https://images.pexels.com,https://*.youcamcdn.com,https://*.perfectcorp.com,https://lh3.googleusercontent.com"),
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