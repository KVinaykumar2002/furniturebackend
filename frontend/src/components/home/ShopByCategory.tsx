import { useState } from "react";
import { Link } from "react-router-dom";
import SectionWrapper from "@/components/SectionWrapper";
import ProductCard from "@/components/ProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useProducts } from "@/hooks/useApi";

type TabId = "best-deals" | "new-arrivals";

const tabs: { id: TabId; label: string }[] = [
  { id: "best-deals", label: "BEST DEALS" },
  { id: "new-arrivals", label: "NEW ARRIVALS" },
];

export default function ShopByCategory() {
  const [activeTab, setActiveTab] = useState<TabId>("best-deals");
  const ref = useScrollReveal<HTMLDivElement>(0.08);
  const { products: featuredProducts, isPending: pendingFeatured } = useProducts({ featured: true, limit: 4 });
  const { products: bestSellersProducts, isPending: pendingBest } = useProducts({ bestSellers: true, limit: 4 });
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
              className={`font-semibold text-base md:text-lg tracking-[0.05em] uppercase transition-colors pb-1.5 border-b-2 -mb-0.5 font-sans text-muted-foreground ${activeTab === tab.id
                ? "border-muted-foreground"
                : "border-transparent hover:text-foreground/80"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full">
          {isPending ? (
            <div className="py-12 text-center text-muted-foreground">Loading...</div>
          ) : (
            <>
              {activeTab === "best-deals" && (
                <div className="animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
                    {featuredProducts.slice(0, 4).map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
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
              )}
              {activeTab === "new-arrivals" && (
                <div className="animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
                    {bestSellersProducts.slice(0, 4).map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
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
              )}
            </>
          )}
        </div>
      </div>
    </SectionWrapper>
    </div>
  );
}
