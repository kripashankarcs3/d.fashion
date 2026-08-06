import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const TMP_DIR = path.resolve(__dirname, "../../tmp");

/** Convert linear sRGB channel (0-255) to perceptually weighted luminance. */
function toLuma(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Extracts the dominant skin tone from a portrait photo using Sharp.
 * Samples the central face region (middle 40% width × middle 30% height),
 * filters to skin-like pixels, and returns the median RGB as a hex colour.
 *
 * Falls back to a neutral warm tone if analysis fails.
 */
export async function extractSkinToneLocally(
  imagePath: string
): Promise<{ skinToneHex: string; luma: number }> {
  try {
    const img = sharp(imagePath);
    const meta = await img.metadata();
    const w = meta.width ?? 400;
    const h = meta.height ?? 400;

    // Sample the central face area
    const left = Math.round(w * 0.3);
    const top = Math.round(h * 0.2);
    const width = Math.round(w * 0.4);
    const height = Math.round(h * 0.35);

    const { data } = await img
      .extract({ left, top, width, height })
      .resize(60, 60, { fit: "fill" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const rs: number[] = [];
    const gs: number[] = [];
    const bs: number[] = [];

    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Skin pixel heuristic: reddish, not too dark, not too bright
      if (
        r > 60 && r < 255 &&
        g > 40 && g < 230 &&
        b > 20 && b < 210 &&
        r > g && r > b &&       // red dominance
        r - b > 10 &&           // warm bias
        toLuma(r, g, b) > 50 && toLuma(r, g, b) < 230
      ) {
        rs.push(r);
        gs.push(g);
        bs.push(b);
      }
    }

    if (rs.length < 20) {
      // Not enough skin pixels — likely unusual lighting; use average of all
      let sumR = 0, sumG = 0, sumB = 0;
      for (let i = 0; i < data.length; i += 3) {
        sumR += data[i]; sumG += data[i + 1]; sumB += data[i + 2];
      }
      const n = data.length / 3;
      const avgR = sumR / n, avgG = sumG / n, avgB = sumB / n;
      const luma = toLuma(avgR, avgG, avgB);
      return { skinToneHex: rgbToHex(avgR, avgG, avgB), luma };
    }

    // Median of collected skin pixels
    rs.sort((a, b) => a - b);
    gs.sort((a, b) => a - b);
    bs.sort((a, b) => a - b);
    const mid = Math.floor(rs.length / 2);
    const r = rs[mid], g = gs[mid], b = bs[mid];
    const luma = toLuma(r, g, b);
    return { skinToneHex: rgbToHex(r, g, b), luma };
  } catch {
    return { skinToneHex: "#D2A679", luma: 160 };
  }
}

export class ImageService {
  static processImage(file: Express.Multer.File) {
    return {
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
    };
  }

  static async optimizeImage(filePath: string) {
    const outputPath = path.join(
      path.dirname(filePath),
      `optimized-${Date.now()}.jpg`
    );

    await sharp(filePath)
      .resize({
        width: 1024,
        height: 1024,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 85,
      })
      .toFile(outputPath);

    return outputPath;
  }

  static async deleteImage(filePath: string) {
    try {
      await fs.promises.unlink(filePath);
    } catch {
      // File already gone or not deletable — nothing to do.
    }
  }

  static async saveRemoteImage(url: string, prefix: string) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to download remote image: HTTP ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());

    const outputPath = path.join(TMP_DIR, `${prefix}-${crypto.randomUUID()}.jpg`);
    await sharp(buf).jpeg({ quality: 92 }).toFile(outputPath);
    return outputPath;
  }

  static async cleanupStaleUploads(maxAgeMs: number) {
    let files: string[];
    try {
      files = await fs.promises.readdir(TMP_DIR);
    } catch {
      return 0;
    }

    const now = Date.now();
    const stale = files.filter((f) => /^(optimized|enhanced)-.+\.(jpg|jpeg|png)$/i.test(f));

    let removed = 0;
    for (const f of stale) {
      try {
        const filePath = path.join(TMP_DIR, f);
        const stat = await fs.promises.stat(filePath);
        if (now - stat.mtimeMs > maxAgeMs) {
          await fs.promises.unlink(filePath);
          removed += 1;
        }
      } catch {
        // Skip files that can't be inspected or removed.
      }
    }
    return removed;
  }
}