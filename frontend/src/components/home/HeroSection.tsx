import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import hero2 from "@/assets/hero-2.jpg";
import heroNewFirst from "@/assets/hero-new-first.jpg";
import heroSaleBanner from "@/assets/hero-sale-banner.png";

const slides = [
  {
    image: heroNewFirst,
    title: "Modern Furniture for Inspired Living",
    subtitle: "Curate your space with elegance. Premium pieces for every room.",
  },
  {
    image: hero2,
    title: "Timeless Design, Lasting Comfort",
    subtitle: "Discover collections that transform your home into a sanctuary.",
  },
  {
    image: heroSaleBanner,
    title: "Best Deal Today — 20% Off",
    subtitle: "Premium furniture for every room. Limited time offer.",
  },
];

const SLIDE_DURATION = 6000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  const goTo = useCallback((index: number) => {
    setTextVisible(false);
    setTimeout(() => {
      setCurrent(index);
      setProgress(0);
      setTextVisible(true);
    }, 300);
  }, []);

  const goPrev = () => goTo((current - 1 + slides.length) % slides.length);
  const goNext = () => goTo((current + 1) % slides.length);

  // Auto-advance with progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          goTo((current + 1) % slides.length);
          return 0;
        }
        return p + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [current, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <section
      className="relative w-full min-h-screen h-screen overflow-hidden"
      aria-label="Hero carousel"
      aria-live="polite"
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        <h1
          className={`font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-wide text-white text-shadow-hero mb-4 transition-all duration-700 ${textVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
            }`}
        >
          {slides[current].title}
        </h1>
        <p
          className={`text-lg md:text-xl text-white/90 font-light mb-8 max-w-xl transition-all duration-700 delay-150 ${textVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
            }`}
        >
          {slides[current].subtitle}
        </p>
        <div
          className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-300 ${textVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
            }`}
        >
          <Link
            to="/#featured"
            className="inline-flex items-center justify-center h-12 px-8 bg-white text-neutral-900 font-medium hover:bg-white/90 transition-colors uppercase tracking-wide text-sm"
          >
            Shop Now
          </Link>
          <Link
            to="/collections"
            className="inline-flex items-center justify-center h-12 px-8 border-2 border-white text-white font-medium hover:bg-white/10 transition-colors uppercase tracking-wide text-sm"
          >
            Explore Collection
          </Link>
        </div>
      </div>



      {/* Progress-bar style indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative h-0.5 overflow-hidden bg-white/30"
            style={{ width: i === current ? "2rem" : "1rem" }}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
          >
            {i === current && (
              <div
                className="absolute inset-y-0 left-0 bg-white transition-none"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
