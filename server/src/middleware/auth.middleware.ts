import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  id: string;
  email?: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      env.JWT_SECRET
    ) as JwtPayload;

    (req as any).user = decoded;

    next();
  } catch (error) {
    console.error("JWT Error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};