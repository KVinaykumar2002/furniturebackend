import type { MainCategorySlug } from "./nav";

/** Subcategory is free-form; use string for API flexibility. */
export type SubcategorySlug = string;

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  save?: number;
  rating: number;
  reviews: number;
  image: string;
  /** Optional gallery; first item is primary. */
  images?: string[];
  category: string;
  mainCategory: MainCategorySlug;
  subcategory?: string;
  isNew?: boolean;
  featured?: boolean;
  color?: string;
  size?: string;
  inStock?: boolean;
  productLocation?: string;
  has3d?: boolean;
}

export type SortOption = "popularity" | "price-asc" | "price-desc" | "new";
export type FilterCategory = MainCategorySlug | "all";
