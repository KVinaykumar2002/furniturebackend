import ProductGrid from "@/components/ProductGrid";
import { useProducts } from "@/hooks/useApi";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

const FeaturedProducts = () => {
  const { products, isPending, isError } = useProducts({ featured: true, limit: 8 });
  if (isPending) return <div className="py-12"><ProductGridSkeleton count={8} /></div>;
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
