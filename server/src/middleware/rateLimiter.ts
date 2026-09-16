import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { env } from "../config/env";

// ipKeyGenerator takes the IP string (it normalises IPv6 to a subnet), not the
// request object.
const perUser = (req: any) => req.user?.id ?? ipKeyGenerator(req.ip ?? "");

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_API_WINDOW_MS,
  max: env.RATE_LIMIT_API_MAX,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_AUTH_WINDOW_MS,
  max: env.RATE_LIMIT_AUTH_MAX,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

/** Cost-aware ceiling for paid AI jobs (analysis = multiple YouCam units). */
export const aiHeavyLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_AI_HEAVY_WINDOW_MS,
  max: env.RATE_LIMIT_AI_HEAVY_MAX,
  keyGenerator: perUser,
  message: {
    success: false,
    message: "Analysis limit reached. Try again in an hour.",
  },
});

/** Cost-aware ceiling for try-on endpoints (one YouCam unit each). */
export const aiLightLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_AI_LIGHT_WINDOW_MS,
  max: env.RATE_LIMIT_AI_LIGHT_MAX,
  keyGenerator: perUser,
  message: {
    success: false,
    message: "Try-on limit reached. Try again in an hour.",
  },
});

/** Per-user ceiling for saving history. Each save may download a remote image
 *  into the gallery folder, which is never swept — unbounded, that is a disk
 *  exhaustion vector. */
export const historyWriteLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_HISTORY_WINDOW_MS,
  max: env.RATE_LIMIT_HISTORY_MAX,
  keyGenerator: perUser,
  message: {
    success: false,
    message: "Save limit reached. Please try again later.",
  },
});

/** Per-user ceiling for the stylist chat (CPU cost, unbounded input). */
export const chatLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_CHAT_WINDOW_MS,
  max: env.RATE_LIMIT_CHAT_MAX,
  keyGenerator: perUser,
  message: {
    success: false,
    message: "Message limit reached. Please try again later.",
  },
});

/** Per-user ceiling for submitting payment proof (each save writes a file to
 *  the never-swept payment-proofs folder). */
export const paymentLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_PAYMENT_WINDOW_MS,
  max: env.RATE_LIMIT_PAYMENT_MAX,
  keyGenerator: perUser,
  message: {
    success: false,
    message: "Too many payment submissions. Please try again later.",
  },
});