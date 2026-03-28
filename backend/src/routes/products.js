import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

/** GET /api/products - list with optional filters */
router.get("/", async (req, res) => {
  try {
    const { mainCategory, subcategory, category, featured, bestSellers, sort, limit, search, highlights, ids } = req.query;
    const highlightsMode = highlights === "true" || highlights === "1";

    /** Batch fetch by id list (e.g. recently viewed) — preserves request order, bounded */
    if (ids != null && String(ids).trim()) {
      const parts = String(ids)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const unique = [...new Set(parts)].slice(0, 50);
      if (unique.length > 0) {
        let list = await Product.find({ id: { $in: unique } }).lean();
        const byId = new Map(list.map((p) => [p.id, p]));
        list = unique.map((id) => byId.get(id)).filter(Boolean);
        return res.json(list);
      }
    }

    /** Homepage spotlight: best deals (featured) + new arrivals (isNew) — DB filter + limit (no full-catalog scan) */
    if (highlightsMode) {
      const filters = [];
      if (search && String(search).trim()) {
        filters.push({ name: { $regex: String(search).trim(), $options: "i" } });
      }
      if (mainCategory && mainCategory !== "all") filters.push({ mainCategory });
      if (subcategory && subcategory !== "all") filters.push({ subcategory });
      if (category && category !== "all") filters.push({ category });
      filters.push({ $or: [{ featured: true }, { isNew: true }] });
      const query = filters.length === 1 ? filters[0] : { $and: filters };
      const lim = Math.min(parseInt(String(limit), 10) || 8, 200);
      let list = await Product.find(query)
        .sort({ featured: -1, isNew: -1, reviews: -1 })
        .limit(lim)
        .lean();
      const seenIds = new Set();
      list = list.filter((p) => {
        const id = p && p.id;
        if (!id || seenIds.has(id)) return false;
        seenIds.add(id);
        return true;
      });
      return res.json(list);
    }

    const query = {};

    if (search && String(search).trim()) {
      query.name = { $regex: String(search).trim(), $options: "i" };
    }
    if (mainCategory && mainCategory !== "all") query.mainCategory = mainCategory;
    if (subcategory && subcategory !== "all") query.subcategory = subcategory;
    if (category && category !== "all") query.category = category;
    if (featured === "true" || featured === "1") query.featured = true;
    if (bestSellers === "true" || bestSellers === "1") query.isNew = true;

    let sortSpec = { reviews: -1, _id: 1 };
    switch (sort) {
      case "price-asc":
        sortSpec = { price: 1, _id: 1 };
        break;
      case "price-desc":
        sortSpec = { price: -1, _id: 1 };
        break;
      case "new":
        sortSpec = { isNew: -1, reviews: -1, _id: 1 };
        break;
      case "popularity":
      default:
        sortSpec = { reviews: -1, _id: 1 };
        break;
    }

    const limRaw = limit != null && limit !== "" ? parseInt(String(limit), 10) : NaN;
    const hasLimit = Number.isFinite(limRaw) && limRaw > 0;
    const lim = hasLimit ? Math.min(limRaw, 200) : null;

    let mongoQ = Product.find(query).sort(sortSpec).lean();
    if (lim != null) mongoQ = mongoQ.limit(lim);
    let list = await mongoQ;

    const seenIds = new Set();
    list = list.filter((p) => {
      const id = p && p.id;
      if (!id || seenIds.has(id)) return false;
      seenIds.add(id);
      return true;
    });

    res.json(list);
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
    const images = Array.isArray(body.images)
      ? body.images
          .map((u) => (u != null ? String(u).trim() : ""))
          .filter((u) => u)
      : [];
    const primaryImage = (String(body.image ?? "").trim() || images[0] || "").trim();
    const doc = await Product.create({
      id,
      name: body.name,
      description: body.description ?? "",
      price: Number(body.price),
      oldPrice: body.oldPrice != null ? Number(body.oldPrice) : undefined,
      save: body.save != null ? Number(body.save) : undefined,
      rating: Number(body.rating) || 0,
      reviews: Number(body.reviews) || 0,
      image: primaryImage,
      images: images.length ? images : primaryImage ? [primaryImage] : [],
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
    const images = Array.isArray(body.images)
      ? body.images
          .map((u) => (u != null ? String(u).trim() : ""))
          .filter((u) => u)
      : undefined;
    const primaryImage =
      images && images.length > 0
        ? images[0]
        : body.image != null
          ? String(body.image).trim()
          : undefined;
    const setFields = {
      name: body.name,
      description: body.description ?? "",
      price: Number(body.price),
      oldPrice: body.oldPrice != null ? Number(body.oldPrice) : undefined,
      save: body.save != null ? Number(body.save) : undefined,
      rating: Number(body.rating) || 0,
      reviews: Number(body.reviews) || 0,
      image: primaryImage,
      images,
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
