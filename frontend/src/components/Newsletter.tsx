import { useState } from "react";
import { Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // UI only - no backend
      setEmail("");
    }
  };

  return (
    <section className="py-20 px-6 border-t border-border">
      <div className="container max-w-xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
          <Mail className="w-7 h-7 text-primary" aria-hidden />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-light tracking-wider text-foreground mb-2">
          Stay in the loop
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          Subscribe for new arrivals, exclusive offers and design inspiration.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 min-w-0 h-12 px-4 rounded-sm border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            required
            aria-label="Email address"
          />
          <button
            type="submit"
            className="h-12 px-8 bg-primary text-primary-foreground text-sm font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors rounded-sm min-h-[44px]"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
