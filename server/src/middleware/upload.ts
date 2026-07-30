import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "tmp";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    console.log("Destination middleware called");
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    console.log("Uploading:", file.originalname);

    cb(
      null,
      `${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  console.log("MIME:", file.mimetype);

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/heic",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`));
  }
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});