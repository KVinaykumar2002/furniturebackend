// Local images removed to ensure 100% unique category images
import type { MainCategorySlug } from "./nav";

export interface ShopCategory {
  slug: MainCategorySlug;
  title: string;
  description: string;
  image: string;
}

export const shopCategories: Record<MainCategorySlug, ShopCategory> = {
  living: {
    slug: "living",
    title: "Living",
    description: "Sofas, center tables, coffee tables & more for your living space.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
  },
  dining: {
    slug: "dining",
    title: "Dining",
    description: "Dining chairs, tables & bar stools for every home.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1600",
  },
  bedroom: {
    slug: "bedroom",
    title: "Bedroom",
    description: "Beds and bedroom furniture for restful nights.",
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=800",
  },
};

export const shopCategorySlugs: MainCategorySlug[] = ["living", "dining", "bedroom"];
