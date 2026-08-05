import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";

export const requireAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById((req as any).user?.id);

    if (!user || user.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin access required" });
      return;
    }

    next();
  }
);
