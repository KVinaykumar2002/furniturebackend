/**
 * Fills default About page HTML and FAQs when those fields are empty.
 * Safe to run anytime: does not delete other data.
 *
 * Usage: npm run seed:site-defaults
 */
import "dotenv/config";
import mongoose from "mongoose";
import SiteSettings from "./models/SiteSettings.js";
import { DEFAULT_ABOUT_PAGE_HTML, DEFAULT_FAQS } from "./data/defaultAboutAndFaqs.js";
import { validFaqCount } from "./data/faqUtils.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/furniture";

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");

  const doc = await SiteSettings.findOne({ id: "default" }).lean();
  if (!doc) {
    console.log(
      "No SiteSettings document (id=default). Open the app once so GET /api/site-settings creates it, then run this again."
    );
    await mongoose.disconnect();
    process.exit(0);
    return;
  }

  const patch = {};
  if (!String(doc.aboutPageHtml ?? "").trim()) {
    patch.aboutPageHtml = DEFAULT_ABOUT_PAGE_HTML;
  }
  if (validFaqCount(doc.faqs) === 0) {
    patch.faqs = DEFAULT_FAQS.map((f) => ({ ...f }));
  }

  if (Object.keys(patch).length === 0) {
    console.log("About page and FAQs already have content; nothing to update.");
  } else {
    await SiteSettings.updateOne({ id: "default" }, { $set: patch });
    console.log("Updated fields:", Object.keys(patch).join(", "));
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
