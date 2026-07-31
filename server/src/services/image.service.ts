import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const TMP_DIR = path.resolve(__dirname, "../../tmp");

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