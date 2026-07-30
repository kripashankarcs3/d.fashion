import { Request, Response } from "express";
import FavoriteService from "../services/favorite.service";

export const addFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Logged-in user id from JWT
    const userId = (req as any).user.id;

    const { productId } = req.body;

    const favorite = await FavoriteService.addFavorite({
      userId,
      productId,
    });

    res.status(201).json({
      success: true,
      message: "Favorite added successfully",
      favorite,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add favorite",
    });
  }
};

export const getFavorites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Logged-in user id from JWT
    const userId = (req as any).user.id;

    const favorites = await FavoriteService.getFavorites(userId);

    res.status(200).json({
      success: true,
      favorites,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
    });
  }
};

export const deleteFavorite = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const favorite = await FavoriteService.deleteFavorite(
      req.params.id
    );

    if (!favorite) {
      res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Favorite deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete favorite",
    });
  }
};