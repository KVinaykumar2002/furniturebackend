import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
  },
  { _id: false }
);

const socialLinkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    href: { type: String, default: "#" },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, default: "default" },
    contactPhone: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    address: { type: String, default: "" },
    brandTagline: { type: String, default: "" },
    heroSlides: { type: [heroSlideSchema], default: [] },
    socialLinks: { type: [socialLinkSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
