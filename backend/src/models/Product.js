import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: Number,
    save: Number,
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true },
    mainCategory: { type: String, required: true },
    subcategory: String,
    isNew: { type: Boolean, default: false },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export default mongoose.model("Product", productSchema);
