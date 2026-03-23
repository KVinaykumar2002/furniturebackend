import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import ShopCategory from "./models/ShopCategory.js";
import Store from "./models/Store.js";
import { seedProducts, seedCategories, seedShopCategories, seedStores } from "./seedData.js";
import SiteSettings from "./models/SiteSettings.js";
import { DEFAULT_ABOUT_PAGE_HTML, DEFAULT_FAQS } from "./data/defaultAboutAndFaqs.js";
import { validFaqCount } from "./data/faqUtils.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/furniture";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");

  await Product.deleteMany({});
  await Category.deleteMany({});
  await ShopCategory.deleteMany({});
  await Store.deleteMany({});

  if (seedProducts.length > 0) {
    await Product.insertMany(seedProducts);
  }
  console.log("Products seeded:", seedProducts.length, "(add products in Admin for production)");

  await Category.insertMany(seedCategories);
  console.log("Categories:", seedCategories.length);

  await ShopCategory.insertMany(seedShopCategories);
  console.log("Shop categories:", seedShopCategories.length);

  await Store.insertMany(seedStores);
  console.log("Stores:", seedStores.length);

  const settingsDoc = await SiteSettings.findOne({ id: "default" }).lean();
  if (settingsDoc) {
    const patch = {};
    if (!String(settingsDoc.aboutPageHtml ?? "").trim()) {
      patch.aboutPageHtml = DEFAULT_ABOUT_PAGE_HTML;
    }
    if (validFaqCount(settingsDoc.faqs) === 0) {
      patch.faqs = DEFAULT_FAQS.map((f) => ({ ...f }));
    }
    if (Object.keys(patch).length) {
      await SiteSettings.updateOne({ id: "default" }, { $set: patch });
      console.log("Site settings: filled default About / FAQs (were empty):", Object.keys(patch).join(", "));
    }
  }

  console.log("Seed done.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
