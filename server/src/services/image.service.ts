import fs from "fs";
import path from "path";
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

  static async cleanupStaleUploads(maxAgeMs: number) {
    let files: string[];
    try {
      files = await fs.promises.readdir(TMP_DIR);
    } catch {
      return 0;
    }

    const now = Date.now();
    const stale = files.filter((f) => /^optimized-.+\.(jpg|jpeg|png)$/i.test(f));

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