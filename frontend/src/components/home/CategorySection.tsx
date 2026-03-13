import { useState } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  furnitureSubTabs,
  getFurnitureGridBySub,
  type FurnitureSubSlug,
} from "@/data/categorySection";
import { useProducts, useCategories } from "@/hooks/useApi";

const FURNITURE_SLUG = "furniture";

/** Fallback when a category or product image fails to load */
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600";

/**
 * Category section: CATEGORIES heading, one-line main nav (from API), INDOOR/OUTDOOR/OFFICE for Furniture,
 * and product grid per category.
 */
export default function CategorySection() {
  const { list: categoryList } = useCategories();
  const [mainCategory, setMainCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<FurnitureSubSlug>("indoor");

  const mainCategoryTabs = categoryList.map((c) => ({ slug: c.slug, label: c.title }));
  const effectiveMain =
    mainCategory && mainCategoryTabs.some((t) => t.slug === mainCategory)
      ? mainCategory
      : mainCategoryTabs[0]?.slug ?? "";
  const isFurniture = effectiveMain === FURNITURE_SLUG;
  const isAll = effectiveMain === "all";
  const gridItems = getFurnitureGridBySub(subCategory);
  const { products: categoryProducts } = useProducts(
    isFurniture || isAll ? undefined : { category: effectiveMain }
  );
  const ref = useScrollReveal<HTMLElement>(0.08);

  return (
    <section
      ref={ref}
      className="animate-on-scroll py-10 md:py-14 px-4 md:px-6"
    >
      <div className="container max-w-7xl mx-auto">
        <p className="text-center mb-6 tracking-[0.2em] text-muted-foreground uppercase font-sans text-base">
          Categories
        </p>

        <nav
          className="category-main-nav flex flex-nowrap justify-start sm:justify-center items-center gap-4 mb-8 overflow-x-auto scroll-smooth scrollbar-thin px-1 -mx-1"
          aria-label="Main categories"
          style={{ scrollbarWidth: "thin" }}
        >
          {mainCategoryTabs.map((tab) => (
            <button
              key={tab.slug}
              type="button"
              onClick={() => setMainCategory(tab.slug)}
              className="category-main-nav-item shrink-0 whitespace-nowrap uppercase font-medium tracking-wide transition-colors pb-1 border-b-2 -mb-px py-1"
              style={{
                fontFamily: "Lato, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                color: effectiveMain === tab.slug ? "#3d3832" : "#8a8378",
                borderBottomColor: effectiveMain === tab.slug ? "#3d3832" : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <style>{`
          .category-main-nav { gap: clamp(0.5rem, 1.5vw, 1.5rem); -webkit-overflow-scrolling: touch; }
          .category-main-nav::-webkit-scrollbar { height: 6px; }
          .category-main-nav::-webkit-scrollbar-track { background: transparent; }
          .category-main-nav::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
          .category-main-nav-item { font-size: clamp(0.75rem, 1.25vw, 0.95rem); }
        `}</style>

        {/* Sub-category: INDOOR / OUTDOOR / OFFICE (only when Furniture is selected) */}
        {isFurniture && (
          <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
            {furnitureSubTabs.map((tab, index) => (
              <span key={tab.slug} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-[#8a8378]" style={{ fontSize: "clamp(0.8rem, 1.1vw, 0.9rem)" }}>
                    /
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSubCategory(tab.slug)}
                  className="uppercase font-medium tracking-wide transition-colors pb-1 border-b-2 -mb-px"
                  style={{
                    fontFamily: "Lato, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(0.8rem, 1.1vw, 0.9rem)",
                    color: subCategory === tab.slug ? "#3d3832" : "#8a8378",
                    borderBottomColor: subCategory === tab.slug ? "#3d3832" : "transparent",
                  }}
                >
                  {tab.label}
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Grid: furniture sub-grid or category products */}
        <div
          className="grid gap-4 md:gap-6"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: "1fr",
          }}
        >
          {isFurniture
            ? gridItems.map((item) => (
                <Link
                  key={item.slug}
                  to={item.href}
                  className="group flex flex-col items-center text-decoration-none text-inherit"
                >
                  <div
                    className="w-full max-w-[140px] md:max-w-[160px] aspect-[4/3] overflow-hidden mb-2 md:mb-3"
                    style={{ filter: "sepia(0.15) contrast(1.02)" }}
                  >
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <span
                    className="text-center uppercase font-medium tracking-wide"
                    style={{
                      fontFamily: "Lato, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
                      color: "#3d3832",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              ))
            : categoryProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group flex flex-col items-center text-decoration-none text-inherit"
                >
                  <div
                    className="w-full max-w-[140px] md:max-w-[160px] aspect-[4/3] overflow-hidden mb-2 md:mb-3"
                    style={{ filter: "sepia(0.15) contrast(1.02)" }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <span
                    className="text-center uppercase font-medium tracking-wide"
                    style={{
                      fontFamily: "Lato, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                      fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
                      color: "#3d3832",
                      lineHeight: 1.3,
                    }}
                  >
                    {product.name}
                  </span>
                </Link>
              ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/collections"
            className="inline-flex items-center justify-center h-12 px-8 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors uppercase tracking-wide text-sm"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
