import fs from "fs";
import path from "path";
import sharp from "sharp";

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

  static deleteImage(filePath: string) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}