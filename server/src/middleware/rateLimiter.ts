import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const perUser = (req: any) => req.user?.id ?? ipKeyGenerator(req);

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

/** Cost-aware ceiling for paid AI jobs (analysis = multiple YouCam units). */
export const aiHeavyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  keyGenerator: perUser,
  message: {
    success: false,
    message: "Analysis limit reached. Try again in an hour.",
  },
});

/** Cost-aware ceiling for try-on endpoints (one YouCam unit each). */
export const aiLightLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 40,
  keyGenerator: perUser,
  message: {
    success: false,
    message: "Try-on limit reached. Try again in an hour.",
  },
});

/** Per-user ceiling for the stylist chat (CPU cost, unbounded input). */
export const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  keyGenerator: perUser,
  message: {
    success: false,
    message: "Message limit reached. Please try again later.",
  },
});