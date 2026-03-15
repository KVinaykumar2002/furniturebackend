import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useApi";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

export default function SneakPeek() {
  const { products, isPending, isError } = useProducts({ featured: true, limit: 8 });

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/collections"
            className="inline-block border border-muted-foreground/30 text-muted-foreground text-sm tracking-[0.15em] uppercase px-10 py-3 hover:bg-muted-foreground/5 transition-colors min-h-[44px] flex items-center justify-center"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
