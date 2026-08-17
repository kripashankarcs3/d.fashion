import { Request, Response } from "express";
import mongoose from "mongoose";
import { URL } from "url";
import HistoryService from "../services/history.service";
import History from "../models/history.model";
import { ImageService } from "../services/image.service";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * True for images this server is willing to fetch and archive: its own
 * `/uploads` files, or an http(s) URL. Whether that URL is safe to request is
 * decided at fetch time by `fetchPublicImage`, which resolves the host and
 * re-checks every redirect hop — a hostname string cannot answer that.
 */
const isArchivableImage = (value: unknown): value is string => {
  if (typeof value !== "string" || !value) return false;
  if (value.startsWith("/uploads/")) return !value.includes("..");
  // A client must never name a file in the shared gallery folder: deleting the
  // entry later would delete that file, which may belong to someone else.
  if (value.startsWith("/gallery/")) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

/**
 * Copies an image into the durable gallery folder. Archiving is best-effort:
 * a provider URL that has already expired must not cost the user the entry,
 * so the original value is kept as a (possibly short-lived) fallback.
 */
const archiveImage = async (source: unknown, prefix: string): Promise<string | undefined> => {
  if (!isArchivableImage(source)) return undefined;
  try {
    return await ImageService.saveGalleryImage(source, prefix);
  } catch (err) {
    console.warn(`Gallery archive failed (${prefix}):`, (err as Error).message);
    return source.startsWith("http") ? source : undefined;
  }
};

export const saveHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const {
    type,
    image,
    resultImage,
    label,
    tryonKind,
    colourHex,
    source,
    skinType,
    skinTone,
    concerns,
    recommendedProducts,
    report,
  } = req.body;

  const entryType = type === "tryon" ? "tryon" : "analysis";

  if (entryType === "tryon") {
    if (!resultImage) {
      res.status(400).json({ success: false, message: "resultImage is required" });
      return;
    }
  } else if (!report && !image && !skinType && !skinTone) {
    res.status(400).json({ success: false, message: "Report data is required" });
    return;
  }

  const season =
    (report as { colourSeason?: string } | undefined)?.colourSeason ?? undefined;

  // The same analysis reaches this endpoint twice — once automatically when it
  // finishes, once if the member also saves the report — so an entry for that
  // exact analysis is returned as-is instead of duplicated in the gallery.
  const rawAnalyzedAt = (report as { analyzedAt?: unknown } | undefined)?.analyzedAt;
  // Anything but a string here would be interpreted by Mongo as a query
  // operator (`{"$ne": null}`) rather than a value.
  const analyzedAt = typeof rawAnalyzedAt === "string" ? rawAnalyzedAt : undefined;
  if (entryType === "analysis" && analyzedAt) {
    const existing = await History.findOne({
      userId,
      "report.analyzedAt": analyzedAt,
    });
    if (existing) {
      res.status(200).json({ success: true, message: "Already saved", history: existing });
      return;
    }
  }

  // Keep a durable copy of whatever the dashboard will render.
  const archivedResult = await archiveImage(resultImage, entryType);
  const archivedSource =
    entryType === "analysis"
      ? await archiveImage(image, "analysis-src")
      : undefined;

  const history = await HistoryService.saveHistory({
    userId,
    type: entryType,
    image:
      archivedSource ??
      (typeof image === "string" && !image.startsWith("/gallery/") ? image : undefined),
    resultImage: archivedResult,
    label: typeof label === "string" ? label.slice(0, 120) : undefined,
    tryonKind: ["clothes", "makeup", "hair"].includes(tryonKind) ? tryonKind : undefined,
    colourHex: typeof colourHex === "string" ? colourHex.slice(0, 9) : undefined,
    source: typeof source === "string" ? source.slice(0, 32) : undefined,
    skinType,
    skinTone,
    concerns,
    recommendedProducts,
    report,
    season,
  });

  res.status(201).json({ success: true, message: "History saved successfully", history });
});

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const typeParam = req.query.type as string | undefined;
  const type =
    typeParam === "tryon" || typeParam === "analysis" ? typeParam : undefined;
  const result = await HistoryService.getUserHistory(userId, page, limit, type);

  res.status(200).json({ success: true, ...result });
});

export const deleteHistory = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ success: false, message: "Not found" });
    return;
  }

  const userId = (req as any).user.id;
  const history = await History.findById(req.params.id);

  if (!history) {
    res.status(404).json({ success: false, message: "History not found" });
    return;
  }

  if (history.userId !== userId) {
    res.status(403).json({ success: false, message: "Unauthorized to delete this history" });
    return;
  }

  await HistoryService.deleteHistory(req.params.id);
  // Drop the archived pictures too — nothing else references them.
  await ImageService.deleteGalleryImage(history.resultImage);
  await ImageService.deleteGalleryImage(history.image);

  res.status(200).json({ success: true, message: "History deleted successfully" });
});
