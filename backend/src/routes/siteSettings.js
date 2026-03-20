import { Router } from "express";
import SiteSettings from "../models/SiteSettings.js";

const router = Router();
const ID = "default";

/** GET /api/site-settings — return single settings document (create with defaults if missing) */
router.get("/", async (req, res) => {
  try {
    let doc = await SiteSettings.findOne({ id: ID }).lean();
    if (!doc) {
      await SiteSettings.create({
        id: ID,
        contactPhone: "",
        contactEmail: "",
        address: "",
        brandTagline: "",
        ourStoresImage: "",
        heroSlides: [],
        socialLinks: [],
      });
      doc = await SiteSettings.findOne({ id: ID }).lean();
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** PUT /api/site-settings — update settings */
router.put("/", async (req, res) => {
  try {
    const body = req.body;
    const update = {
      contactPhone: body.contactPhone != null ? String(body.contactPhone) : undefined,
      contactEmail: body.contactEmail != null ? String(body.contactEmail) : undefined,
      address: body.address != null ? String(body.address) : undefined,
      brandTagline: body.brandTagline != null ? String(body.brandTagline) : undefined,
      ourStoresImage: body.ourStoresImage != null ? String(body.ourStoresImage) : undefined,
      heroSlides: Array.isArray(body.heroSlides)
        ? body.heroSlides.map((s) => ({
            image: s && typeof s.image === "string" ? s.image : "",
            title: s && typeof s.title === "string" ? s.title : "",
            subtitle: s && typeof s.subtitle === "string" ? s.subtitle : "",
          }))
        : undefined,
      socialLinks: Array.isArray(body.socialLinks)
        ? body.socialLinks.map((l) => ({
            name: l && typeof l.name === "string" ? l.name : "",
            href: l && typeof l.href === "string" ? l.href : "#",
          }))
        : undefined,
    };
    const filtered = Object.fromEntries(Object.entries(update).filter(([, v]) => v !== undefined));
    const doc = await SiteSettings.findOneAndUpdate(
      { id: ID },
      { $set: filtered },
      { new: true, upsert: true, runValidators: true }
    ).lean();
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
