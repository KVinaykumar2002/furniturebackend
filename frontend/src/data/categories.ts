// Local images removed to ensure 100% unique category images

export type CategorySlug =
  | "furniture"
  | "outdoor"
  | "office"
  | "lighting"
  | "rugs"
  | "decor"
  | "kitchenware"
  | "wall-covering"
  | "toilet"
  | "scent-diffusers"
  | "fitout-joinery"
  | "curtains";

export interface Category {
  slug: CategorySlug;
  title: string;
  description: string;
  image: string;
}

export const categories: Record<CategorySlug, Category> = {
  furniture: {
    slug: "furniture",
    title: "Furniture",
    description: "Sofas, chairs, tables, and living room essentials. Timeless designs for every home.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
  },
  outdoor: {
    slug: "outdoor",
    title: "Outdoor",
    description: "Patio sets, garden furniture, and outdoor living. Built to last through the seasons.",
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&q=80&w=800",
  },
  office: {
    slug: "office",
    title: "Office",
    description: "Desks, ergonomic chairs, and storage. Create a productive and stylish workspace.",
    image: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&q=80&w=800",
  },
  lighting: {
    slug: "lighting",
    title: "Lighting",
    description: "Pendant lights, floor lamps, and table lamps. Set the mood in every room.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
  },
  rugs: {
    slug: "rugs",
    title: "Rugs",
    description: "Handpicked rugs and runners. Add warmth and texture to your floors.",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
  },
  decor: {
    slug: "decor",
    title: "Decor",
    description: "Mirrors, art, and accents. The finishing touches that make a house a home.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
  },
  kitchenware: {
    slug: "kitchenware",
    title: "Kitchenware",
    description: "Kitchen essentials and dining accessories. Quality pieces for everyday use.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800",
  },
  "wall-covering": {
    slug: "wall-covering",
    title: "Wall Covering",
    description: "Wallpapers and wall coverings. Transform your walls with style.",
    image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=800",
  },
  toilet: {
    slug: "toilet",
    title: "Toilet",
    description: "Bathroom and toilet fixtures. Modern and functional solutions.",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800",
  },
  "scent-diffusers": {
    slug: "scent-diffusers",
    title: "Scent Diffusers",
    description: "Fragrance diffusers and home scents. Create a welcoming atmosphere.",
    image: "https://images.unsplash.com/photo-1602874801006-4e411e29f52f?auto=format&fit=crop&q=80&w=800",
  },
  "fitout-joinery": {
    slug: "fitout-joinery",
    title: "Fitout / Joinery",
    description: "Custom joinery and fit-out solutions. Built to measure for your space.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
  },
  curtains: {
    slug: "curtains",
    title: "Curtains",
    description: "Curtains and window treatments. Style and privacy for every room.",
    image: "https://images.unsplash.com/photo-1524484485832-b57e5047d2b6?auto=format&fit=crop&q=80&w=800",
  },
};

export const categorySlugs: CategorySlug[] = [
  "furniture", "outdoor", "office", "lighting", "rugs", "decor",
  "kitchenware", "wall-covering", "toilet", "scent-diffusers", "fitout-joinery", "curtains",
];
