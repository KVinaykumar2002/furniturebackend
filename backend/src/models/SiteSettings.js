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

/** Homepage "Completed projects" row: label + display value (e.g. "10,154") */
const completedProjectStatSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    value: { type: String, default: "" },
  },
  { _id: false }
);

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    text: { type: String, default: "" },
    avatar: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
  },
  { _id: false }
);

const promoStripStatSchema = new mongoose.Schema(
  {
    iconKey: { type: String, default: "users" },
    value: { type: String, default: "" },
    label: { type: String, default: "" },
  },
  { _id: false }
);

const promoStripSchema = new mongoose.Schema(
  {
    saleTitle: { type: String, default: "SALE" },
    saleSubtitle: { type: String, default: "Ends In" },
    saleEndsAt: { type: String, default: "" },
    storeLine1: { type: String, default: "" },
    storeLine2: { type: String, default: "" },
    storeHref: { type: String, default: "/stores" },
    stats: { type: [promoStripStatSchema], default: [] },
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
    ourStoresImage: { type: String, default: "" },
    heroSlides: { type: [heroSlideSchema], default: [] },
    socialLinks: { type: [socialLinkSchema], default: [] },
    completedProjectStats: { type: [completedProjectStatSchema], default: [] },
    testimonials: { type: [testimonialSchema], default: [] },
    promoStrip: { type: promoStripSchema, default: undefined },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
