import { Router } from "express";
import SiteSettings from "../models/SiteSettings.js";
import { DEFAULT_TESTIMONIALS } from "../data/defaultTestimonials.js";
import { buildDefaultPromoStrip } from "../data/defaultPromoStrip.js";

const router = Router();
const ID = "default";

const DEFAULT_COMPLETED_PROJECT_STATS = [
  { label: "Fit-out", value: "553" },
  { label: "Furnishing", value: "10,154" },
  { label: "Consultation", value: "756" },
];

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
        completedProjectStats: DEFAULT_COMPLETED_PROJECT_STATS,
        testimonials: DEFAULT_TESTIMONIALS,
        promoStrip: buildDefaultPromoStrip(),
      });
      doc = await SiteSettings.findOne({ id: ID }).lean();
    }
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
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
      completedProjectStats: Array.isArray(body.completedProjectStats)
        ? body.completedProjectStats.map((row) => ({
            label: row && typeof row.label === "string" ? row.label : "",
            value: row && typeof row.value === "string" ? row.value : "",
          }))
        : undefined,
      testimonials: Array.isArray(body.testimonials)
        ? body.testimonials.map((t) => ({
            name: t && typeof t.name === "string" ? t.name : "",
            role: t && typeof t.role === "string" ? t.role : "",
            rating: Math.min(5, Math.max(1, Number(t?.rating) || 5)),
            text: t && typeof t.text === "string" ? t.text : "",
            avatar: t && typeof t.avatar === "string" ? t.avatar : "",
            imageUrl: t && typeof t.imageUrl === "string" ? t.imageUrl : "",
            videoUrl: t && typeof t.videoUrl === "string" ? t.videoUrl : "",
          }))
        : undefined,
      promoStrip:
        body.promoStrip != null && typeof body.promoStrip === "object"
          ? {
              saleTitle:
                typeof body.promoStrip.saleTitle === "string" ? body.promoStrip.saleTitle : "",
              saleSubtitle:
                typeof body.promoStrip.saleSubtitle === "string" ? body.promoStrip.saleSubtitle : "",
              saleEndsAt:
                typeof body.promoStrip.saleEndsAt === "string" ? body.promoStrip.saleEndsAt : "",
              storeLine1:
                typeof body.promoStrip.storeLine1 === "string" ? body.promoStrip.storeLine1 : "",
              storeLine2:
                typeof body.promoStrip.storeLine2 === "string" ? body.promoStrip.storeLine2 : "",
              storeHref:
                typeof body.promoStrip.storeHref === "string" && body.promoStrip.storeHref.trim()
                  ? body.promoStrip.storeHref.trim()
                  : "/stores",
              stats: Array.isArray(body.promoStrip.stats)
                ? body.promoStrip.stats.map((s) => {
                    const k = s && typeof s.iconKey === "string" ? s.iconKey : "users";
                    const iconKey = ["users", "truck", "shield", "factory"].includes(k)
                      ? k
                      : "users";
                    return {
                      iconKey,
                      value: s && typeof s.value === "string" ? s.value : "",
                      label: s && typeof s.label === "string" ? s.label : "",
                    };
                  })
                : [],
            }
          : undefined,
    };
    const filtered = Object.fromEntries(Object.entries(update).filter(([, v]) => v !== undefined));
    const doc = await SiteSettings.findOneAndUpdate(
      { id: ID },
      { $set: filtered },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    /** Avoid sending huge payloads (e.g. base64 hero images) when only small fields changed */
    const minimal =
      req.query.minimal === "1" ||
      req.query.minimal === "true" ||
      req.query.quick === "1";
    if (minimal) {
      return res.status(204).end();
    }

    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
