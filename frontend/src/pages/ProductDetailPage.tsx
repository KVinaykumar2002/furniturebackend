import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Heart, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useProduct, useProducts } from "@/hooks/useApi";
import { LoadingSection } from "@/components/ui/loader";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isPending: productPending, isError: productError } = useProduct(id);
  const { addItem } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const { products: relatedProducts } = useProducts({ featured: true, limit: 4 });

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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-32 text-center">
          <p className="text-muted-foreground mb-4">Product not found.</p>
          <Link to="/" className="text-primary font-medium">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-6 px-4 md:px-6">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to="/collections"
            className="hover:text-foreground transition-colors"
          >
            Collections
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Image — square, sharp corners, no shadow */}
          <div className="aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover animate-fade-in-image"
            />
          </div>

          {/* Product Info — flat, no card */}
          <div className="flex flex-col justify-center opacity-0 animate-content-reveal">
            <h1 className="font-display text-2xl md:text-3xl font-light text-foreground mb-6">
              {product.name}
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {product.description ||
                "Crafted with precision and care, this piece combines timeless design with exceptional comfort. Made from premium materials to ensure lasting quality and elegance in your space."}
            </p>

            <div className="flex flex-wrap gap-3">
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
                className="inline-flex items-center gap-2 h-12 px-8 bg-neutral-900 text-white font-medium hover:bg-neutral-800 hover:-translate-y-0.5 transition-all duration-300 ease-in-out uppercase tracking-wide text-sm"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => toggle(product.id)}
                className={`inline-flex items-center gap-2 h-12 px-6 border transition-all duration-300 ease-in-out hover:-translate-y-0.5 ${isInWishlist(product.id)
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
