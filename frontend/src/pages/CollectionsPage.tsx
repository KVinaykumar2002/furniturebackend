import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts, useShopCategories, useCategories } from "@/hooks/useApi";
import type { SortOption } from "@/data/products";
import { LayoutGrid, LayoutList, Rows2, ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type LayoutMode = "grid-2" | "grid-4" | "list";

const FILTER_SECTIONS = [
  { id: "product-type", label: "Product Type" },
  { id: "color", label: "Color" },
  { id: "size", label: "Size" },
  { id: "availability", label: "Availability" },
  { id: "product-location", label: "Product Location" },
  { id: "has-3d", label: "Has 3D" },
] as const;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Most Popular" },
  { value: "new", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const COLOR_OPTIONS = ["Black", "White", "Grey", "Brown", "Beige", "Blue"];
const SIZE_OPTIONS = ["S", "M", "L", "XL"];

/** Normalize color for filter comparison: trim, lowercase, treat Gray/Grey as same */
function normalizeColorForFilter(color: string): string {
  const n = (color || "").trim().toLowerCase();
  if (n === "gray") return "grey";
  return n;
}

type ProductTypeFilter =
  | "all"
  | { type: "mainCategory"; slug: string }
  | { type: "category"; slug: string };

export default function CollectionsPage() {
  const [productTypeFilter, setProductTypeFilter] = useState<ProductTypeFilter>("all");
  const [sort, setSort] = useState<SortOption>("popularity");
  const [layout, setLayout] = useState<LayoutMode>("grid-4");
  const [openFilter, setOpenFilter] = useState<string | null>("product-type");
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [productLocationShowroom, setProductLocationShowroom] = useState(false);
  const [productLocationWarehouse, setProductLocationWarehouse] = useState(false);
  const [has3dYes, setHas3dYes] = useState(false);
  const [has3dNo, setHas3dNo] = useState(false);

  const { list: shopCategoriesList } = useShopCategories();
  const { list: categoriesList } = useCategories();
  const { products: rawProducts, isPending, isError } = useProducts({
    mainCategory: productTypeFilter === "all" ? undefined : productTypeFilter.type === "mainCategory" ? productTypeFilter.slug : undefined,
    category: productTypeFilter === "all" ? undefined : productTypeFilter.type === "category" ? productTypeFilter.slug : undefined,
    sort,
  });

  const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const products = rawProducts.filter((p) => {
    if (selectedColors.size > 0) {
      const productColorNorm = normalizeColorForFilter(p.color ?? "");
      if (!productColorNorm) return false;
      const selectedNorm = [...selectedColors].map(normalizeColorForFilter);
      const colorMatch = selectedNorm.some((s) => s === productColorNorm);
      if (!colorMatch) return false;
    }
    if (selectedSizes.size > 0) {
      const productSize = (p.size || "").trim();
      const sizeMatch = productSize && selectedSizes.has(productSize);
      if (!sizeMatch) return false;
    }
    if (inStockOnly && p.inStock === false) return false;
    if (outOfStockOnly && p.inStock !== false) return false;
    if (productLocationShowroom || productLocationWarehouse) {
      const loc = (p.productLocation || "").toLowerCase();
      if (!loc) return false;
      if (productLocationShowroom && productLocationWarehouse) {
        if (loc !== "showroom" && loc !== "warehouse") return false;
      } else if (productLocationShowroom && loc !== "showroom") return false;
      else if (productLocationWarehouse && loc !== "warehouse") return false;
    }
    if (has3dYes || has3dNo) {
      if (p.has3d === undefined) return false;
      if (has3dYes && !p.has3d) return false;
      if (has3dNo && p.has3d) return false;
    }
    return true;
  });

  const hasActiveFilters =
    productTypeFilter !== "all" ||
    selectedColors.size > 0 ||
    selectedSizes.size > 0 ||
    inStockOnly ||
    outOfStockOnly ||
    productLocationShowroom ||
    productLocationWarehouse ||
    has3dYes ||
    has3dNo;

  const clearAllFilters = () => {
    setProductTypeFilter("all");
    setSelectedColors(new Set());
    setSelectedSizes(new Set());
    setInStockOnly(false);
    setOutOfStockOnly(false);
    setProductLocationShowroom(false);
    setProductLocationWarehouse(false);
    setHas3dYes(false);
    setHas3dNo(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 md:px-6">
        <div className="container">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">All Collections</span>
          </nav>

          <h1 className="font-display text-2xl md:text-3xl font-light text-foreground mb-8">
            All Collections
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter sidebar — flat, no rounded corners */}
            <aside className="lg:w-56 xl:w-64 shrink-0 border border-neutral-200 overflow-hidden">
              {FILTER_SECTIONS.map((section, index) => (
                <Collapsible
                  key={section.id}
                  open={openFilter === section.id}
                  onOpenChange={(open) =>
                    setOpenFilter(open ? section.id : null)
                  }
                >
                  <div
                    className={cn(
                      "border-b border-neutral-200",
                      index === 0 && "border-t-0"
                    )}
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-4 px-4 text-left text-sm font-medium uppercase tracking-wide text-foreground hover:bg-muted/30 transition-colors">
                      {section.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform",
                          openFilter === section.id && "rotate-180"
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 pt-0 space-y-3">
                        {section.id === "product-type" && (
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                              <input
                                type="radio"
                                name="product-type"
                                checked={productTypeFilter === "all"}
                                onChange={() => setProductTypeFilter("all")}
                              />
                              All
                            </label>
                            {shopCategoriesList.map((cat) => (
                              <label
                                key={`main-${cat.slug}`}
                                className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name="product-type"
                                  checked={productTypeFilter !== "all" && productTypeFilter.type === "mainCategory" && productTypeFilter.slug === cat.slug}
                                  onChange={() => setProductTypeFilter({ type: "mainCategory", slug: cat.slug })}
                                />
                                {cat.title}
                              </label>
                            ))}
                            {categoriesList.map((cat) => (
                              <label
                                key={`cat-${cat.slug}`}
                                className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name="product-type"
                                  checked={productTypeFilter !== "all" && productTypeFilter.type === "category" && productTypeFilter.slug === cat.slug}
                                  onChange={() => setProductTypeFilter({ type: "category", slug: cat.slug })}
                                />
                                {cat.title}
                              </label>
                            ))}
                          </div>
                        )}
                        {section.id === "color" && (
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {COLOR_OPTIONS.map((c) => (
                              <label
                                key={c}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedColors.has(c)}
                                  onChange={() => toggleSet(setSelectedColors, c)}
                                />
                                {c}
                              </label>
                            ))}
                          </div>
                        )}
                        {section.id === "size" && (
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {SIZE_OPTIONS.map((s) => (
                              <label
                                key={s}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedSizes.has(s)}
                                  onChange={() => toggleSet(setSelectedSizes, s)}
                                />
                                {s}
                              </label>
                            ))}
                          </div>
                        )}
                        {section.id === "availability" && (
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => {
                                  setInStockOnly(e.target.checked);
                                  if (e.target.checked) setOutOfStockOnly(false);
                                }}
                              />
                              In stock
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={outOfStockOnly}
                                onChange={(e) => {
                                  setOutOfStockOnly(e.target.checked);
                                  if (e.target.checked) setInStockOnly(false);
                                }}
                              />
                              Out of stock
                            </label>
                          </div>
                        )}
                        {section.id === "product-location" && (
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={productLocationShowroom}
                                onChange={(e) => setProductLocationShowroom(e.target.checked)}
                              />
                              Showroom
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={productLocationWarehouse}
                                onChange={(e) => setProductLocationWarehouse(e.target.checked)}
                              />
                              Warehouse
                            </label>
                          </div>
                        )}
                        {section.id === "has-3d" && (
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={has3dYes}
                                onChange={(e) => {
                                  setHas3dYes(e.target.checked);
                                  if (e.target.checked) setHas3dNo(false);
                                }}
                              />
                              Yes
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={has3dNo}
                                onChange={(e) => {
                                  setHas3dNo(e.target.checked);
                                  if (e.target.checked) setHas3dYes(false);
                                }}
                              />
                              No
                            </label>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar: layout toggles + sort */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLayout("grid-2")}
                    className={cn(
                      "p-2.5 border transition-colors",
                      layout === "grid-2"
                        ? "bg-muted border-neutral-400 text-foreground"
                        : "border-neutral-200 text-muted-foreground hover:bg-muted/50"
                    )}
                    aria-label="Grid 2 columns"
                  >
                    <Rows2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout("grid-4")}
                    className={cn(
                      "p-2.5 border transition-colors",
                      layout === "grid-4"
                        ? "bg-muted border-neutral-400 text-foreground"
                        : "border-neutral-200 text-muted-foreground hover:bg-muted/50"
                    )}
                    aria-label="Grid 4 columns"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout("list")}
                    className={cn(
                      "p-2.5 border transition-colors",
                      layout === "list"
                        ? "bg-muted border-neutral-400 text-foreground"
                        : "border-neutral-200 text-muted-foreground hover:bg-muted/50"
                    )}
                    aria-label="List view"
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                </div>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="h-10 px-3 border border-neutral-200 bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-neutral-400"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {isPending && <p className="text-sm text-muted-foreground mb-4">Loading...</p>}
              {isError && <p className="text-sm text-destructive mb-4">Failed to load products.</p>}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  {products.length} product{products.length !== 1 ? "s" : ""}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-sm font-medium text-foreground underline hover:no-underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div
                className={cn(
                  "gap-4 md:gap-6",
                  layout === "grid-2" && "grid grid-cols-2",
                  layout === "grid-4" &&
                  "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
                  layout === "list" && "flex flex-col gap-4"
                )}
              >
                {products.map((p, index) =>
                  layout === "list" ? (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="flex gap-4 p-4 border-b border-neutral-100 hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden shrink-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 py-1">
                        <p className="font-medium text-foreground line-clamp-2">
                          {p.name}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <ProductCard key={p.id} product={p} index={index} />
                  )
                )}
              </div>

              {products.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-sm">
                    No products match your filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="mt-4 text-sm font-medium text-foreground underline hover:no-underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
