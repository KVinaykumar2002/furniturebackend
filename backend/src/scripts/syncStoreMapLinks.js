/**
 * Updates existing Store documents with canonical mapLink / mapSearchQuery / mapEmbedUrl / coords
 * from seedStores (same URLs as Store Locator share links).
 *
 * Usage (from backend/):  npm run sync-stores-maps
 * Requires MONGODB_URI in .env
 */
import "dotenv/config";
import mongoose from "mongoose";
import Store from "../models/Store.js";
import { seedStores } from "../seedData.js";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

await mongoose.connect(uri);
try {
  for (const s of seedStores) {
    const $set = {
      mapLink: s.mapLink,
      mapEmbedUrl: s.mapEmbedUrl,
      mapLat: s.mapLat,
      mapLng: s.mapLng,
    };
    const update = { $set };
    if (s.mapSearchQuery) {
      $set.mapSearchQuery = s.mapSearchQuery;
    } else {
      update.$unset = { mapSearchQuery: "" };
    }
    const res = await Store.updateOne({ id: s.id }, update);
    console.log(`${s.id}: matched ${res.matchedCount}, modified ${res.modifiedCount}`);
  }
} finally {
  await mongoose.disconnect();
}
