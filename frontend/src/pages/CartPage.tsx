import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 md:py-12 px-4 pt-24">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-10 h-10 border border-neutral-200 bg-white text-foreground hover:bg-muted transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-2xl font-light text-foreground">Your Cart</h1>
        </div>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-6">Your cart is empty.</p>
            <Link
              to="/collections"
              className="inline-flex items-center justify-center h-12 px-8 bg-neutral-900 text-white font-medium uppercase tracking-wide text-sm"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-0">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-neutral-200"
                >
                  <div className="w-24 h-24 overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground line-clamp-2">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center border border-neutral-200">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="p-6 border border-neutral-200">
                <p className="flex justify-between text-foreground mb-4">
                  <span>Items</span>
                  <span className="font-semibold">
                    {items.reduce((sum, i) => sum + i.quantity, 0)}
                  </span>
                </p>
                <Link
                  to="/checkout"
                  className="block w-full h-12 bg-neutral-900 text-white font-medium hover:bg-neutral-800 flex items-center justify-center uppercase tracking-wide text-sm transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
