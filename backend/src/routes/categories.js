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

/** POST /api/categories - create category */
router.post("/", async (req, res) => {
  try {
    const { slug, title, description, image } = req.body;
    if (!slug?.trim() || !title?.trim() || !image?.trim()) {
      return res.status(400).json({ error: "slug, title and image are required" });
    }
    const safeSlug = slug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const existing = await Category.findOne({ slug: safeSlug });
    if (existing) return res.status(400).json({ error: "Category slug already exists" });
    const doc = await Category.create({
      slug: safeSlug,
      title: title.trim(),
      description: (description || "").trim(),
      image: image.trim(),
    });
    res.status(201).json(doc.toObject());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** PUT /api/categories/:slug - update category */
router.put("/:slug", async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      {
        $set: {
          title: req.body.title?.trim(),
          description: (req.body.description ?? "").trim(),
          image: req.body.image?.trim(),
        },
      },
      { new: true, runValidators: true }
    ).lean();
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** DELETE /api/categories/:slug */
router.delete("/:slug", async (req, res) => {
  try {
    const result = await Category.findOneAndDelete({ slug: req.params.slug });
    if (!result) return res.status(404).json({ error: "Category not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
