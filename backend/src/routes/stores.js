import { Router } from "express";
import Store from "../models/Store.js";

const router = Router();

function buildMapEmbedUrl({ mapLat, mapLng, address, city }) {
  const lat = mapLat != null ? Number(mapLat) : NaN;
  const lng = mapLng != null ? Number(mapLng) : NaN;
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed&hl=en`;
  }
  const q = encodeURIComponent(`${String(address ?? "").trim()}, ${String(city ?? "").trim()}, India`);
  return `https://www.google.com/maps?q=${q}&z=16&output=embed&hl=en`;
}

function normalizeStoreBody(body, { requireId } = { requireId: true }) {
  const id = body.id != null ? String(body.id).trim().toLowerCase().replace(/\s+/g, "-") : "";
  const name = body.name != null ? String(body.name).trim() : "";
  const address = body.address != null ? String(body.address).trim() : "";
  const city = body.city != null ? String(body.city).trim() : "";
  const mapLink = body.mapLink != null ? String(body.mapLink).trim() : "";
  let mapEmbedUrl = body.mapEmbedUrl != null ? String(body.mapEmbedUrl).trim() : "";
  const mapLatRaw = body.mapLat;
  const mapLngRaw = body.mapLng;
  const mapLat =
    mapLatRaw != null && mapLatRaw !== "" && Number.isFinite(Number(mapLatRaw)) ? Number(mapLatRaw) : undefined;
  const mapLng =
    mapLngRaw != null && mapLngRaw !== "" && Number.isFinite(Number(mapLngRaw)) ? Number(mapLngRaw) : undefined;
  const mapSearchQuery =
    body.mapSearchQuery != null && String(body.mapSearchQuery).trim() !== ""
      ? String(body.mapSearchQuery).trim()
      : undefined;
  const phone = body.phone != null && String(body.phone).trim() !== "" ? String(body.phone).trim() : undefined;
  const hours = body.hours != null && String(body.hours).trim() !== "" ? String(body.hours).trim() : undefined;

  if (requireId && !id) throw new Error("id is required");
  if (id && !/^[a-z0-9-]+$/.test(id)) {
    throw new Error("id must contain only lowercase letters, numbers, and hyphens");
  }
  if (!name) throw new Error("name is required");
  if (!address) throw new Error("address is required");
  if (!city) throw new Error("city is required");
  if (!mapLink) throw new Error("mapLink is required");
  if (!mapEmbedUrl) {
    mapEmbedUrl = buildMapEmbedUrl({ mapLat, mapLng, address, city });
  }

  return {
    id,
    name,
    address,
    city,
    mapLink,
    mapEmbedUrl,
    mapLat,
    mapLng,
    mapSearchQuery,
    phone,
    hours,
  };
}

/** GET /api/stores - all stores */
router.get("/", async (req, res) => {
  try {
    const list = await Store.find().lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** POST /api/stores - create store */
router.post("/", async (req, res) => {
  try {
    const data = normalizeStoreBody(req.body, { requireId: true });
    const existing = await Store.findOne({ id: data.id });
    if (existing) return res.status(400).json({ error: "A store with this id already exists" });
    const doc = await Store.create(data);
    res.status(201).json(doc.toObject());
  } catch (err) {
    res.status(400).json({ error: err.message });
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

/** PUT /api/stores/:id - update store */
router.put("/:id", async (req, res) => {
  try {
    const existing = await Store.findOne({ id: req.params.id });
    if (!existing) return res.status(404).json({ error: "Store not found" });
    const body = { ...req.body, id: req.params.id };
    const data = normalizeStoreBody(body, { requireId: true });
    const $set = {
      name: data.name,
      address: data.address,
      city: data.city,
      mapLink: data.mapLink,
      mapEmbedUrl: data.mapEmbedUrl,
    };
    if (data.mapLat != null) $set.mapLat = data.mapLat;
    if (data.mapLng != null) $set.mapLng = data.mapLng;
    if (data.mapSearchQuery != null) $set.mapSearchQuery = data.mapSearchQuery;
    if (data.phone != null) $set.phone = data.phone;
    if (data.hours != null) $set.hours = data.hours;
    const $unset = {};
    if (data.mapLat == null) $unset.mapLat = "";
    if (data.mapLng == null) $unset.mapLng = "";
    if (data.mapSearchQuery == null) $unset.mapSearchQuery = "";
    if (data.phone == null) $unset.phone = "";
    if (data.hours == null) $unset.hours = "";
    const update =
      Object.keys($unset).length > 0 ? { $set, $unset } : { $set };
    const updated = await Store.findOneAndUpdate({ id: req.params.id }, update, {
      new: true,
      runValidators: true,
    }).lean();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** DELETE /api/stores/:id */
router.delete("/:id", async (req, res) => {
  try {
    const result = await Store.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ error: "Store not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
