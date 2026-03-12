import { useState } from "react";
import { ShoppingCart } from "lucide-react";
// Local images removed to ensure 100% unique product images
import { useCart } from "@/context/CartContext";

const bestSellers = [
  { id: "bs-1", name: "Classic Oak Sideboard", image: "https://images.unsplash.com/photo-1595514535215-188b0a94b4cf?auto=format&fit=crop&q=80&w=600", price: 24999, rating: 5 },
  { id: "bs-2", name: "Velvet Lounge Chair", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600", price: 18999, rating: 4 },
];

const newArrivals = [
  { id: "na-1", name: "Minimal Pendant Lamp", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600", price: 4999, rating: 5 },
  { id: "na-2", name: "Scandinavian Coffee Table", image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=600", price: 12999, rating: 4 },
];

const BestSellersNewArrivals = () => {
  const [activeTab, setActiveTab] = useState<"bestsellers" | "newarrivals">("bestsellers");
  const { addItem } = useCart();

  const list = activeTab === "bestsellers" ? bestSellers : newArrivals;

  return (
    <section className="py-20 px-6 bg-muted/50">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
          <button
            type="button"
            onClick={() => setActiveTab("bestsellers")}
            className={`font-display text-xl md:text-2xl tracking-[0.15em] uppercase pb-2 border-b-2 transition-colors ${activeTab === "bestsellers"
              ? "text-foreground border-foreground"
              : "text-muted-foreground/60 border-transparent hover:text-muted-foreground"
              }`}
          >
            Recently Viewed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("newarrivals")}
            className={`font-display text-xl md:text-2xl tracking-[0.15em] uppercase pb-2 border-b-2 transition-colors ${activeTab === "newarrivals"
              ? "text-foreground border-foreground"
              : "text-muted-foreground/60 border-transparent hover:text-muted-foreground"
              }`}
          >
            New Arrivals
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {list.map((product) => (
            <article key={product.id} className="group flex flex-col">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
                    className="w-full py-2.5 bg-neutral-900 text-white text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="pt-3">
                <p className="text-xs tracking-[0.08em] text-muted-foreground uppercase line-clamp-2 leading-relaxed">
                  {product.name}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellersNewArrivals;
