import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  const isProduction = env.NODE_ENV === "production";

  res.status(500).json({
    success: false,
    message: isProduction ? "Internal Server Error" : err.message,
  });
};