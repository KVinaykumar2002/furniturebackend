import { Router } from "express";
import ShopCategory from "../models/ShopCategory.js";

const router = Router();

/** GET /api/shop-categories - all shop categories (living, dining, bedroom) */
router.get("/", async (req, res) => {
  try {
    const list = await ShopCategory.find().sort({ slug: 1 }).lean();
    const bySlug = {};
    list.forEach((c) => {
      bySlug[c.slug] = c;
    });
    res.json({ list, bySlug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
