import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/i;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only images (JPEG, PNG, GIF, WebP) are allowed"));
  },
});

const router = Router();
const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;

/** POST /api/upload - single image file */
router.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ error: "File too large (max 5MB)" });
      return res.status(400).json({ error: err.message || "Upload failed" });
    }
    next();
  });
}, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  const url = `${BASE_URL}/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;
