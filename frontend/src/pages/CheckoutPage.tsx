import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getWhatsAppOrderUrl } from "@/lib/constants";
import { toast } from "sonner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildOrderMessage = () => {
    const addressParts = [form.addressLine1];
    if (form.addressLine2.trim()) addressParts.push(form.addressLine2);
    const address = addressParts.join(", ") + `, ${form.city}, ${form.state} - ${form.pincode}`;
    const lines = [
      "🛒 *New Order*",
      "",
      "*Customer Details*",
      `Name: ${form.fullName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      "",
      "*Shipping Address*",
      address,
      "",
      "*Order Summary*",
      ...items.map((item) => `• ${item.name} x ${item.quantity}`),
      "",
      `*Total Items: ${items.reduce((sum, i) => sum + i.quantity, 0)}*`,
    ];
    return lines.join("\n");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const message = buildOrderMessage();
    window.open(getWhatsAppOrderUrl(message), "_blank", "noopener,noreferrer");
    setSubmitted(true);
    clearCart();
    toast.success("Opening WhatsApp with your order details.");
    navigate("/", { replace: true });
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 px-4 text-center">
          <p className="text-muted-foreground mb-6">Your cart is empty. Add items to checkout.</p>
          <Link
            to="/collections"
            className="inline-flex items-center justify-center h-12 px-8 bg-neutral-900 text-white font-medium uppercase tracking-wide text-sm"
          >
            Shop Now
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 md:py-12 px-4 pt-24 max-w-2xl">
        <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
          ← Back to Cart
        </Link>
        <h1 className="font-display text-2xl font-light text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="font-display text-lg font-light text-foreground mb-4">Customer details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="mb-1.5 block">Full name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="rounded-none h-11"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="mb-1.5 block">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="rounded-none h-11"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="mb-1.5 block">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="rounded-none h-11"
                  required
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-light text-foreground mb-4">Shipping address</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="addressLine1" className="mb-1.5 block">Address line 1 *</Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  placeholder="Street, building, flat no."
                  className="rounded-none h-11"
                  required
                />
              </div>
              <div>
                <Label htmlFor="addressLine2" className="mb-1.5 block">Address line 2 (optional)</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={form.addressLine2}
                  onChange={handleChange}
                  placeholder="Landmark, area"
                  className="rounded-none h-11"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="mb-1.5 block">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="rounded-none h-11"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="mb-1.5 block">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="rounded-none h-11"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="pincode" className="mb-1.5 block">Pincode *</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  className="rounded-none h-11 max-w-[180px]"
                  required
                />
              </div>
            </div>
          </section>

          <div className="pt-4 border-t border-border">
            <p className="flex justify-between text-foreground mb-6">
              <span>Items</span>
              <span className="font-semibold">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
            </p>
            <Button type="submit" className="w-full h-12 rounded-none" size="lg">
              Place order
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
