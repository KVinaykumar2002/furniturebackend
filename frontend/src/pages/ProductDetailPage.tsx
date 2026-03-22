import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { ShoppingCart, Heart, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useProduct, useProducts } from "@/hooks/useApi";
import { addRecentlyViewedId } from "@/lib/recentlyViewed";
import { LoadingSection } from "@/components/ui/loader";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isPending: productPending, isError: productError } = useProduct(id);
  const { addItem } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const { products: relatedProducts } = useProducts({ featured: true, limit: 4 });

  /** Record only after a real product loads (valid page open), newest-first in localStorage */
  useEffect(() => {
    if (!product?.id || !id) return;
    if (String(product.id) !== String(id)) return;
    addRecentlyViewedId(product.id);
  }, [product?.id, id]);

  if (productPending) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-32">
          <LoadingSection label="Loading product…" size="lg" />
        </div>
        <Footer />
      </div>
    );
  }
  if (productError || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-md">
            <h1 className="font-display text-xl sm:text-2xl font-light text-foreground mb-2">Product not found</h1>
            <p className="text-muted-foreground text-sm mb-6">
              There is no product with this ID, or it may have been removed.
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-foreground font-medium underline hover:no-underline"
            >
              View all collections
            </Link>
            <span className="mx-2 text-muted-foreground">or</span>
            <Link to="/" className="text-primary font-medium underline hover:no-underline">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-4 sm:py-6 px-4 sm:px-5 md:px-6 max-w-[100vw] overflow-hidden">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 overflow-x-auto scrollbar-hide min-h-[44px] items-center"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-foreground transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link
            to="/collections"
            className="hover:text-foreground transition-colors shrink-0"
          >
            Collections
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground truncate max-w-[120px] sm:max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-16">
          {/* Image — square, sharp corners, no shadow */}
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover animate-fade-in-image"
            />
          </div>

          {/* Product Info — flat, no card */}
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-light text-foreground mb-4 sm:mb-6">
              {product.name}
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6 sm:mb-8">
              {product.description ||
                "Crafted with precision and care, this piece combines timeless design with exceptional comfort. Made from premium materials to ensure lasting quality and elegance in your space."}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
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
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 sm:px-8 bg-neutral-900 text-white font-medium hover:bg-neutral-800 hover:-translate-y-0.5 transition-all duration-300 ease-in-out uppercase tracking-wide text-sm w-full sm:w-auto touch-manipulation"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => toggle(product.id)}
                className={`inline-flex items-center justify-center gap-2 min-h-[48px] px-6 border transition-all duration-300 ease-in-out hover:-translate-y-0.5 w-full sm:w-auto touch-manipulation ${isInWishlist(product.id)
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
                  }`}
              >
                <Heart
                  className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-red-500" : ""
                    }`}
                />
                Wishlist
              </button>
            </div>

            {/* Product Details */}
            <div className="mt-10 pt-8 border-t border-neutral-200">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                Details
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Premium quality materials</li>
                <li>• Expert craftsmanship</li>
                <li>• Easy assembly</li>
                <li>• 2-year warranty included</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 md:mt-24 pt-8 border-t border-neutral-200">
          <h2 className="font-display text-xl md:text-2xl font-light text-foreground mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
