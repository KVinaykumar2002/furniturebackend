import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const slides = [hero1, hero2];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] min-h-[500px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img src={slide} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-wider text-primary-foreground text-shadow-hero mb-4">
          Modern Furniture for Inspired Living
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 font-light mb-8 max-w-xl">
          Curate your space with elegance. Premium pieces for every room.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#featured"
            className="bg-primary-foreground text-foreground text-sm px-8 py-3.5 hover:bg-primary-foreground/90 transition-colors min-h-[44px] inline-flex items-center justify-center"
          >
            Shop Now
          </a>
          <a
            href="#categories"
            className="border border-primary-foreground/80 text-primary-foreground text-sm px-8 py-3.5 hover:bg-primary-foreground/10 transition-colors min-h-[44px] inline-flex items-center justify-center"
          >
            Explore Collection
          </a>
        </div>
      </div>

      <button
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-0.5 transition-all ${i === current ? "w-8 bg-primary-foreground" : "w-4 bg-primary-foreground/40"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
