import multer, { MulterError } from "multer";
import fs from "fs";
import crypto from "crypto";
import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_TYPE_EXTENSIONS,
  MAX_FILE_SIZE,
  PAYMENT_PROOF_DIR,
} from "../constants";

if (!fs.existsSync(PAYMENT_PROOF_DIR)) {
  fs.mkdirSync(PAYMENT_PROOF_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PAYMENT_PROOF_DIR);
  },

  filename: (_req, file, cb) => {
    // Same convention as middleware/upload.ts: the extension comes from the
    // accepted mimetype, never the client's filename.
    const ext = IMAGE_TYPE_EXTENSIONS[file.mimetype] ?? ".jpg";
    cb(null, `proof-${crypto.randomUUID()}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new MulterError("LIMIT_UNEXPECTED_FILE", `Invalid file type: ${file.mimetype}`));
  }
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
