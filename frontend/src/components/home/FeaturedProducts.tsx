import { Link } from "react-router-dom";
import SectionWrapper from "@/components/SectionWrapper";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useApi";

export default function FeaturedProducts() {
  const { products, isPending, isError } = useProducts({ featured: true, limit: 8 });

  if (isPending) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;
  if (isError) return <div className="py-12 text-center text-destructive">Failed to load products.</div>;

  return (
    <SectionWrapper
      id="featured"
      subtitle="Curated picks"
      title="Featured Products"
      className="bg-white"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      <div className="text-center mt-10">
        <Link
          to="/collections"
          className="inline-flex items-center justify-center h-12 px-8 border border-muted-foreground/30 text-muted-foreground font-medium hover:bg-muted/50 transition-colors uppercase tracking-wide text-sm"
        >
          View All
        </Link>
      </div>
    </SectionWrapper>
  );
}
