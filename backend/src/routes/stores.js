import { Router } from "express";
import Store from "../models/Store.js";

const router = Router();

/** GET /api/stores - all stores */
router.get("/", async (req, res) => {
  try {
    const list = await Store.find().lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** GET /api/stores/:id - single store */
router.get("/:id", async (req, res) => {
  try {
    const store = await Store.findOne({ id: req.params.id }).lean();
    if (!store) return res.status(404).json({ error: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
