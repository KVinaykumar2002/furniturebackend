import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

/** GET /api/products - list with optional filters */
router.get("/", async (req, res) => {
  try {
    const { mainCategory, subcategory, category, featured, bestSellers, sort, limit } = req.query;
    let query = {};

    if (mainCategory && mainCategory !== "all") query.mainCategory = mainCategory;
    if (subcategory) query.subcategory = subcategory;
    if (category) query.category = category;

    let list = await Product.find(query).lean();

    if (featured === "true") {
      list = list.filter((p) => p.save != null || p.rating === 5);
    }
    if (bestSellers === "true") {
      list = list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "new":
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "popularity":
      default:
        list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
    }

    const num = limit ? Math.min(parseInt(limit, 10) || 50, 200) : list.length;
    res.json(list.slice(0, num));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** GET /api/products/:id - single product */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
