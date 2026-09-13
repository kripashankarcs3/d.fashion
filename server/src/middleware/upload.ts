import multer, { MulterError } from "multer";
import fs from "fs";
import crypto from "crypto";
import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_TYPE_EXTENSIONS,
  MAX_FILE_SIZE,
  TMP_DIR,
} from "../constants";

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, TMP_DIR);
  },

  filename: (_req, file, cb) => {
    // Extension comes from the accepted mimetype, never from the client's
    // filename — see IMAGE_TYPE_EXTENSIONS. fileFilter has already rejected
    // anything not in the map, so the fallback is unreachable in practice.
    const ext = IMAGE_TYPE_EXTENSIONS[file.mimetype] ?? ".jpg";
    cb(null, `upload-${crypto.randomUUID()}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
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