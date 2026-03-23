import { Router } from "express";
import SiteSettings from "../models/SiteSettings.js";
import { DEFAULT_TESTIMONIALS } from "../data/defaultTestimonials.js";
import { buildDefaultPromoStrip } from "../data/defaultPromoStrip.js";
import {
  DEFAULT_ABOUT_PAGE_HTML,
  DEFAULT_ABOUT_SECTIONS,
  DEFAULT_FAQS,
  aboutSectionsToHtml,
} from "../data/defaultAboutAndFaqs.js";
import { validFaqCount, coerceFaqsToArray } from "../data/faqUtils.js";

const router = Router();
const ID = "default";

const DEFAULT_COMPLETED_PROJECT_STATS = [
  { label: "Fit-out", value: "553" },
  { label: "Furnishing", value: "10,154" },
  { label: "Consultation", value: "756" },
];

/** Persist default About + FAQs when missing or when faqs are all empty/invalid (so UI never stays blank). */
async function ensureDefaultAboutAndFaqs(leanDoc) {
  if (!leanDoc) return leanDoc;
  const patch = {};
  const hasAboutSections =
    Array.isArray(leanDoc.aboutSections) &&
    leanDoc.aboutSections.some(
      (s) => String(s?.title ?? "").trim() || String(s?.body ?? "").trim()
    );
  if (!hasAboutSections) {
    patch.aboutSections = DEFAULT_ABOUT_SECTIONS.map((s) => ({ ...s }));
  }
  if (!String(leanDoc.aboutPageHtml ?? "").trim()) {
    patch.aboutPageHtml = hasAboutSections
      ? aboutSectionsToHtml(leanDoc.aboutSections)
      : DEFAULT_ABOUT_PAGE_HTML;
  }
  if (validFaqCount(leanDoc.faqs) === 0) {
    patch.faqs = DEFAULT_FAQS.map((f) => ({ ...f }));
  }
  if (Object.keys(patch).length === 0) return leanDoc;
  await SiteSettings.updateOne({ id: ID }, { $set: patch });
  return SiteSettings.findOne({ id: ID }).lean();
}

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
        aboutSections: DEFAULT_ABOUT_SECTIONS.map((s) => ({ ...s })),
        aboutPageHtml: DEFAULT_ABOUT_PAGE_HTML,
        blogsFooterLabel: "Blogs",
        blogsFooterHref: "/blogs",
        blogsPageHtml: "",
        shippingPolicyHtml: "",
        returnPolicyHtml: "",
        faqs: DEFAULT_FAQS.map((f) => ({ ...f })),
      });
      doc = await SiteSettings.findOne({ id: ID }).lean();
    } else {
      doc = { ...doc, faqs: coerceFaqsToArray(doc.faqs) };
      doc = await ensureDefaultAboutAndFaqs(doc);
    }
    if (doc) {
      doc = { ...doc, faqs: coerceFaqsToArray(doc.faqs) };
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
    const aboutSections = Array.isArray(body.aboutSections)
      ? body.aboutSections.map((s) => ({
          title: s && typeof s.title === "string" ? s.title : "",
          body: s && typeof s.body === "string" ? s.body : "",
        }))
      : undefined;
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
      aboutSections,
      aboutPageHtml:
        aboutSections !== undefined
          ? aboutSectionsToHtml(aboutSections)
          : body.aboutPageHtml != null
            ? String(body.aboutPageHtml)
            : undefined,
      blogsFooterLabel:
        body.blogsFooterLabel != null ? String(body.blogsFooterLabel) : undefined,
      blogsFooterHref:
        body.blogsFooterHref != null ? String(body.blogsFooterHref) : undefined,
      blogsPageHtml: body.blogsPageHtml != null ? String(body.blogsPageHtml) : undefined,
      shippingPolicyHtml:
        body.shippingPolicyHtml != null ? String(body.shippingPolicyHtml) : undefined,
      returnPolicyHtml:
        body.returnPolicyHtml != null ? String(body.returnPolicyHtml) : undefined,
      faqs: Array.isArray(body.faqs)
        ? body.faqs.map((f) => ({
            question: f && typeof f.question === "string" ? f.question : "",
            answer: f && typeof f.answer === "string" ? f.answer : "",
          }))
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
