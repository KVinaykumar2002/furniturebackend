import type { MainCategorySlug } from "./nav";

export interface ShopCategory {
  slug: MainCategorySlug;
  title: string;
  description: string;
  image: string;
}
