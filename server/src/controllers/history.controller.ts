import { Request, Response } from "express";
import mongoose from "mongoose";
import HistoryService from "../services/history.service";
import History from "../models/history.model";
import { asyncHandler } from "../utils/asyncHandler";

export const saveHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const { image, skinType, skinTone, concerns, recommendedProducts, report } = req.body;

  if (!report && !image && !skinType && !skinTone) {
    res.status(400).json({ success: false, message: "Report data is required" });
    return;
  }

  const season =
    (report as { colourSeason?: string } | undefined)?.colourSeason ?? undefined;

  const history = await HistoryService.saveHistory({
    userId,
    image,
    skinType,
    skinTone,
    concerns,
    recommendedProducts,
    report,
    season,
  });

  res.status(201).json({ success: true, message: "History saved successfully", history });
});

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const result = await HistoryService.getUserHistory(userId, page, limit);

  res.status(200).json({ success: true, ...result });
});

export const deleteHistory = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ success: false, message: "Not found" });
    return;
  }

  const userId = (req as any).user.id;
  const history = await History.findById(req.params.id);

  if (!history) {
    res.status(404).json({ success: false, message: "History not found" });
    return;
  }

  if (history.userId !== userId) {
    res.status(403).json({ success: false, message: "Unauthorized to delete this history" });
    return;
  }

  await HistoryService.deleteHistory(req.params.id);

  res.status(200).json({ success: true, message: "History deleted successfully" });
});
