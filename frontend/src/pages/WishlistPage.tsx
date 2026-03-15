import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/hooks/useApi";

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const { products, isPending, isError } = useProducts();
  const wishlistProducts = products.filter((p) => wishlistIds.has(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6 sm:py-8 md:py-12 px-4 sm:px-5 pt-20 sm:pt-24">
        <h1 className="font-display text-xl sm:text-2xl font-light text-foreground mb-6 sm:mb-8">Wishlist</h1>
        {isPending && (
          <div className="py-8">
            <ProductGridSkeleton count={4} />
          </div>
        )}
        {isError && <p className="text-destructive py-8">Failed to load products.</p>}
        {!isPending && !isError && wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-6">Your wishlist is empty.</p>
            <Link to="/collections" className="inline-flex items-center justify-center h-12 px-8 bg-neutral-900 text-white font-medium uppercase tracking-wide text-sm">
              Shop Now
            </Link>
          </div>
        ) : !isPending && !isError ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {wishlistProducts.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
}
