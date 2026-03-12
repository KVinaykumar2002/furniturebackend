import SectionWrapper from "@/components/SectionWrapper";
import ProductCard from "@/components/ProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useProducts } from "@/hooks/useApi";

export default function BestSellers() {
  const { products, isPending, isError } = useProducts({ bestSellers: true, limit: 4 });
  const ref = useScrollReveal<HTMLDivElement>(0.08);

  if (isPending) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;
  if (isError) return <div className="py-12 text-center text-destructive">Failed to load products.</div>;

  return (
    <div ref={ref} className="animate-on-scroll">
    <SectionWrapper subtitle="Just viewed" title="Recently Viewed" className="bg-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </SectionWrapper>
    </div>
  );
}
