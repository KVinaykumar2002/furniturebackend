import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    oldPrice: Number,
    save: Number,
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    image: { type: String, required: true },
    /** Optional gallery; first item is primary. Kept alongside `image` for backward compatibility. */
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    mainCategory: { type: String, required: true },
    subcategory: String,
    isNew: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    color: String,
    size: String,
    inStock: { type: Boolean, default: true },
    productLocation: String,
    has3d: Boolean,
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

productSchema.index({ reviews: -1, _id: 1 });
productSchema.index({ featured: 1, reviews: -1 });
productSchema.index({ isNew: 1, reviews: -1 });
productSchema.index({ mainCategory: 1, subcategory: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 1 });

export default mongoose.model("Product", productSchema);
