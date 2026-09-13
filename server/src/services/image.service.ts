import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import { fetchPublicImage } from "../utils/safeImageFetch";
import {
  GALLERY_DIR,
  GALLERY_IMAGE,
  GALLERY_MAX_BYTES,
  OPTIMIZE,
  REMOTE_IMAGE_QUALITY,
  SAMPLE_SIZE,
  SKIN_FALLBACK,
  SKIN_PIXEL,
  SKIN_SAMPLE,
  TMP_DIR,
} from "../constants";

fs.mkdirSync(GALLERY_DIR, { recursive: true });

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
    const left = Math.round(w * SKIN_SAMPLE.leftX);
    const top = Math.round(h * SKIN_SAMPLE.topY);
    const width = Math.round(w * SKIN_SAMPLE.width);
    const height = Math.round(h * SKIN_SAMPLE.height);

    const { data } = await img
      .extract({ left, top, width, height })
      .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: "fill" })
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
        r > SKIN_PIXEL.min.r && r < SKIN_PIXEL.max.r &&
        g > SKIN_PIXEL.min.g && g < SKIN_PIXEL.max.g &&
        b > SKIN_PIXEL.min.b && b < SKIN_PIXEL.max.b &&
        r > g && r > b &&       // red dominance
        r - b > SKIN_PIXEL.minWarmBias &&           // warm bias
        toLuma(r, g, b) > SKIN_PIXEL.minLuma && toLuma(r, g, b) < SKIN_PIXEL.maxLuma
      ) {
        rs.push(r);
        gs.push(g);
        bs.push(b);
      }
    }

    if (rs.length < SKIN_PIXEL.minSamples) {
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
    return { skinToneHex: SKIN_FALLBACK.hex, luma: SKIN_FALLBACK.luma };
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
        width: OPTIMIZE.width,
        height: OPTIMIZE.height,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: OPTIMIZE.quality,
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
    await sharp(buf).jpeg({ quality: REMOTE_IMAGE_QUALITY }).toFile(outputPath);
    return outputPath;
  }

  /**
   * Copies an image into the durable gallery folder and returns its public
   * `/gallery/...` path. Unlike `/uploads`, this folder is never swept by
   * `cleanupStaleUploads`, so a saved dashboard entry keeps its picture.
   *
   * `source` is either a public http(s) URL (a try-on provider result) or an
   * app-relative `/uploads/<file>` path this server wrote itself.
   */
  static async saveGalleryImage(source: string, prefix: string): Promise<string> {
    let buf: Buffer;

    if (source.startsWith("/uploads/")) {
      const filePath = path.join(TMP_DIR, path.basename(source));
      buf = await fs.promises.readFile(filePath);
    } else {
      // Validates the host — and every redirect hop — against the addresses it
      // resolves to, so a client-supplied URL cannot reach the private network.
      const res = await fetchPublicImage(source);
      if (!res.ok) {
        throw new Error(`Failed to download image: HTTP ${res.status}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      if (arrayBuffer.byteLength > GALLERY_MAX_BYTES) {
        throw new Error("Image too large to archive");
      }
      buf = Buffer.from(arrayBuffer);
    }

    const fileName = `${prefix}-${crypto.randomUUID()}.jpg`;
    // Re-encoding through sharp also strips anything that is not an image.
    await sharp(buf)
      .resize({ width: GALLERY_IMAGE.width, height: GALLERY_IMAGE.height, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: GALLERY_IMAGE.quality })
      .toFile(path.join(GALLERY_DIR, fileName));

    return `/gallery/${fileName}`;
  }

  /** Removes a gallery file given its public `/gallery/...` path. */
  static async deleteGalleryImage(publicPath?: string | null) {
    if (!publicPath || !publicPath.startsWith("/gallery/")) return;
    const fileName = path.basename(publicPath);
    await ImageService.deleteImage(path.join(GALLERY_DIR, fileName));
  }

  static async cleanupStaleUploads(maxAgeMs: number) {
    let files: string[];
    try {
      files = await fs.promises.readdir(TMP_DIR);
    } catch {
      return 0;
    }

    const now = Date.now();
    // Files this server writes into TMP_DIR: the inbound upload plus the two
    // derived copies. The bare-UUID form is what uploads were named before
    // they carried an `upload-` prefix — an aborted request used to leave one
    // behind that nothing ever swept.
    const OWN_FILE = /^(optimized|enhanced|upload)-.+\.(jpg|jpeg|png|webp|heic|heif)$/i;
    const LEGACY_UPLOAD =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/i;
    const stale = files.filter((f) => OWN_FILE.test(f) || LEGACY_UPLOAD.test(f));

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