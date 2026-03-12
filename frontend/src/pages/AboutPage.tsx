import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import hero2 from "@/assets/hero-2.jpg";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-24 pb-20 overflow-hidden">
        <img src={hero2} alt="" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-display text-4xl md:text-5xl font-light text-white">About Us</h1>
        </div>
      </section>
      <div className="container max-w-3xl py-16 px-4">
        <section id="brand-story" className="mb-16">
          <h2 className="font-display text-2xl font-light text-foreground mb-6">Brand Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            DesignerZhub is your destination for exclusive luxury home interiors. We curate spaces that tell your story with elegance and precision.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Based in Hyderabad, we serve clients across India who value quality craftsmanship and timeless design.
          </p>
        </section>
        <section id="philosophy" className="mb-16">
          <h2 className="font-display text-2xl font-light text-foreground mb-6">Our Philosophy</h2>
          <p className="text-muted-foreground leading-relaxed">
            From modern minimalism to classic elegance, we help you create a home that reflects your taste and lifestyle. Visit our showroom or explore online—we are here to help you design the space you have always imagined.
          </p>
        </section>
        <Link to="/#contact" className="inline-flex items-center justify-center h-12 px-8 border border-foreground/40 font-medium hover:bg-muted/50 uppercase tracking-wide text-sm">
          Contact Us
        </Link>
      </div>
      <Footer />
    </div>
  );
}
