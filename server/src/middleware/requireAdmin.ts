import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import { env } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";

const adminEmailSet = new Set(
  env.ADMIN_EMAILS.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

/** True when the email belongs to the configured admin allowlist. This is the
 *  primary admin check: real accounts sign in through Firebase, whose UID is
 *  never a Mongo ObjectId, so they never have a `User` document to carry a
 *  `role` on — email is the only identity a Firebase ID token reliably
 *  carries (`decoded.email`). */
export const isAdminEmail = (email?: string | null): boolean =>
  Boolean(email) && adminEmailSet.has(String(email).trim().toLowerCase());

export const requireAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { id?: string; email?: string } | undefined;

    if (isAdminEmail(user?.email)) {
      next();
      return;
    }

    // Fallback for the legacy local-register/JWT flow, where a `User`
    // document with a real ObjectId and a `role` field does exist.
    const id = user?.id;
    const doc = mongoose.isValidObjectId(id) ? await User.findById(id) : null;

    if (!doc || doc.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin access required" });
      return;
    }

    next();
  }
);
