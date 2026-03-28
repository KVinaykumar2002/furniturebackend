import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useApi";

const BestSellersNewArrivals = () => {
  const [activeTab, setActiveTab] = useState<"bestsellers" | "newarrivals">("bestsellers");
  const { addItem } = useCart();
  const { products: bestDealsProducts } = useProducts({ featured: true, limit: 12 });
  const { products: newArrivalsProducts } = useProducts({ bestSellers: true, limit: 12 });
  const list = activeTab === "bestsellers" ? bestDealsProducts : newArrivalsProducts;
  const railRef = useRef<HTMLDivElement | null>(null);

  const canScroll = list.length > 0;

  const scrollRail = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const amount = Math.max(320, Math.floor(el.clientWidth * 0.9));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 px-6 bg-muted/50">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
          <button
            type="button"
            onClick={() => setActiveTab("bestsellers")}
            className={`font-display text-xl md:text-2xl tracking-[0.15em] uppercase pb-2 border-b-2 transition-colors ${activeTab === "bestsellers"
              ? "text-foreground border-foreground"
              : "text-muted-foreground/60 border-transparent hover:text-muted-foreground"
              }`}
          >
            Best Deals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("newarrivals")}
            className={`font-display text-xl md:text-2xl tracking-[0.15em] uppercase pb-2 border-b-2 transition-colors ${activeTab === "newarrivals"
              ? "text-foreground border-foreground"
              : "text-muted-foreground/60 border-transparent hover:text-muted-foreground"
              }`}
          >
            New Arrivals
          </button>
        </div>
        <div className="relative">
          {canScroll ? (
            <>
              <button
                type="button"
                onClick={() => scrollRail(-1)}
                className="flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#D5CDC3] shadow-lg items-center justify-center text-foreground hover:bg-white transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollRail(1)}
                className="flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#D5CDC3] shadow-lg items-center justify-center text-foreground hover:bg-white transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}

          <div
            ref={railRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-2 px-2 scrollbar-hide"
          >
            {list.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col snap-start shrink-0 w-[min(220px,42vw)] sm:w-[240px] md:basis-[calc((100%-4.5rem)/4)] md:min-w-0"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                        })
                      }
                      className="w-full py-2.5 bg-neutral-900 text-white text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="pt-3">
                  <p className="text-xs tracking-[0.08em] text-muted-foreground uppercase line-clamp-2 leading-relaxed">
                    {product.name}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default BestSellersNewArrivals;
