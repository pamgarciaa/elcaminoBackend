import multer from "multer";
import fs from "fs-extra";
import path from "path";

// 1. HELPER
export const cleanFileName = (fileName) => {
  if (!fileName) return "unknown";
  return fileName
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// 2. FACTORY
export const createUploadMiddleware = (subfolder) => {
  const finalPath = path.join("uploads", subfolder);
  fs.ensureDirSync(finalPath);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, finalPath);
    },
    filename: (req, file, cb) => {
      let finalName = "file";

      if (req.user && req.user.username) {
        finalName = req.user.username;
      } else {
        finalName =
          req.body.username || req.body.title || req.body.product || "unknown";
      }

      const cleanName = cleanFileName(finalName);
      const uniqueSuffix = Date.now();

      cb(
        null,
        `${subfolder}-${cleanName}-${uniqueSuffix}${path.extname(
          file.originalname
        )}`
      );
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("invalid file type"), false);
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
  });
};
