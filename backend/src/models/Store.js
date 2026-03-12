import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    mapEmbedUrl: { type: String, required: true },
    mapLink: { type: String, required: true },
    phone: String,
    hours: String,
  },
  { timestamps: true }
);

export default mongoose.model("Store", storeSchema);
