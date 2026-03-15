import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

/** GET /api/products - list with optional filters */
router.get("/", async (req, res) => {
  try {
    const { mainCategory, subcategory, category, featured, bestSellers, sort, limit, search } = req.query;
    const query = {};

    if (search && String(search).trim()) {
      query.name = { $regex: String(search).trim(), $options: "i" };
    }
    if (mainCategory && mainCategory !== "all") query.mainCategory = mainCategory;
    if (subcategory && subcategory !== "all") query.subcategory = subcategory;
    if (category && category !== "all") query.category = category;

    let list = await Product.find(query).lean();

    if (featured === "true") {
      list = list.filter((p) => p.featured === true);
    }
    if (bestSellers === "true") {
      list = list.filter((p) => p.isNew === true);
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
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

/** GET /api/products/:id - single product (ensure optional filter fields are always present) */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });
    // Always return filter fields (use null when empty so keys are present in JSON)
    const colorVal = product.color != null && String(product.color).trim() !== "" ? String(product.color).trim() : null;
    const sizeVal = product.size != null && String(product.size).trim() !== "" ? String(product.size).trim() : null;
    const locationVal = product.productLocation != null && String(product.productLocation).trim() !== "" ? String(product.productLocation).trim() : null;
    res.json({
      ...product,
      color: colorVal,
      size: sizeVal,
      productLocation: locationVal,
      inStock: product.inStock !== undefined ? product.inStock : true,
      has3d: product.has3d === true,
    });
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
      featured: Boolean(body.featured),
      color: body.color != null ? String(body.color) : undefined,
      size: body.size != null ? String(body.size) : undefined,
      inStock: body.inStock != null ? Boolean(body.inStock) : undefined,
      productLocation: body.productLocation != null ? String(body.productLocation) : undefined,
      has3d: body.has3d != null ? Boolean(body.has3d) : undefined,
    });
    res.status(201).json(doc.toObject());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** PUT /api/products/:id - update product (always set filter fields so they persist) */
router.put("/:id", async (req, res) => {
  try {
    const body = req.body;
    const setFields = {
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
      featured: Boolean(body.featured),
      inStock: body.inStock != null ? Boolean(body.inStock) : true,
      has3d: body.has3d === true,
      color: (body.color != null && String(body.color).trim() !== "") ? String(body.color).trim() : "",
      size: (body.size != null && String(body.size).trim() !== "") ? String(body.size).trim() : "",
      productLocation: (body.productLocation != null && String(body.productLocation).trim() !== "") ? String(body.productLocation).trim() : "",
    };
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: setFields },
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
