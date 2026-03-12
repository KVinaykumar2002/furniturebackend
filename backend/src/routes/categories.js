import { Router } from "express";
import Category from "../models/Category.js";

const router = Router();

/** GET /api/categories - all categories */
router.get("/", async (req, res) => {
  try {
    const list = await Category.find().sort({ slug: 1 }).lean();
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
