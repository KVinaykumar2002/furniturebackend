// Local images removed to ensure 100% unique product images
import type { CategorySlug } from "./categories";
import type { MainCategorySlug } from "./nav";

export type SubcategorySlug =
  | "sofas"
  | "center-tables"
  | "coffee-tables"
  | "relax-chairs"
  | "bar-stools"
  | "dining-chairs"
  | "dining-tables"
  | "beds"
  | "bedside-tables"
  | "dressers-mirrors"
  | "mattress"
  | "wardrobes"
  | "sideboard"
  | "tv-units";

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  save?: number;
  rating: number;
  reviews: number;
  image: string;
  category: CategorySlug;
  mainCategory: MainCategorySlug;
  subcategory?: SubcategorySlug;
  isNew?: boolean;
}

export const products: Product[] = [
  { id: "1", name: "MOVO Service Trolley - JK-D208", image: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&q=80&w=800", price: 2035, oldPrice: 2325, save: 290, rating: 5, reviews: 3, category: "furniture", mainCategory: "living", subcategory: "center-tables" },
  { id: "2", name: "43 Pieces Passifoy Dining Set", image: "https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format&fit=crop&q=80&w=800", price: 1015, oldPrice: 1410, save: 395, rating: 4, reviews: 12, category: "furniture", mainCategory: "dining", subcategory: "dining-tables" },
  { id: "3", name: "Haven Ebarza Dinnerware Set", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800", price: 755, oldPrice: 1165, save: 410, rating: 4, reviews: 5, category: "furniture", mainCategory: "dining" },
  { id: "4", name: "Classic Oak Sideboard", image: "https://images.unsplash.com/photo-1628131346067-17eb48a04fac?auto=format&fit=crop&q=80&w=800", price: 24999, rating: 5, reviews: 8, category: "furniture", mainCategory: "dining", subcategory: "sideboard" },
  { id: "5", name: "Velvet Lounge Chair", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800", price: 18999, rating: 4, reviews: 6, category: "furniture", mainCategory: "living", subcategory: "relax-chairs" },
  { id: "6", name: "Patio Dining Set - 6 Seater", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800", price: 34999, oldPrice: 39999, save: 5000, rating: 5, reviews: 4, category: "outdoor", mainCategory: "dining", subcategory: "dining-tables" },
  { id: "7", name: "Garden Lounge Chairs (Pair)", image: "https://images.unsplash.com/photo-1599596652431-8f5eb22304dc?auto=format&fit=crop&q=80&w=800", price: 12999, rating: 4, reviews: 11, category: "outdoor", mainCategory: "living", subcategory: "relax-chairs" },
  { id: "8", name: "Outdoor Coffee Table - Teak", image: "https://images.unsplash.com/photo-1583847268964-b28ce8f31586?auto=format&fit=crop&q=80&w=800", price: 15999, rating: 5, reviews: 7, category: "outdoor", mainCategory: "living", subcategory: "coffee-tables" },
  { id: "9", name: "Balcony Bistro Set", image: "https://images.unsplash.com/photo-1592398572111-e40ae68dfbf1?auto=format&fit=crop&q=80&w=800", price: 8999, rating: 4, reviews: 9, category: "outdoor", mainCategory: "dining", isNew: true },
  { id: "10", name: "Executive Desk - Walnut", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800", price: 28999, rating: 5, reviews: 5, category: "office", mainCategory: "living" },
  { id: "11", name: "Ergonomic Office Chair", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800", price: 14999, oldPrice: 17999, save: 3000, rating: 4, reviews: 14, category: "office", mainCategory: "living", subcategory: "relax-chairs" },
  { id: "12", name: "Filing Cabinet - 2 Drawer", image: "https://images.unsplash.com/photo-1598442299849-0d9c4de4ba7d?auto=format&fit=crop&q=80&w=800", price: 7999, rating: 4, reviews: 3, category: "office", mainCategory: "living" },
  { id: "13", name: "Bookcase with Ladder", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800", price: 21999, rating: 5, reviews: 6, category: "office", mainCategory: "living" },
  { id: "14", name: "Terra Pendant Lamp", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800", price: 4999, oldPrice: 6499, save: 1500, rating: 5, reviews: 8, category: "lighting", mainCategory: "living", isNew: true },
  { id: "15", name: "Minimal Floor Lamp", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800", price: 7499, rating: 4, reviews: 10, category: "lighting", mainCategory: "living" },
  { id: "16", name: "Table Lamp - Ceramic Base", image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=800", price: 3599, rating: 5, reviews: 12, category: "lighting", mainCategory: "bedroom" },
  { id: "17", name: "Chandelier - 6 Light", image: "https://images.unsplash.com/photo-1565507722709-a1b7e28b17ab?auto=format&fit=crop&q=80&w=800", price: 18999, rating: 5, reviews: 4, category: "lighting", mainCategory: "dining" },
  { id: "18", name: "Handwoven Wool Rug - 8x10", image: "https://images.unsplash.com/photo-1585144860106-998ca082ca9f?auto=format&fit=crop&q=80&w=800", price: 22999, rating: 5, reviews: 7, category: "rugs", mainCategory: "living" },
  { id: "19", name: "Runner - Geometric Pattern", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800", price: 5999, rating: 4, reviews: 9, category: "rugs", mainCategory: "dining" },
  { id: "20", name: "Area Rug - Neutral", image: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&q=80&w=800", price: 12999, oldPrice: 14999, save: 2000, rating: 4, reviews: 15, category: "rugs", mainCategory: "living" },
  { id: "21", name: "Decorative Wall Mirror", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800", price: 6999, rating: 5, reviews: 6, category: "decor", mainCategory: "bedroom" },
  { id: "22", name: "Ceramic Vase Set (3)", image: "https://images.unsplash.com/photo-1612152605347-f9479b18973b?auto=format&fit=crop&q=80&w=800", price: 3499, rating: 4, reviews: 8, category: "decor", mainCategory: "dining" },
  { id: "23", name: "Abstract Canvas Art", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800", price: 8999, rating: 5, reviews: 4, category: "decor", mainCategory: "living" },
  { id: "24", name: "Throw Cushions - Set of 4", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800", price: 2499, rating: 4, reviews: 22, category: "decor", mainCategory: "bedroom" },
  { id: "25", name: "Modern 3-Seater Sofa", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800", price: 42999, rating: 5, reviews: 12, category: "furniture", mainCategory: "living", subcategory: "sofas", isNew: true },
  { id: "26", name: "Dining Table - 6 Seater", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800", price: 31999, oldPrice: 35999, save: 4000, rating: 5, reviews: 7, category: "furniture", mainCategory: "dining", subcategory: "dining-tables" },
  { id: "27", name: "King Size Bed - Upholstered", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800", price: 44999, rating: 5, reviews: 9, category: "furniture", mainCategory: "bedroom", subcategory: "beds" },
  { id: "28", name: "Bar Stool - Set of 2", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800", price: 8999, rating: 4, reviews: 5, category: "furniture", mainCategory: "living", subcategory: "bar-stools" },
  { id: "29", name: "Marble Top Center Table", image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&q=80&w=800", price: 18499, oldPrice: 20999, save: 2500, rating: 5, reviews: 6, category: "furniture", mainCategory: "living", subcategory: "center-tables" },
  { id: "30", name: "Nested Coffee Tables - Set of 2", image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800", price: 12999, rating: 4, reviews: 8, category: "furniture", mainCategory: "living", subcategory: "coffee-tables" },
  { id: "31", name: "Metal Bar Stools - Set of 2", image: "https://images.unsplash.com/photo-1562184552-997c461abbe6?auto=format&fit=crop&q=80&w=800", price: 7499, rating: 4, reviews: 4, category: "furniture", mainCategory: "living", subcategory: "bar-stools" },
  { id: "32", name: "Leather Accent Chair", image: "https://images.unsplash.com/photo-1596076846938-23e595e7d480?auto=format&fit=crop&q=80&w=800", price: 22999, rating: 5, reviews: 10, category: "furniture", mainCategory: "living", subcategory: "relax-chairs" },
  { id: "33", name: "L-Shaped Sectional Sofa", image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800", price: 54999, rating: 5, reviews: 7, category: "furniture", mainCategory: "living", subcategory: "sofas" },
  { id: "34", name: "Upholstered Dining Chairs - Set of 4", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800", price: 24999, rating: 5, reviews: 5, category: "furniture", mainCategory: "dining", subcategory: "dining-chairs" },
  { id: "35", name: "Wooden Dining Chairs - Pair", image: "https://images.unsplash.com/photo-1581428982868-e410dd047c90?auto=format&fit=crop&q=80&w=800", price: 8999, rating: 4, reviews: 11, category: "furniture", mainCategory: "dining", subcategory: "dining-chairs" },
  { id: "36", name: "Counter Bar Stools - Set of 2", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800", price: 10999, rating: 5, reviews: 3, category: "furniture", mainCategory: "dining", subcategory: "bar-stools" },
  { id: "36b", name: "Swivel Bar Stools - Set of 2", image: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=800", price: 12999, rating: 4, reviews: 6, category: "furniture", mainCategory: "dining", subcategory: "bar-stools" },
  { id: "37", name: "Extendable Dining Table", image: "https://images.unsplash.com/photo-1604578762246-4113259e20af?auto=format&fit=crop&q=80&w=800", price: 37999, rating: 5, reviews: 8, category: "furniture", mainCategory: "dining", subcategory: "dining-tables" },
  { id: "38", name: "Round Dining Table - 4 Seater", image: "https://images.unsplash.com/photo-1616627529452-fbdff13d5089?auto=format&fit=crop&q=80&w=800", price: 19999, rating: 4, reviews: 6, category: "furniture", mainCategory: "dining", subcategory: "dining-tables" },
  { id: "39", name: "Queen Size Platform Bed", image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800", price: 32999, oldPrice: 36999, save: 4000, rating: 5, reviews: 8, category: "furniture", mainCategory: "bedroom", subcategory: "beds" },
  { id: "40", name: "Single Bed - Solid Wood", image: "https://images.unsplash.com/photo-1533000720448-958aed61476b?auto=format&fit=crop&q=80&w=800", price: 15999, rating: 4, reviews: 4, category: "furniture", mainCategory: "bedroom", subcategory: "beds" },
  { id: "41", name: "Bedside Table with Drawer", image: "https://images.unsplash.com/photo-1582562124578-8ba94c25f4b5?auto=format&fit=crop&q=80&w=800", price: 6999, rating: 4, reviews: 9, category: "furniture", mainCategory: "bedroom", subcategory: "bedside-tables" },
  { id: "42", name: "Dressing Table with Mirror", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800", price: 27999, rating: 5, reviews: 5, category: "furniture", mainCategory: "bedroom", subcategory: "dressers-mirrors" },
  // Extra sofas (living)
  { id: "43", name: "2-Seater Velvet Sofa", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800", price: 34999, rating: 5, reviews: 6, category: "furniture", mainCategory: "living", subcategory: "sofas" },
  { id: "44", name: "Chaise Lounge Sofa", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800", price: 41999, rating: 4, reviews: 8, category: "furniture", mainCategory: "living", subcategory: "sofas" },
  // Extra center-tables (living)
  { id: "45", name: "Console Table - Slim", image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&q=80&w=800", price: 12499, rating: 4, reviews: 5, category: "furniture", mainCategory: "living", subcategory: "center-tables" },
  { id: "46", name: "Oak Center Table", image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&q=80&w=800", price: 15999, rating: 5, reviews: 7, category: "furniture", mainCategory: "living", subcategory: "center-tables" },
  // Extra coffee-tables (living)
  { id: "47", name: "Glass Top Coffee Table", image: "https://images.unsplash.com/photo-1616627529452-fbdff13d5089?auto=format&fit=crop&q=80&w=800", price: 14999, rating: 4, reviews: 9, category: "furniture", mainCategory: "living", subcategory: "coffee-tables" },
  { id: "48", name: "Industrial Coffee Table", image: "https://images.unsplash.com/photo-1604578762246-4113259e20af?auto=format&fit=crop&q=80&w=800", price: 11999, rating: 5, reviews: 4, category: "furniture", mainCategory: "living", subcategory: "coffee-tables" },
  // Extra bar-stools (living)
  { id: "49", name: "Backless Bar Stools - Set of 2", image: "https://images.unsplash.com/photo-1562184552-997c461abbe6?auto=format&fit=crop&q=80&w=800", price: 6499, rating: 4, reviews: 6, category: "furniture", mainCategory: "living", subcategory: "bar-stools" },
  { id: "50", name: "Rattan Bar Stools - Pair", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800", price: 8499, rating: 5, reviews: 3, category: "furniture", mainCategory: "living", subcategory: "bar-stools" },
  // TV units (living)
  { id: "51", name: "Low TV Unit - Oak", image: "https://images.unsplash.com/photo-1600607684527-6fb886090705?auto=format&fit=crop&q=80&w=800", price: 18999, rating: 5, reviews: 10, category: "furniture", mainCategory: "living", subcategory: "tv-units" },
  { id: "52", name: "Wall-Mounted TV Console", image: "https://images.unsplash.com/photo-1598442299849-0d9c4de4ba7d?auto=format&fit=crop&q=80&w=800", price: 22999, rating: 4, reviews: 5, category: "furniture", mainCategory: "living", subcategory: "tv-units" },
  { id: "53", name: "Media Unit with Shelves", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800", price: 27999, rating: 5, reviews: 7, category: "furniture", mainCategory: "living", subcategory: "tv-units" },
  { id: "54", name: "Entertainment Center - Walnut", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", price: 34999, rating: 5, reviews: 8, category: "furniture", mainCategory: "living", subcategory: "tv-units" },
  // Extra dining-chairs (dining)
  { id: "55", name: "Scandinavian Dining Chairs - Set of 4", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800", price: 19999, rating: 5, reviews: 6, category: "furniture", mainCategory: "dining", subcategory: "dining-chairs" },
  { id: "56", name: "Metal Frame Dining Chairs - Pair", image: "https://images.unsplash.com/photo-1581428982868-e410dd047c90?auto=format&fit=crop&q=80&w=800", price: 7499, rating: 4, reviews: 4, category: "furniture", mainCategory: "dining", subcategory: "dining-chairs" },
  // Extra bar-stools (dining)
  { id: "57", name: "Wooden Bar Stools - Set of 2", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800", price: 9499, rating: 4, reviews: 5, category: "furniture", mainCategory: "dining", subcategory: "bar-stools" },
  { id: "58", name: "Upholstered Bar Stools - Pair", image: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=800", price: 11999, rating: 5, reviews: 4, category: "furniture", mainCategory: "dining", subcategory: "bar-stools" },
  // Extra sideboard (dining)
  { id: "59", name: "Modern Sideboard - White", image: "https://images.unsplash.com/photo-1595514535215-188b0a94b4cf?auto=format&fit=crop&q=80&w=800", price: 26999, rating: 5, reviews: 9, category: "furniture", mainCategory: "dining", subcategory: "sideboard" },
  { id: "60", name: "Vintage Credenza", image: "https://images.unsplash.com/photo-1598442299849-0d9c4de4ba7d?auto=format&fit=crop&q=80&w=800", price: 31999, rating: 4, reviews: 6, category: "furniture", mainCategory: "dining", subcategory: "sideboard" },
  { id: "61", name: "Storage Buffet - 4 Doors", image: "https://images.unsplash.com/photo-1628131346067-17eb48a04fac?auto=format&fit=crop&q=80&w=800", price: 28999, rating: 5, reviews: 7, category: "furniture", mainCategory: "dining", subcategory: "sideboard" },
  // Extra bed (bedroom)
  { id: "62", name: "Double Bed - Fabric Headboard", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800", price: 27999, rating: 5, reviews: 11, category: "furniture", mainCategory: "bedroom", subcategory: "beds" },
  // Extra bedside-tables (bedroom)
  { id: "63", name: "Minimalist Nightstand", image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=800", price: 5499, rating: 4, reviews: 8, category: "furniture", mainCategory: "bedroom", subcategory: "bedside-tables" },
  { id: "64", name: "Oak Bedside Table", image: "https://images.unsplash.com/photo-1582562124578-8ba94c25f4b5?auto=format&fit=crop&q=80&w=800", price: 7999, rating: 5, reviews: 5, category: "furniture", mainCategory: "bedroom", subcategory: "bedside-tables" },
  { id: "65", name: "Floating Bedside Shelf", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800", price: 3999, rating: 4, reviews: 7, category: "furniture", mainCategory: "bedroom", subcategory: "bedside-tables" },
  // Extra dressers-mirrors (bedroom)
  { id: "66", name: "Vanity Table with Stool", image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=800", price: 24999, rating: 5, reviews: 6, category: "furniture", mainCategory: "bedroom", subcategory: "dressers-mirrors" },
  { id: "67", name: "Standing Mirror - Full Length", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800", price: 8999, rating: 4, reviews: 9, category: "furniture", mainCategory: "bedroom", subcategory: "dressers-mirrors" },
  { id: "68", name: "Compact Dressing Table", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800", price: 18999, rating: 5, reviews: 4, category: "furniture", mainCategory: "bedroom", subcategory: "dressers-mirrors" },
  // Mattress (bedroom)
  { id: "69", name: "Memory Foam Mattress - King", image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800", price: 24999, rating: 5, reviews: 14, category: "furniture", mainCategory: "bedroom", subcategory: "mattress" },
  { id: "70", name: "Pocket Spring Mattress - Queen", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800", price: 18999, rating: 4, reviews: 8, category: "furniture", mainCategory: "bedroom", subcategory: "mattress" },
  { id: "71", name: "Hybrid Mattress - Double", image: "https://images.unsplash.com/photo-1533000720448-958aed61476b?auto=format&fit=crop&q=80&w=800", price: 21999, oldPrice: 24999, save: 3000, rating: 5, reviews: 10, category: "furniture", mainCategory: "bedroom", subcategory: "mattress" },
  { id: "72", name: "Orthopaedic Mattress - Single", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800", price: 12999, rating: 5, reviews: 6, category: "furniture", mainCategory: "bedroom", subcategory: "mattress" },
  // Wardrobes (bedroom)
  { id: "73", name: "Sliding Door Wardrobe - 2 Door", image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=800", price: 44999, rating: 5, reviews: 12, category: "furniture", mainCategory: "bedroom", subcategory: "wardrobes" },
  { id: "74", name: "Walk-In Closet System", image: "https://images.unsplash.com/photo-1595526114101-1e90e79391de?auto=format&fit=crop&q=80&w=800", price: 59999, rating: 5, reviews: 5, category: "furniture", mainCategory: "bedroom", subcategory: "wardrobes" },
  { id: "75", name: "Freestanding Wardrobe - Oak", image: "https://images.unsplash.com/photo-1583847268964-b28ce8f31586?auto=format&fit=crop&q=80&w=800", price: 32999, rating: 4, reviews: 9, category: "furniture", mainCategory: "bedroom", subcategory: "wardrobes" },
  { id: "76", name: "Mirror Door Wardrobe", image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=800", price: 38999, rating: 5, reviews: 7, category: "furniture", mainCategory: "bedroom", subcategory: "wardrobes" },
  // Extra rugs (3+ total, unique images)
  { id: "77", name: "Persian Style Rug - 6x9", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800", price: 18999, rating: 5, reviews: 8, category: "rugs", mainCategory: "living" },
  { id: "78", name: "Boho Jute Rug", image: "https://images.unsplash.com/photo-1540638349517-3abd5afc5847?auto=format&fit=crop&q=80&w=800", price: 7999, rating: 4, reviews: 6, category: "rugs", mainCategory: "living" },
  // Kitchenware (3+, unique images)
  { id: "79", name: "Ceramic Dinnerware Set - 24pc", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800", price: 4999, rating: 5, reviews: 12, category: "kitchenware", mainCategory: "living" },
  { id: "80", name: "Stainless Steel Cookware Set", image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800", price: 8999, rating: 4, reviews: 9, category: "kitchenware", mainCategory: "living" },
  { id: "81", name: "Glass Storage Jars - Set of 4", image: "https://images.unsplash.com/photo-1556909172-545cc2e2d7ab?auto=format&fit=crop&q=80&w=800", price: 2499, rating: 5, reviews: 7, category: "kitchenware", mainCategory: "living" },
  // Wall covering (3+, unique images)
  { id: "82", name: "Textured Wallpaper Roll - Grey", image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=800", price: 3499, rating: 4, reviews: 5, category: "wall-covering", mainCategory: "living" },
  { id: "83", name: "Grasscloth Wall Covering", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=800", price: 5999, rating: 5, reviews: 4, category: "wall-covering", mainCategory: "living" },
  { id: "84", name: "Peel & Stick Wall Panels - Set", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800", price: 4299, rating: 4, reviews: 8, category: "wall-covering", mainCategory: "living" },
  // Toilet / bathroom (3+, unique images)
  { id: "85", name: "Modern Wall-Mounted Basin", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800", price: 12999, rating: 5, reviews: 6, category: "toilet", mainCategory: "living" },
  { id: "86", name: "Chrome Towel Rail - 60cm", image: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?auto=format&fit=crop&q=80&w=800", price: 3999, rating: 4, reviews: 5, category: "toilet", mainCategory: "living" },
  { id: "87", name: "Toilet Brush Set - Stainless", image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800", price: 899, rating: 5, reviews: 14, category: "toilet", mainCategory: "living" },
  // Scent diffusers (3+, unique images)
  { id: "88", name: "Reed Diffuser - Lavender", image: "https://images.unsplash.com/photo-1602874801006-4e411e29f52f?auto=format&fit=crop&q=80&w=800", price: 1499, rating: 5, reviews: 22, category: "scent-diffusers", mainCategory: "living" },
  { id: "89", name: "Electric Aroma Diffuser", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800", price: 2999, rating: 4, reviews: 11, category: "scent-diffusers", mainCategory: "living" },
  { id: "90", name: "Ceramic Scent Candle - Sandalwood", image: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?auto=format&fit=crop&q=80&w=800", price: 999, rating: 5, reviews: 9, category: "scent-diffusers", mainCategory: "living" },
  // Fitout / joinery (3+, unique images)
  { id: "91", name: "Custom Wardrobe - Sliding Doors", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800", price: 54999, rating: 5, reviews: 7, category: "fitout-joinery", mainCategory: "living" },
  { id: "92", name: "Built-In Shelving Unit", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800", price: 32999, rating: 4, reviews: 5, category: "fitout-joinery", mainCategory: "living" },
  { id: "93", name: "Custom Kitchen Cabinet Set", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", price: 89999, rating: 5, reviews: 4, category: "fitout-joinery", mainCategory: "living" },
  // Curtains (3+, unique images)
  { id: "94", name: "Linen Curtains - Pair (Natural)", image: "https://images.unsplash.com/photo-1524484485832-b57e5047d2b6?auto=format&fit=crop&q=80&w=800", price: 7999, rating: 5, reviews: 10, category: "curtains", mainCategory: "living" },
  { id: "95", name: "Blackout Curtains - Grey", image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800", price: 6499, rating: 4, reviews: 8, category: "curtains", mainCategory: "living" },
  { id: "96", name: "Sheer Voile Curtains - White", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800", price: 4499, rating: 5, reviews: 6, category: "curtains", mainCategory: "living" },
];

export function getProductsByCategory(category: CategorySlug): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductsByMainCategory(mainCategory: MainCategorySlug, subcategory?: string): Product[] {
  let list = products.filter((p) => p.mainCategory === mainCategory);
  if (subcategory) list = list.filter((p) => p.subcategory === subcategory);
  return list;
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.filter((p) => p.save != null || p.rating === 5).slice(0, limit);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getBestSellers(limit = 4): Product[] {
  return [...products].sort((a, b) => b.reviews - a.reviews).slice(0, limit);
}

export type SortOption = "popularity" | "price-asc" | "price-desc" | "new";
export type FilterCategory = MainCategorySlug | "all";

export function filterAndSortProducts(opts: {
  mainCategory?: FilterCategory;
  priceMin?: number;
  priceMax?: number;
  sort?: SortOption;
}): Product[] {
  let list = [...products];
  if (opts.mainCategory && opts.mainCategory !== "all") {
    list = list.filter((p) => p.mainCategory === opts.mainCategory);
  }
  if (opts.priceMin != null) list = list.filter((p) => p.price >= opts.priceMin!);
  if (opts.priceMax != null) list = list.filter((p) => p.price <= opts.priceMax!);
  switch (opts.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "new":
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case "popularity":
    default:
      list.sort((a, b) => b.reviews - a.reviews);
      break;
  }
  return list;
}
