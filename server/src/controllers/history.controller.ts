import { Request, Response } from "express";
import HistoryService from "../services/history.service";

export const saveHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Logged-in user id from JWT
    const userId = (req as any).user.id;

    const {
      image,
      skinType,
      skinTone,
      concerns,
      recommendedProducts,
    } = req.body;

    const history = await HistoryService.saveHistory({
      userId,
      image,
      skinType,
      skinTone,
      concerns,
      recommendedProducts,
    });

    res.status(201).json({
      success: true,
      message: "History saved successfully",
      history,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save history",
    });
  }
};

export const getHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Logged-in user id from JWT
    const userId = (req as any).user.id;

    const history = await HistoryService.getUserHistory(userId);

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
};

export const deleteHistory = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const history = await HistoryService.deleteHistory(
      req.params.id
    );

    if (!history) {
      res.status(404).json({
        success: false,
        message: "History not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "History deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete history",
    });
  }
};