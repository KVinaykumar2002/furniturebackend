import ProductGrid from "@/components/ProductGrid";
import { useProducts } from "@/hooks/useApi";

const FeaturedProducts = () => {
  const { products, isPending, isError } = useProducts({ featured: true, limit: 8 });
  if (isPending) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;
  if (isError) return <div className="py-12 text-center text-destructive">Failed to load products.</div>;
  return (
    <ProductGrid
      products={products}
      title="Featured Products"
      sectionId="featured"
      showViewAll
    />
  );
};

export default FeaturedProducts;
