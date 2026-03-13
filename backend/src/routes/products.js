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

/** POST /api/products - create product */
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    let id = body.id || body.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "product";
    const existing = await Product.findOne({ id });
    if (existing) id = `${id}-${Date.now().toString(36).slice(-6)}`;
    const doc = await Product.create({
      id,
      name: body.name,
      description: body.description ?? "",
      price: Number(body.price),
      oldPrice: body.oldPrice != null ? Number(body.oldPrice) : undefined,
      save: body.save != null ? Number(body.save) : undefined,
      rating: Number(body.rating) || 0,
      reviews: Number(body.reviews) || 0,
      image: body.image,
      category: body.category,
      mainCategory: body.mainCategory,
      subcategory: body.subcategory || undefined,
      isNew: Boolean(body.isNew),
    });
    res.status(201).json(doc.toObject());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** PUT /api/products/:id - update product */
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description ?? "",
          price: Number(req.body.price),
          oldPrice: req.body.oldPrice != null ? Number(req.body.oldPrice) : undefined,
          save: req.body.save != null ? Number(req.body.save) : undefined,
          rating: Number(req.body.rating) || 0,
          reviews: Number(req.body.reviews) || 0,
          image: req.body.image,
          category: req.body.category,
          mainCategory: req.body.mainCategory,
          subcategory: req.body.subcategory || undefined,
          isNew: Boolean(req.body.isNew),
        },
      },
      { new: true, runValidators: true }
    ).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** DELETE /api/products/:id */
router.delete("/:id", async (req, res) => {
  try {
    const result = await Product.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ error: "Product not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
