import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import ShopCategory from "./models/ShopCategory.js";
import Store from "./models/Store.js";
import { seedProducts, seedCategories, seedShopCategories, seedStores } from "./seedData.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/furniture";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");

  await Product.deleteMany({});
  await Category.deleteMany({});
  await ShopCategory.deleteMany({});
  await Store.deleteMany({});

  await Product.insertMany(seedProducts);
  console.log("Products:", seedProducts.length);

  await Category.insertMany(seedCategories);
  console.log("Categories:", seedCategories.length);

  await ShopCategory.insertMany(seedShopCategories);
  console.log("Shop categories:", seedShopCategories.length);

  await Store.insertMany(seedStores);
  console.log("Stores:", seedStores.length);

  console.log("Seed done.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
