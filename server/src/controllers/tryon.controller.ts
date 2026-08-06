import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { URL } from "url";
import YouCamService from "../services/youcam.service";

const PRIVATE_IPS = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|0\.|169\.254\.|::1|fc00:|fe80:)/;

const UPLOADS_DIR = path.resolve(__dirname, "../../tmp");

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
  try {
    const url = new URL(urlString);
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

export const listTemplates = async (req: Request, res: Response, next: NextFunction) => {
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

    try {
      const selfieFilePath = serverUploadFilePath(req.body.personImageUrl);
      const youcamResult = selfieFilePath
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
    // apply a CSS colour-tint overlay as a visual preview.
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
    const productId = req.body.productId;

    if (!personImageUrl) {
      return res.status(400).json({ success: false, message: "personImageUrl is required" });
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

    // Fallback: return the person image unchanged
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
    const styleId = req.body.styleId;

    if (!personImageUrl || !styleId) {
      return res.status(400).json({
        success: false,
        message: "personImageUrl and styleId are required",
      });
    }

    try {
      const selfieFilePath = serverUploadFilePath(req.body.personImageUrl);
      const youcamResult = selfieFilePath
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

    // Fallback: return the person image unchanged
    return res.status(200).json({
      success: true,
      resultUrl: personImageUrl,
      source: "fallback",
    });
  } catch (err) {
    next(err);
  }
};
