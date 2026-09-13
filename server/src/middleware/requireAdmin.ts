import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";

export const requireAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = (req as any).user?.id;
    // A Firebase session carries a Firebase UID, not a Mongo ObjectId — such a
    // user has no admin record, so refuse with 403 instead of letting
    // findById throw a CastError that surfaces as a misleading 400.
    const user = mongoose.isValidObjectId(id) ? await User.findById(id) : null;

    if (!user || user.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin access required" });
      return;
    }

    next();
  }
);
