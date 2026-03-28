import { useRef, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import ProductCard from "@/components/ProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useProducts } from "@/hooks/useApi";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";

type TabId = "best-deals" | "new-arrivals";

const tabs: { id: TabId; label: string }[] = [
  { id: "best-deals", label: "BEST DEALS" },
  { id: "new-arrivals", label: "NEW ARRIVALS" },
];

const RAIL_CARD =
  "snap-start shrink-0 w-[min(220px,42vw)] sm:w-[240px] md:basis-[calc((100%-3.75rem)/4)] md:min-w-0";

function ProductRail({
  products,
  railRef,
}: {
  products: Product[];
  railRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          const el = railRef.current;
          if (!el) return;
          const amount = Math.max(320, Math.floor(el.clientWidth * 0.9));
          el.scrollBy({ left: -amount, behavior: "smooth" });
        }}
        className="flex absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#D5CDC3] shadow-lg items-center justify-center text-foreground hover:bg-white transition-colors"
        aria-label="Scroll products left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => {
          const el = railRef.current;
          if (!el) return;
          const amount = Math.max(320, Math.floor(el.clientWidth * 0.9));
          el.scrollBy({ left: amount, behavior: "smooth" });
        }}
        className="flex absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#D5CDC3] shadow-lg items-center justify-center text-foreground hover:bg-white transition-colors"
        aria-label="Scroll products right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div
        ref={railRef}
        className="flex gap-5 md:gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 px-12 sm:px-14 scrollbar-hide"
      >
        {products.map((product, index) => (
          <div key={product.id} className={RAIL_CARD}>
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShopByCategory() {
  const [activeTab, setActiveTab] = useState<TabId>("best-deals");
  const ref = useScrollReveal<HTMLDivElement>(0.08);
  const bestDealsRailRef = useRef<HTMLDivElement | null>(null);
  const newArrivalsRailRef = useRef<HTMLDivElement | null>(null);

  const { products: featuredProducts, isPending: pendingFeatured } = useProducts({
    featured: true,
    limit: 16,
  });
  const { products: newArrivalsProducts, isPending: pendingBest } = useProducts({
    bestSellers: true,
    limit: 16,
  });
  const isPending = pendingFeatured || pendingBest;

  return (
    <div ref={ref} className="animate-on-scroll">
      <SectionWrapper
        id="categories"
        subtitle="Featured Collections"
        subtitleClassName="text-sm"
        title=""
        className="bg-muted/30"
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-8 md:gap-14 mb-10 md:mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`font-semibold text-base md:text-lg tracking-[0.05em] uppercase transition-colors pb-1.5 border-b-2 -mb-0.5 font-sans text-muted-foreground ${
                  activeTab === tab.id
                    ? "border-muted-foreground"
                    : "border-transparent hover:text-foreground/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full max-w-[100vw] overflow-hidden">
            {isPending ? (
              <div className="py-12 px-12">
                <ProductGridSkeleton count={4} className="max-w-4xl mx-auto" />
              </div>
            ) : (
              <>
                {activeTab === "best-deals" && (
                  <div className="animate-in fade-in duration-300">
                    {featuredProducts.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No best deals yet.</p>
                    ) : (
                      <ProductRail products={featuredProducts} railRef={bestDealsRailRef} />
                    )}
                  </div>
                )}
                {activeTab === "new-arrivals" && (
                  <div className="animate-in fade-in duration-300">
                    {newArrivalsProducts.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No new arrivals yet. Mark products as New arrival in Admin.
                      </p>
                    ) : (
                      <ProductRail products={newArrivalsProducts} railRef={newArrivalsRailRef} />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
