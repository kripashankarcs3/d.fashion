/**
 * Central server configuration that is neither content nor environment: file
 * handling rules, image-processing defaults, storage layout, and security
 * allowances. Every consumer imports from here — never redefines.
 */
import path from "path";
import { env } from "../config/env";

/* --------------------------------------------------------------- uploads */

/** Maximum accepted upload size, in bytes (env-tunable). */
export const MAX_FILE_SIZE = env.UPLOAD_MAX_BYTES;

/**
 * Accepted upload types mapped to the extension the file is stored under.
 * The stored name is always built from this map, never from the client-supplied
 * filename: `/uploads` is served from the app's own origin, so letting a
 * caller choose the extension would let them park an `.html` (or `.js`) file
 * there and execute script against this origin.
 */
export const IMAGE_TYPE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/heic": ".heic",
  "image/heif": ".heif",
};

export const ALLOWED_IMAGE_TYPES = Object.keys(IMAGE_TYPE_EXTENSIONS);

export const API_PREFIX = "/api";

/** Scratch pad for inbound uploads and transient processing files. */
export const TMP_DIR = path.resolve(__dirname, "../../tmp");

/** Durable store for dashboard gallery images — never swept. */
export const GALLERY_DIR = path.resolve(__dirname, "../../gallery");

/** Durable store for payment (UPI) screenshots — never swept, and unlike
 *  GALLERY_DIR never statically mounted: a screenshot is only readable through
 *  the authenticated `/api/payments/:id/screenshot` route (owner or admin). */
export const PAYMENT_PROOF_DIR = path.resolve(__dirname, "../../payment-proofs");

/** Maximum bytes archived into the gallery from a remote URL. */
export const GALLERY_MAX_BYTES = 12 * 1024 * 1024;

/** How long transient uploads live before cleanup sweeps them. */
export const UPLOAD_TTL_MS = env.UPLOAD_TTL_MS;

/** Static asset roots holding bundled garment images (built client + source). */
export const STATIC_ASSET_DIRS = [
  path.resolve(__dirname, "../../../dist"),
  path.resolve(__dirname, "../../../public"),
];

/* --------------------------------------------------------- image pipeline */

/** Where the local skin-tone sampler looks on a portrait (fractions of W×H). */
export const SKIN_SAMPLE = {
  leftX: 0.3,
  topY: 0.2,
  width: 0.4,
  height: 0.35,
} as const;

/** Skin-pixel heuristic bounds (raw RGB + luminance windows). */
export const SKIN_PIXEL = {
  min: { r: 60, g: 40, b: 20 },
  max: { r: 255, g: 230, b: 210 },
  minWarmBias: 10,
  minLuma: 50,
  maxLuma: 230,
  minSamples: 20,
} as const;

/** Neutral warm fallback when local skin-tone extraction fails. */
export const SKIN_FALLBACK = { hex: "#D2A679", luma: 160 } as const;

export const OPTIMIZE = { width: 1024, height: 1024, quality: 85 } as const;

export const REMOTE_IMAGE_QUALITY = 92;

export const GALLERY_IMAGE = { width: 1280, height: 1280, quality: 88 } as const;

export const SAMPLE_SIZE = 60;

/* -------------------------------------------------------------- security */

/** CIDR prefixes that must never be fetched or proxied to. */
export const PRIVATE_IPS =
  /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|0\.|169\.254\.|::1|fc00:|fe80:)/;