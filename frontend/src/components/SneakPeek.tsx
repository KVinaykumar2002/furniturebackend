import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/useApi";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

export default function SneakPeek() {
  const { products, isPending, isError } = useProducts({ featured: true, limit: 8 });
  const railRef = useRef<HTMLDivElement | null>(null);

  const scrollRail = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const amount = Math.max(320, Math.floor(el.clientWidth * 0.9));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (isPending) {
    return (
      <section className="py-20 px-6 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] text-muted-foreground/60 uppercase mb-4">
              Featured Collections
            </p>
            <h2 className="font-display text-2xl md:text-4xl tracking-[0.15em] text-foreground uppercase">
              Best Deals
            </h2>
          </div>
          <ProductGridSkeleton count={8} className="max-w-5xl mx-auto" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-20 px-6 bg-muted">
        <div className="container text-center py-12">
          <p className="text-muted-foreground">Failed to load featured products.</p>
          <Link to="/collections" className="text-primary font-medium mt-2 inline-block">
            View all collections
          </Link>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-20 px-6 bg-muted">
        <div className="container text-center py-12">
          <p className="text-muted-foreground">No featured products yet.</p>
          <Link to="/collections" className="text-primary font-medium mt-2 inline-block">
            View all collections
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-muted">
      <div className="container">
        <div className="text-center mb-4">
          <p className="text-xs tracking-[0.3em] text-muted-foreground/60 uppercase mb-4">
            Featured Collections
          </p>
          <h2 className="font-display text-2xl md:text-4xl tracking-[0.15em] text-foreground border-b-2 border-primary pb-2 uppercase inline-block">
            Best Deals
          </h2>
        </div>

        <div className="relative mt-12">
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
          <div
            ref={railRef}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-2 px-2 scrollbar-hide"
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="snap-start shrink-0 w-[min(220px,42vw)] sm:w-[240px] md:basis-[calc((100%-3.75rem)/4)] md:min-w-0"
              >
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
