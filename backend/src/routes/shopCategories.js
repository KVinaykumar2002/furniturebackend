import { Router } from "express";
import ShopCategory from "../models/ShopCategory.js";
import Product from "../models/Product.js";

const router = Router();

/** Humanize slug to label (e.g. "coffee-tables" -> "Coffee Tables") */
function slugToLabel(slug) {
  if (!slug || typeof slug !== "string") return "";
  return slug
    .trim()
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** GET /api/shop-categories - all shop categories with subcategories from products */
router.get("/", async (req, res) => {
  try {
    const list = await ShopCategory.find().sort({ slug: 1 }).lean();
    const slugs = list.map((c) => c.slug);
    const subcategoriesByMain = {};
    for (const mainSlug of slugs) {
      const subSlugs = await Product.distinct("subcategory", {
        mainCategory: mainSlug,
        subcategory: { $exists: true, $ne: null, $ne: "" },
      });
      subcategoriesByMain[mainSlug] = subSlugs
        .filter(Boolean)
        .map((s) => ({ slug: s, label: slugToLabel(s) }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
    const listWithSubs = list.map((c) => ({
      ...c,
      subcategories: subcategoriesByMain[c.slug] || [],
    }));
    const bySlug = {};
    listWithSubs.forEach((c) => {
      bySlug[c.slug] = c;
    });
    res.json({ list: listWithSubs, bySlug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
