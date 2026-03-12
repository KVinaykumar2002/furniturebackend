// Local images removed to ensure 100% unique category images

export type MainCategorySlug =
  | "rugs"
  | "decor"
  | "furniture"
  | "lighting"
  | "kitchenware"
  | "wall-covering"
  | "toilet"
  | "scent-diffusers"
  | "fitout-joinery"
  | "curtains";

export type FurnitureSubSlug = "indoor" | "outdoor" | "office";

export const mainCategoryTabs: { slug: MainCategorySlug; label: string }[] = [
  { slug: "rugs", label: "Rugs" },
  { slug: "decor", label: "Decor" },
  { slug: "furniture", label: "Furniture" },
  { slug: "lighting", label: "Lighting" },
  { slug: "kitchenware", label: "Kitchenware" },
  { slug: "wall-covering", label: "Wall Covering" },
  { slug: "toilet", label: "Toilet" },
  { slug: "scent-diffusers", label: "Scent Diffusers" },
  { slug: "fitout-joinery", label: "Fitout / Joinery" },
  { slug: "curtains", label: "Curtains" },
];

export const furnitureSubTabs: { slug: FurnitureSubSlug; label: string }[] = [
  { slug: "indoor", label: "Indoor" },
  { slug: "outdoor", label: "Outdoor" },
  { slug: "office", label: "Office" },
];

export interface CategoryGridItem {
  slug: string;
  label: string;
  image: string;
  href: string;
}

/** 3x4 grid for Furniture > Indoor — first 4 use local luxury sofa images (1–4.png) */
export const indoorFurnitureGrid: CategoryGridItem[] = [
  { slug: "all", label: "All Furniture", image: "/1.png", href: "/collections" },
  { slug: "sofas", label: "Sofas", image: "/2.png", href: "/living?sub=sofas" },
  { slug: "bedsteads", label: "Bedsteads", image: "/3.png", href: "/bedroom?sub=beds" },
  { slug: "mattress", label: "Mattress", image: "/4.png", href: "/bedroom?sub=mattress" },
  { slug: "bedside-tables", label: "Bedside Tables", image: "https://images.unsplash.com/photo-1582562124578-8ba94c25f4b5?auto=format&fit=crop&q=80&w=600", href: "/bedroom?sub=bedside-tables" },
  { slug: "dressers-mirrors", label: "Dressers & Mirrors", image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=600", href: "/bedroom?sub=dressers-mirrors" },
  { slug: "lounge-chairs", label: "Lounge Chairs", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600", href: "/living?sub=relax-chairs" },
  { slug: "sideboard", label: "Sideboard / Storage", image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&q=80&w=600", href: "/dining?sub=sideboard" },
  { slug: "closet-wardrobe", label: "Closet / Wardrobe", image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=600", href: "/bedroom?sub=wardrobes" },
  { slug: "wall-units-tv", label: "Wall Units / T.V. Units", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600", href: "/living?sub=tv-units" },
  { slug: "shelves", label: "Shelves", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "dining-tables", label: "Dining Tables", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600", href: "/dining?sub=dining-tables" },
];

/** Outdoor grid — each item has a unique image */
export const outdoorFurnitureGrid: CategoryGridItem[] = [
  { slug: "all", label: "All Outdoor", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "seating", label: "Outdoor Seating", image: "https://images.unsplash.com/photo-1599596652431-8f5eb22304dc?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "dining", label: "Outdoor Dining", image: "https://images.unsplash.com/photo-1620319515594-e3dc164b162f?auto=format&fit=crop&q=80&w=600", href: "/dining" },
  { slug: "loungers", label: "Loungers", image: "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "umbrellas", label: "Umbrellas", image: "https://images.unsplash.com/photo-1533038590840-1c73a87ec118?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "planters", label: "Planters", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "accessories", label: "Accessories", image: "https://images.unsplash.com/photo-1582282577017-e8544ab6f0fb?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "storage", label: "Storage", image: "https://images.unsplash.com/photo-1595526114101-1e90e79391de?auto=format&fit=crop&q=80&w=600", href: "/collections" },
];

/** Office grid — each item has a unique image */
export const officeFurnitureGrid: CategoryGridItem[] = [
  { slug: "all", label: "All Office", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "desks", label: "Desks", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "chairs", label: "Office Chairs", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "storage", label: "Storage", image: "https://images.unsplash.com/photo-1598442299849-0d9c4de4ba7d?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "tables", label: "Meeting Tables", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "shelving", label: "Shelving", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "screens", label: "Screens", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600", href: "/collections" },
  { slug: "accessories", label: "Accessories", image: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=600", href: "/collections" },
];

export function getFurnitureGridBySub(sub: FurnitureSubSlug): CategoryGridItem[] {
  switch (sub) {
    case "indoor":
      return indoorFurnitureGrid;
    case "outdoor":
      return outdoorFurnitureGrid;
    case "office":
      return officeFurnitureGrid;
    default:
      return indoorFurnitureGrid;
  }
}

/* ── Shop by Category – circular grid (matches reference design) ── */

export interface ShopByCategoryItem {
  slug: string;
  label: string;
  image: string;
  href: string;
  /** If true, render as the special "New Arrivals" star circle */
  isNewArrivals?: boolean;
}

export const shopByCategories: ShopByCategoryItem[] = [
  { slug: "new-arrivals", label: "New Arrivals", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400", href: "/collections", isNewArrivals: true },
  { slug: "sofas", label: "Sofas", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=400", href: "/living?sub=sofas" },
  { slug: "sofa-cum-beds", label: "Sofa Cum Beds", image: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=400", href: "/living?sub=sofas" },
  { slug: "coffee-tables", label: "Coffee Tables", image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=400", href: "/living?sub=coffee-tables" },
  { slug: "beds", label: "Beds", image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=400", href: "/bedroom?sub=beds" },
  { slug: "wardrobes", label: "Wardrobes", image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=400", href: "/bedroom" },
  { slug: "tv-units", label: "TV Units", image: "https://images.unsplash.com/photo-1600607684527-6fb886090705?auto=format&fit=crop&q=80&w=400", href: "/living" },
  { slug: "recliners", label: "Recliners", image: "https://images.unsplash.com/photo-1596076846938-23e595e7d480?auto=format&fit=crop&q=80&w=400", href: "/living?sub=relax-chairs" },
  { slug: "dining-sets", label: "Dining Sets", image: "https://images.unsplash.com/photo-1620319515594-e3dc164b162f?auto=format&fit=crop&q=80&w=400", href: "/dining?sub=dining-tables" },
  { slug: "lounge-chairs", label: "Lounge Chairs", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=400", href: "/living?sub=relax-chairs" },
  { slug: "shoe-racks", label: "Shoe Racks", image: "https://images.unsplash.com/photo-1595526114101-1e90e79391de?auto=format&fit=crop&q=80&w=400", href: "/collections" },
  { slug: "bookshelves", label: "Bookshelves", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400", href: "/collections" },
  { slug: "study-tables", label: "Study Tables", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400", href: "/collections" },
  { slug: "chest-of-drawers", label: "Chest of Drawers", image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=400", href: "/bedroom" },
  { slug: "sideboards", label: "Sideboards", image: "https://images.unsplash.com/photo-1628131346067-17eb48a04fac?auto=format&fit=crop&q=80&w=400", href: "/dining" },
  { slug: "mattresses", label: "Mattresses", image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=400", href: "/bedroom?sub=beds" },
];
