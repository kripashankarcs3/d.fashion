import { Request, Response } from "express";
import HistoryService from "../services/history.service";
import History from "../models/history.model";
import { asyncHandler } from "../utils/asyncHandler";

export const saveHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const { image, skinType, skinTone, concerns, recommendedProducts } = req.body;

  const history = await HistoryService.saveHistory({
    userId,
    image,
    skinType,
    skinTone,
    concerns,
    recommendedProducts,
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
  const userId = (req as any).user.id;
  const history = await History.findById(req.params.id);

  if (!history) {
    res.status(404).json({ success: false, message: "History not found" });
    return;
  }

  if (history.userId.toString() !== userId) {
    res.status(403).json({ success: false, message: "Unauthorized to delete this history" });
    return;
  }

  await HistoryService.deleteHistory(req.params.id);

  res.status(200).json({ success: true, message: "History deleted successfully" });
});
