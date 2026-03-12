import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only – no backend
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-md py-24 px-4">
        <h1 className="font-display text-2xl font-light text-foreground mb-8 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 border border-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 border border-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
          <button type="submit" className="w-full h-12 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors uppercase tracking-wide text-sm">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account? <Link to="/register" className="text-primary font-medium">Register</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}
