import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { Product } from "@/data/products";

// Fallback when product image fails to load (no duplicate of any product)
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const ref = useScrollReveal<HTMLElement>();
  const [imgSrc, setImgSrc] = useState(product.image);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  // Stagger delay: 80ms per card, max 320ms
  const staggerDelay = Math.min(index * 80, 320);

  return (
    <article
      ref={ref}
      className="group flex flex-col animate-on-scroll"
      style={{ transitionDelay: `${staggerDelay}ms` }}
    >
      {/* Image — square, sharp corners, no shadow, soft hover scale */}
      <Link
        to={`/product/${product.id}`}
        className="block relative aspect-square overflow-hidden flex-shrink-0 bg-muted"
      >
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"
          onError={handleImageError}
        />

        {/* Wishlist — always visible */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-white"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${inWishlist ? "fill-red-500 text-red-500" : "text-neutral-700"
              }`}
          />
        </button>

        {/* Add to Cart — visible on mobile, hover on desktop */}
        <div className="absolute bottom-0 left-0 right-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              });
            }}
            className="w-full py-2.5 bg-neutral-900 text-white text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        </div>
      </Link>

      {/* Product info — flat, no card, no background */}
      <div className="pt-3 pb-1">
        <Link to={`/product/${product.id}`} className="block">
          <p className="text-xs font-normal text-neutral-600 uppercase tracking-wide line-clamp-2 leading-relaxed">
            {product.name}
          </p>
        </Link>
      </div>
    </article>
  );
}
