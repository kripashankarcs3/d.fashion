import { Router } from "express";
import { z } from "zod";
import { getGarments } from "../services/garment.service";
import { matchGarmentsToSeason } from "../services/garment.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/response";

const router = Router();

/** Public catalogue with optional filters. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const querySchema = z.object({
      gender: z.enum(["Women", "Men"]).optional(),
      category: z.string().trim().min(1).max(30).optional(),
    });
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return sendError(res, "Invalid garment query", 400);
    }

    const { gender, category } = parsed.data;
    let garments = getGarments();
    if (gender) garments = garments.filter((g) => g.gender === gender);
    if (category) garments = garments.filter((g) => g.category === category);

    return sendSuccess(res, "Garment catalogue", {
      count: garments.length,
      garments,
    });
  }),
);

/** Colour-matched recommendations for a user's season. */
router.get(
  "/recommend",
  asyncHandler(async (req, res) => {
    const querySchema = z.object({
      season: z.string().trim().min(1).max(40),
      undertone: z.enum(["warm", "cool", "neutral"]),
      gender: z.enum(["Women", "Men"]).optional(),
      category: z.string().trim().min(1).max(30).optional(),
      limit: z.coerce.number().int().min(1).max(24).optional(),
    });
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return sendError(res, "Invalid garment recommendation query", 400);
    }

    const { season, undertone, gender, category, limit } = parsed.data;
    const matches = matchGarmentsToSeason(season, undertone, { gender, category, limit });

    return sendSuccess(res, "Colour-matched garments", {
      count: matches.length,
      garments: matches,
    });
  }),
);

export default router;
