import { Link } from "react-router-dom";
import SectionWrapper from "@/components/SectionWrapper";
import ProductCard from "@/components/ProductCard";
import { useRecentlyViewedProducts } from "@/hooks/useApi";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

const DISPLAY_LIMIT = 4;

export default function RecentlyViewed() {
  const { ids, products, isPending, isError } = useRecentlyViewedProducts();
  const visible = products.slice(0, DISPLAY_LIMIT);

  if (ids.length === 0) {
    return (
      <SectionWrapper subtitle="Just viewed" title="Recently viewed" className="bg-white">
        <p className="text-center text-muted-foreground py-8 max-w-md mx-auto">
          Products you open will appear here.{" "}
          <Link to="/collections" className="text-foreground font-medium underline hover:no-underline">
            Browse collections
          </Link>
        </p>
      </SectionWrapper>
    );
  }

  if (isPending) {
    return (
      <div className="py-12">
        <ProductGridSkeleton count={Math.min(ids.length, DISPLAY_LIMIT)} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center text-destructive">
        Failed to load recently viewed products.
      </div>
    );
  }

  return (
    <SectionWrapper subtitle="Just viewed" title="Recently viewed" className="bg-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {visible.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-8">
            Those products are no longer available.{" "}
            <Link to="/collections" className="text-foreground font-medium underline hover:no-underline">
              Browse collections
            </Link>
          </p>
        ) : (
          visible.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))
        )}
      </div>
    </SectionWrapper>
  );
}
