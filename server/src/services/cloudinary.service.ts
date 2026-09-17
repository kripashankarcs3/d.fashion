import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

/** The folder every archived image lives under in the Cloudinary account —
 *  keeps this app's uploads apart from anything else stored there. */
const FOLDER = "deestyle-gallery";

let configured: boolean | undefined; // undefined = not yet checked

/** True once all three Cloudinary credentials are set. Checked once and
 *  cached — env values don't change at runtime. */
export const isCloudinaryConfigured = (): boolean => {
  if (configured !== undefined) return configured;
  configured = Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
  if (configured) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  return configured;
};

/** Uploads an already-processed image buffer (resized/re-encoded by the
 *  caller) and returns its durable, publicly-loadable URL. */
export const uploadToCloudinary = (buffer: Buffer, fileName: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: FOLDER, public_id: fileName, resource_type: "image", overwrite: false },
      (err, result) => {
        if (err || !result) {
          reject(err ?? new Error("Cloudinary upload returned no result"));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });

/** True for a URL this module produced — so deleteGalleryImage knows whether
 *  to ask Cloudinary to remove it or fall through to the local-file path. */
export const isCloudinaryUrl = (url: string): boolean => url.includes("res.cloudinary.com/");

/** Recovers the public_id Cloudinary needs for deletion from the secure_url
 *  this module handed back: .../upload/[transformations/][v<version>/]<public_id>.<ext> */
const publicIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/upload\/(?:[^/]+\/)*?(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/);
  return match ? match[1] : null;
};

/** Best-effort delete — a member removing a dashboard entry shouldn't fail
 *  because Cloudinary's API hiccuped. */
export const deleteFromCloudinary = async (url: string): Promise<void> => {
  const publicId = publicIdFromUrl(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    console.warn("Cloudinary delete failed:", (err as Error).message);
  }
};
