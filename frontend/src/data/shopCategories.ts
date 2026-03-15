import type { MainCategorySlug } from "./nav";

export interface ShopCategorySub {
  slug: string;
  label: string;
}

export interface ShopCategory {
  slug: MainCategorySlug;
  title: string;
  description: string;
  image: string;
  subcategories?: ShopCategorySub[];
}
