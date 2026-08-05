import { Request, Response } from "express";
import mongoose from "mongoose";
import FavoriteService from "../services/favorite.service";
import Favorite from "../models/favorite.model";
import { asyncHandler } from "../utils/asyncHandler";

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { productId } = req.body;

  const existing = await Favorite.findOne({ userId, productId });
  if (existing) {
    res.status(409).json({ success: false, message: "Product already in favorites" });
    return;
  }

  const favorite = await FavoriteService.addFavorite({ userId, productId });

  res.status(201).json({ success: true, message: "Favorite added successfully", favorite });
});

export const getFavorites = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const favorites = await FavoriteService.getFavorites(userId);

  res.status(200).json({ success: true, favorites });
});

export const deleteFavorite = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ success: false, message: "Not found" });
    return;
  }

  const userId = (req as any).user.id;
  const favorite = await Favorite.findById(req.params.id);

  if (!favorite) {
    res.status(404).json({ success: false, message: "Favorite not found" });
    return;
  }

  if (favorite.userId !== userId) {
    res.status(403).json({ success: false, message: "Unauthorized to delete this favorite" });
    return;
  }

  await FavoriteService.deleteFavorite(req.params.id);

  res.status(200).json({ success: true, message: "Favorite deleted successfully" });
});
