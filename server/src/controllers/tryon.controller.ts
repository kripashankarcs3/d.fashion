import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { URL } from "url";
import YouCamService from "../services/youcam.service";
import { reserveTryOnSlot, refundTryOnSlot, getTryOnUsage, listAllUsage } from "../services/tryon.quota.service";
import type { TryOnPlan } from "../models/tryon.usage.model";
import { PRIVATE_IPS, STATIC_ASSET_DIRS, TMP_DIR as UPLOADS_DIR } from "../constants";

// Resolves a bundled asset path such as `/images/garments/foo.png` to a file on
// disk, or null when it escapes the asset roots or does not exist.
const staticAssetFilePath = (urlString: string): string | null => {
  if (!urlString.startsWith("/images/")) return null;
  const segments = urlString.split("/").filter((segment) => segment && segment !== ".");
  if (segments.some((segment) => segment === ".." || segment.includes("\\"))) return null;
  for (const dir of STATIC_ASSET_DIRS) {
    const candidate = path.join(dir, ...segments);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
};

const isServerUpload = (urlString: string): boolean => {
  return urlString.startsWith("/uploads/");
};

const serverUploadFilePath = (urlString: string): string | null => {
  if (!isServerUpload(urlString)) return null;
  const filePath = path.join(UPLOADS_DIR, path.basename(urlString));
  // Only return path if file actually exists on disk
  return fs.existsSync(filePath) ? filePath : null;
};

const resolvePersonUrl = (req: Request, urlString: string): string => {
  if (!isServerUpload(urlString)) return urlString;
  const forwarded = req.get("x-forwarded-proto");
  const protocol = forwarded ? forwarded.split(",")[0].trim() : req.protocol;
  const host = req.get("host") || "localhost";
  return `${protocol}://${host}${urlString}`;
};

const isValidImageUrl = (urlString: string): boolean => {
  if (!urlString || typeof urlString !== "string") return false;
  // Bundled assets and server uploads are same-origin paths we control, so they
  // never reach the URL parser below.
  if (urlString.startsWith("/images/") || urlString.startsWith("/uploads/")) {
    return true;
  }
  try {
    const url = new URL(urlString);
    // Only real http(s) origins. `data:`/`blob:`/`file:` are rejected: the URL
    // is handed to YouCam as `src_file_url`, and anything else is either
    // unfetchable or a way to point the fetch somewhere it should not go.
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const hostname = url.hostname.toLowerCase();
    if (hostname === "localhost" || hostname.endsWith(".local")) return false;
    if (PRIVATE_IPS.test(hostname)) return false;
    return true;
  } catch {
    return false;
  }
};

const resolveAndValidatePersonUrl = (req: Request, urlString: string): string | null => {
  if (!urlString) return null;
  if (isServerUpload(urlString)) return resolvePersonUrl(req, urlString);
  return isValidImageUrl(urlString) ? urlString : null;
};

const extractResultUrl = (youcamResult: any, fallbackUrl: string): string => {
  return (
    youcamResult?.data?.result?.url ||
    youcamResult?.data?.results?.[0]?.url ||
    youcamResult?.data?.results?.url ||
    fallbackUrl
  );
};

export const listTemplates = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const feature = String(req.params.feature);
    const result = await YouCamService.listTemplates(feature);
    const raw = result?.data?.styles ?? result?.data?.templates ?? [];
    const items = raw.map((template: any) => ({
      id: template.id ?? template.template_id,
      title: template.title ?? template.name ?? template.id,
      thumb: template.thumb ?? template.thumbnail ?? "",
    }));
    return res.status(200).json({ success: true, feature, items });
  } catch (err) {
    console.warn(`YouCam template listing failed (${req.params.feature}):`, (err as Error).message);
    return res.status(200).json({ success: true, feature: req.params.feature, items: [] });
  }
};

/** How many of the lifetime AI try-on quota this account has used. */
export const getUsage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usage = await getTryOnUsage(req);
    return res.status(200).json({ success: true, ...usage });
  } catch (err) {
    next(err);
  }
};

const PLAN_VALUES = ["starter", "essentials", "atelier"];

/** Admin: every account's try-on usage — who's using how much, on which plan. */
export const listUsage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const planParam = req.query.plan;
    const plan = typeof planParam === "string" && PLAN_VALUES.includes(planParam) ? (planParam as TryOnPlan) : undefined;
    const result = await listAllUsage({
      q: typeof req.query.q === "string" ? req.query.q : undefined,
      plan,
      page: Number(req.query.page) || undefined,
      pageSize: Number(req.query.pageSize) || undefined,
    });
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const tryOnClothes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const personImageUrl = resolveAndValidatePersonUrl(req, req.body.personImageUrl);
    const garmentImageUrl = req.body.garmentImageUrl;
    const colourHex = req.body.colourHex ?? null;

    if (!personImageUrl || !garmentImageUrl) {
      return res.status(400).json({
        success: false,
        message: "personImageUrl and garmentImageUrl are required",
      });
    }

    if (!isValidImageUrl(garmentImageUrl)) {
      return res.status(400).json({ success: false, message: "Invalid image URL" });
    }

    // Paid AI calls are rationed per email so the YouCam bill stays
    // predictable. The reservation is provisional: if this call ends up
    // falling back instead of producing a real image, it's refunded below —
    // a click that renders a stand-in should never cost part of the quota.
    let reserved = false;
    if (YouCamService.isAvailable()) {
      const remaining = await reserveTryOnSlot(req);
      if (remaining === null) {
        return res.status(429).json({
          success: false,
          message: "Maximum try-on limit reached. You have used all your free AI try-ons for this account.",
          remaining: 0,
        });
      }
      reserved = true;
    }

    try {
      const selfieFilePath = serverUploadFilePath(req.body.personImageUrl);
      const garmentFilePath = staticAssetFilePath(garmentImageUrl);

      const youcamResult = garmentFilePath
        ? await YouCamService.tryOnClothesWithGarmentFile(
            { filePath: selfieFilePath, url: personImageUrl },
            garmentFilePath
          )
        : selfieFilePath
          ? await YouCamService.tryOnClothesWithFile(selfieFilePath, garmentImageUrl)
          : await YouCamService.tryOnClothes(personImageUrl, garmentImageUrl);

      if (youcamResult) {
        const resultUrl = extractResultUrl(youcamResult, "");
        if (resultUrl) {
          return res.status(200).json({ success: true, resultUrl, source: "youcam" });
        }
      }
    } catch (err) {
      const detail = (err as any)?.response?.data
        ? JSON.stringify((err as any).response.data)
        : (err as Error).message;
      console.warn("YouCam clothes try-on failed:", detail);
    }

    // Fallback: return garment image with colour hint so the client can
    // apply a CSS colour-tint overlay as a visual preview. No real image was
    // produced, so give back the slot reserved above.
    if (reserved) await refundTryOnSlot(req);
    return res.status(200).json({
      success: true,
      resultUrl: garmentImageUrl,
      source: "fallback",
      colourHex,
    });
  } catch (err) {
    next(err);
  }
};

export const tryOnMakeup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const personImageUrl = resolveAndValidatePersonUrl(req, req.body.personImageUrl);
    const productId = req.body.productId as string | undefined;

    if (!personImageUrl) {
      return res.status(400).json({ success: false, message: "personImageUrl is required" });
    }

    let reserved = false;
    if (productId) {
      // Paid AI calls are rationed per email so the YouCam bill stays
      // predictable. Refunded below if this ends up falling back.
      if (YouCamService.isAvailable()) {
        const remaining = await reserveTryOnSlot(req);
        if (remaining === null) {
          return res.status(429).json({
            success: false,
            message: "Maximum try-on limit reached. You have used all your free AI try-ons for this account.",
            remaining: 0,
          });
        }
        reserved = true;
      }

      try {
        const selfieFilePath = serverUploadFilePath(req.body.personImageUrl);
        const youcamResult = selfieFilePath
          ? await YouCamService.tryOnMakeupWithFile(selfieFilePath, productId)
          : await YouCamService.tryOnMakeup(personImageUrl, productId);

        if (youcamResult) {
          const resultUrl = extractResultUrl(youcamResult, "");
          if (resultUrl) {
            return res.status(200).json({ success: true, resultUrl, source: "youcam" });
          }
        }
      } catch (err) {
        const detail = (err as any)?.response?.data
          ? JSON.stringify((err as any).response.data)
          : (err as Error).message;
        console.warn("YouCam makeup try-on failed:", detail);
      }
    }

    // Fallback: return the person image unchanged. No real image was
    // produced, so give back the slot reserved above.
    if (reserved) await refundTryOnSlot(req);
    return res.status(200).json({
      success: true,
      resultUrl: personImageUrl,
      source: "fallback",
    });
  } catch (err) {
    next(err);
  }
};

export const tryOnHair = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const personImageUrl = resolveAndValidatePersonUrl(req, req.body.personImageUrl);
    const styleId = req.body.styleId as unknown;
    // Which YouCam catalogue the style belongs to: the original hair-style set,
    // or the larger hair-transfer set.
    const engine = req.body.engine === "transfer" ? "transfer" : "style";
    const keepUsersColour = req.body.keepUsersColour === true;

    if (!personImageUrl || typeof styleId !== "string" || !styleId) {
      return res.status(400).json({
        success: false,
        message: "personImageUrl and styleId are required",
      });
    }

    // Paid AI calls are rationed per email so the YouCam bill stays
    // predictable. Refunded below if this ends up falling back.
    let reserved = false;
    if (YouCamService.isAvailable()) {
      const remaining = await reserveTryOnSlot(req);
      if (remaining === null) {
        return res.status(429).json({
          success: false,
          message: "Maximum try-on limit reached. You have used all your free AI try-ons for this account.",
          remaining: 0,
        });
      }
      reserved = true;
    }

    try {
      const selfieFilePath = serverUploadFilePath(req.body.personImageUrl);
      const youcamResult =
        engine === "transfer"
          ? await YouCamService.tryOnHairTransfer(
              { filePath: selfieFilePath, url: personImageUrl },
              styleId,
              keepUsersColour
            )
          : selfieFilePath
            ? await YouCamService.tryOnHairWithFile(selfieFilePath, styleId)
            : await YouCamService.tryOnHair(personImageUrl, styleId);

      if (youcamResult) {
        const resultUrl = extractResultUrl(youcamResult, "");
        if (resultUrl) {
          return res.status(200).json({ success: true, resultUrl, source: "youcam" });
        }
      }
    } catch (err) {
      const detail = (err as any)?.response?.data
        ? JSON.stringify((err as any).response.data)
        : (err as Error).message;
      console.warn("YouCam hair try-on failed:", detail);
    }

    // Fallback: return the person image unchanged. No real image was
    // produced, so give back the slot reserved above.
    if (reserved) await refundTryOnSlot(req);
    return res.status(200).json({
      success: true,
      resultUrl: personImageUrl,
      source: "fallback",
    });
  } catch (err) {
    next(err);
  }
};
