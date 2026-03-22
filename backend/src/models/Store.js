import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    mapEmbedUrl: { type: String, required: true },
    mapLink: { type: String, required: true },
    mapLat: { type: Number, required: false },
    mapLng: { type: Number, required: false },
    /** Search string that matches the Google Maps place (same pin as mapLink share URL) */
    mapSearchQuery: { type: String, required: false },
    phone: String,
    hours: String,
  },
  { timestamps: true }
);

export default mongoose.model("Store", storeSchema);
