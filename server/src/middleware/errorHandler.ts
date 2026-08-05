import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { env } from "../config/env";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isProd = env.NODE_ENV === "production";

  if (err instanceof MulterError) {
    const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image is larger than 10 MB. Please upload a smaller photo."
        : "That file could not be accepted. Use a JPEG, PNG, WebP or HEIC image.";
    res.status(status).json({ success: false, message });
    return;
  }

  if (err?.name === "CastError") {
    res.status(400).json({ success: false, message: "Invalid id" });
    return;
  }
  if (err?.name === "ValidationError") {
    res.status(400).json({ success: false, message: err.message });
    return;
  }
  if (err?.code === 11000) {
    res.status(409).json({ success: false, message: "Already exists" });
    return;
  }

  const status = Number(err?.status ?? err?.statusCode) || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    success: false,
    message:
      status >= 500 && isProd ? "Internal Server Error" : (err?.message ?? "Request failed"),
  });
};
