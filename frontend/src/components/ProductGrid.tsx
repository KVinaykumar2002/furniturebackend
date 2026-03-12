import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";

interface ProductGridProps {
  products: Product[];
  title?: string;
  sectionId?: string;
  showViewAll?: boolean;
}

const ProductGrid = ({ products, title, sectionId, showViewAll = false }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <section id={sectionId} className="py-20 px-6 bg-muted">
        <div className="container text-center py-12">
          <p className="text-muted-foreground">No products in this category yet. Check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section id={sectionId} className="py-20 px-6 bg-muted">
      <div className="container">
        {title && (
          <>
            <p className="text-xs tracking-[0.3em] text-muted-foreground/60 uppercase mb-2 text-center">
              Curated picks
            </p>
            <h2 className="font-display text-2xl md:text-4xl font-light tracking-wider text-foreground mb-12 text-center">
              {title}
            </h2>
          </>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        {showViewAll && (
          <div className="text-center mt-12">
            <Link
              to="/#featured"
              className="inline-block border border-muted-foreground/30 text-muted-foreground text-sm tracking-[0.15em] uppercase px-10 py-3 hover:bg-muted-foreground/5 transition-colors min-h-[44px] flex items-center justify-center"
            >
              View All
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
