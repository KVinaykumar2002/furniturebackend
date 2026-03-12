import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts, useShopCategories } from "@/hooks/useApi";
import type { SortOption, FilterCategory } from "@/data/products";
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
];

export default function CollectionsPage() {
  const [category, setCategory] = useState<FilterCategory>("all");
  const [sort, setSort] = useState<SortOption>("popularity");
  const [layout, setLayout] = useState<LayoutMode>("grid-4");
  const [openFilter, setOpenFilter] = useState<string | null>("product-type");

  const { shopCategorySlugs } = useShopCategories();
  const { products, isPending, isError } = useProducts({
    mainCategory: category === "all" ? undefined : category,
    sort,
  });

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
                                checked={category === "all"}
                                onChange={() => setCategory("all")}
                              />
                              All
                            </label>
                            {shopCategorySlugs.map((slug) => (
                              <label
                                key={slug}
                                className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name="product-type"
                                  checked={category === slug}
                                  onChange={() => setCategory(slug)}
                                />
                                {slug.charAt(0).toUpperCase() + slug.slice(1)}
                              </label>
                            ))}
                          </div>
                        )}
                        {section.id === "color" && (
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {["Black", "White", "Grey", "Brown", "Beige", "Blue"].map(
                              (c) => (
                                <label
                                  key={c}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <input type="checkbox" />
                                  {c}
                                </label>
                              )
                            )}
                          </div>
                        )}
                        {section.id === "size" && (
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {["S", "M", "L", "XL"].map((s) => (
                              <label
                                key={s}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <input type="checkbox" />
                                {s}
                              </label>
                            ))}
                          </div>
                        )}
                        {section.id === "availability" && (
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" defaultChecked />
                              In stock
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" />
                              Out of stock
                            </label>
                          </div>
                        )}
                        {section.id === "product-location" && (
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" />
                              Showroom
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" />
                              Warehouse
                            </label>
                          </div>
                        )}
                        {section.id === "has-3d" && (
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" />
                              Yes
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" defaultChecked />
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
              <p className="text-sm text-muted-foreground mb-4">
                {products.length} products
              </p>

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
                    onClick={() => setCategory("all")}
                    className="mt-4 text-sm font-medium text-foreground underline"
                  >
                    Clear filters
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
