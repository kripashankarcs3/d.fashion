import { Router } from "express";
import { getAllSeasonsDTO, getSeasonInfoDTO, RUNNER_UP_SEASONS } from "../data/seasons";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/response";

const router = Router();

/** All 12 seasons — palette, neutrals, avoid, archetypes. */
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const seasons = getAllSeasonsDTO();
    return sendSuccess(res, "Season catalogue", {
      count: seasons.length,
      seasons,
      runnerUps: RUNNER_UP_SEASONS,
    });
  }),
);

/** One season by name. */
router.get(
  "/:season",
  asyncHandler(async (req, res) => {
    const { season } = req.params;
    const info = getSeasonInfoDTO(season);
    if (!info) {
      return sendError(res, `Unknown season: ${season}`, 404);
    }
    return sendSuccess(res, `Season: ${season}`, {
      ...info,
      runnerUp: RUNNER_UP_SEASONS[season] ?? null,
    });
  }),
);

export default router;
