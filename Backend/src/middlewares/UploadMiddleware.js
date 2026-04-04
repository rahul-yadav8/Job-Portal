// middlewares/upload.js
import multer from "multer";

// Memory storage so we can send buffer to Cloudinary
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
