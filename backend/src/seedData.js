// Seed data for categories, shop categories, and stores. Products are not seeded — add them via Admin / API for production.

import {
  STORE_GOOGLE_SHARE_LINKS,
  STORE_KONDAPUR,
  STORE_KOTHAPET,
} from "./data/storeLocations.js";

export const seedCategories = [
  { slug: "all", title: "All", description: "Browse all products across every category.", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" },
  { slug: "furniture", title: "Furniture", description: "Sofas, chairs, tables, and living room essentials. Timeless designs for every home.", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800" },
  { slug: "outdoor", title: "Outdoor", description: "Patio sets, garden furniture, and outdoor living. Built to last through the seasons.", image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&q=80&w=800" },
  { slug: "office", title: "Office", description: "Desks, ergonomic chairs, and storage. Create a productive and stylish workspace.", image: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&q=80&w=800" },
  { slug: "lighting", title: "Lighting", description: "Pendant lights, floor lamps, and table lamps. Set the mood in every room.", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800" },
  { slug: "rugs", title: "Rugs", description: "Handpicked rugs and runners. Add warmth and texture to your floors.", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800" },
  { slug: "decor", title: "Decor", description: "Mirrors, art, and accents. The finishing touches that make a house a home.", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800" },
  { slug: "kitchenware", title: "Kitchenware", description: "Kitchen essentials and dining accessories. Quality pieces for everyday use.", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800" },
  { slug: "wall-covering", title: "Wall Covering", description: "Wallpapers and wall coverings. Transform your walls with style.", image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=800" },
  { slug: "toilet", title: "Toilet", description: "Bathroom and toilet fixtures. Modern and functional solutions.", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800" },
  { slug: "scent-diffusers", title: "Scent Diffusers", description: "Fragrance diffusers and home scents. Create a welcoming atmosphere.", image: "https://images.unsplash.com/photo-1602874801006-4e411e29f52f?auto=format&fit=crop&q=80&w=800" },
  { slug: "fitout-joinery", title: "Fitout / Joinery", description: "Custom joinery and fit-out solutions. Built to measure for your space.", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800" },
  { slug: "curtains", title: "Curtains", description: "Curtains and window treatments. Style and privacy for every room.", image: "https://images.unsplash.com/photo-1524484485832-b57e5047d2b6?auto=format&fit=crop&q=80&w=800" },
];

export const seedShopCategories = [
  { slug: "living", title: "Living", description: "Sofas, center tables, coffee tables & more for your living space.", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800" },
  { slug: "dining", title: "Dining", description: "Dining chairs, tables & bar stools for every home.", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1600" },
  { slug: "bedroom", title: "Bedroom", description: "Beds and bedroom furniture for restful nights.", image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=800" },
];

export const seedStores = [
  {
    id: "kondapur",
    name: "Kondapur",
    address: "F963+88F, Kondapur Main Road, Block - B, Sri Ram Nagar, Laxmi Nagar, Gachibowli",
    city: "Hyderabad",
    mapEmbedUrl: `https://www.google.com/maps?q=${STORE_KONDAPUR.lat},${STORE_KONDAPUR.lng}&z=17&output=embed&hl=en`,
    mapLink: STORE_GOOGLE_SHARE_LINKS.kondapur,
    mapLat: STORE_KONDAPUR.lat,
    mapLng: STORE_KONDAPUR.lng,
  },
  {
    id: "kothapet",
    name: "Kothapet",
    address: "Kothapet",
    city: "Hyderabad",
    mapEmbedUrl: `https://www.google.com/maps?q=${STORE_KOTHAPET.lat},${STORE_KOTHAPET.lng}&z=17&output=embed&hl=en`,
    mapLink: STORE_GOOGLE_SHARE_LINKS.kothapet,
    mapLat: STORE_KOTHAPET.lat,
    mapLng: STORE_KOTHAPET.lng,
  },
];

/** No demo catalog — products come from MongoDB via Admin / API only. */
export const seedProducts = [];
