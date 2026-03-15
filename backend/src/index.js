import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import shopCategoryRoutes from "./routes/shopCategories.js";
import storeRoutes from "./routes/stores.js";
import uploadRoutes from "./routes/upload.js";
import siteSettingsRoutes from "./routes/siteSettings.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/furniture";

const app = express();
app.use(cors({ origin: true }));
// Allow larger payloads for base64 images
app.use(express.json({ limit: "100mb" }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/shop-categories", shopCategoryRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/site-settings", siteSettingsRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
  app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
}

start();
