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

  /* ------------------------------------------------------------- plans */
  /** Lifetime AI try-on allowance for an account on the free Starter plan. */
  TRY_ON_LIMIT_STARTER: int("TRY_ON_LIMIT_STARTER", 9),
  /** Allowance granted when a member's Essentials payment is approved. */
  TRY_ON_LIMIT_ESSENTIALS: int("TRY_ON_LIMIT_ESSENTIALS", 40),
  /** Comma-separated emails allowed to review payments and manage products;
   *  matched case-insensitively against the authenticated member's email. */
  ADMIN_EMAILS: z.string().default(""),

  /* ------------------------------------------------ payment alert email */
  /** Gmail account the alert is sent from (SMTP). Unset = no email is sent —
   *  the payment still lands in /admin/payments either way. */
  SMTP_USER: z.string().default(""),
  /** A Gmail *App Password* (myaccount.google.com/apppasswords), never the
   *  account's real login password — Gmail's SMTP rejects the latter for an
   *  app like this one. */
  SMTP_APP_PASSWORD: z.string().default(""),
  /** Who receives the "new payment" alert. Defaults to the first address in
   *  ADMIN_EMAILS so nothing extra has to be configured once that's set. */
  NOTIFY_EMAIL: z.string().default(""),

  /* ---------------------------------------------- gallery image storage */
  /** Unset (any of the three) = saved dashboard entries fall back to the
   *  local /gallery folder — fine for dev, but that folder lives on the
   *  container's disk and is wiped on every redeploy in production unless a
   *  persistent disk is attached. Set all three to archive to Cloudinary's
   *  free tier instead, which survives redeploys with no disk to manage. */
  CLOUDINARY_CLOUD_NAME: z.string().default(""),
  CLOUDINARY_API_KEY: z.string().default(""),
  CLOUDINARY_API_SECRET: z.string().default(""),

  /* --------------------------------------------------- OpenCode stylist */
  /** "openrouter": call OpenRouter's free tier directly — no background
   *  process, works anywhere a normal outbound HTTPS call works. Recommended.
   *  "zen": call the Zen API directly (paid models; the workspace needs billing).
   *  "server": go through a local `opencode serve`, where Zen's free models
   *  work — needs a persistent process with real memory, unsuitable for a
   *  small container (see OPENROUTER_* below for the lighter alternative). */
  OPENCODE_MODE: z.enum(["openrouter", "zen", "server"]).default("openrouter"),
  /** Zen mode. Unset = the stylist chat answers from the built-in rules engine. */
  OPENCODE_API_KEY: z.string().default(""),
  OPENCODE_BASE_URL: z.string().default("https://opencode.ai/zen/v1"),
  /** Zen mode needs a model Zen serves on /chat/completions (DeepSeek, GLM,
   *  Kimi, MiniMax, …). Server mode takes any id, e.g. `big-pickle`. */
  OPENCODE_MODEL: z.string().default("deepseek-v4-flash"),
  /** Server mode. Unset password = rules engine; the server is never called
   *  without credentials. */
  OPENCODE_SERVER_URL: z.string().default("http://127.0.0.1:4096"),
  OPENCODE_SERVER_USERNAME: z.string().default("opencode"),
  OPENCODE_SERVER_PASSWORD: z.string().default(""),
  OPENCODE_SERVER_DIRECTORY: z.string().default(""),
  OPENCODE_MAX_TOKENS: int("OPENCODE_MAX_TOKENS", 1024),
  OPENCODE_TIMEOUT_MS: int("OPENCODE_TIMEOUT_MS", 25000),
  /** Zen's free-tier bursts are throttled with 429s; retry with backoff
   *  before giving up and falling back to the rules engine. */
  OPENCODE_ZEN_MAX_RETRIES: int("OPENCODE_ZEN_MAX_RETRIES", 4),

  /** OpenRouter mode (recommended default). Unset key = the chat answers
   *  from the built-in rules engine, same as an unconfigured Zen key. */
  OPENROUTER_API_KEY: z.string().default(""),
  OPENROUTER_BASE_URL: z.string().default("https://openrouter.ai/api/v1"),
  /** A real OpenRouter model id, including any `:free` suffix — sent to the
   *  API exactly as given, unlike OPENCODE_MODEL this is never split on "/". */
  OPENROUTER_MODEL: z.string().default("inclusionai/ling-3.0-flash-vl:free"),
  OPENROUTER_MAX_TOKENS: int("OPENROUTER_MAX_TOKENS", 1024),
  OPENROUTER_TIMEOUT_MS: int("OPENROUTER_TIMEOUT_MS", 25000),
  /** Free-tier bursts are throttled with 429s; retry with backoff before
   *  giving up and falling back to the rules engine. */
  OPENROUTER_MAX_RETRIES: int("OPENROUTER_MAX_RETRIES", 4),

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

  RATE_LIMIT_PAYMENT_WINDOW_MS: int("RATE_LIMIT_PAYMENT_WINDOW_MS", 60 * 60 * 1000),
  RATE_LIMIT_PAYMENT_MAX: int("RATE_LIMIT_PAYMENT_MAX", 10),

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