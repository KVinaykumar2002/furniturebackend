import { useState, useEffect, useCallback, useMemo } from "react";
import { useSiteSettings } from "@/hooks/useApi";

import hero2 from "@/assets/hero-2.jpg";
import heroNewFirst from "@/assets/hero-new-first.jpg";
import heroSaleBanner from "@/assets/hero-sale-banner.png";

const DEFAULT_SLIDES = [
  { image: heroNewFirst, title: "Modern Furniture for Inspired Living", subtitle: "Curate your space with elegance. Premium pieces for every room." },
  { image: hero2, title: "Timeless Design, Lasting Comfort", subtitle: "Discover collections that transform your home into a sanctuary." },
  { image: heroSaleBanner, title: "Best Deal Today — 20% Off", subtitle: "Premium furniture for every room. Limited time offer." },
];

const SLIDE_DURATION = 6000;

export default function HeroSection() {
  const { settings } = useSiteSettings();
  const slides = useMemo(() => {
    const fromApi = settings?.heroSlides?.filter((s) => s?.image?.trim()) ?? [];
    if (fromApi.length > 0) {
      return fromApi.map((s) => ({ image: s.image, title: s.title || "", subtitle: s.subtitle || "" }));
    }
    return DEFAULT_SLIDES;
  }, [settings?.heroSlides]);

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [slides.length, current]);

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
  }, [current, goTo, slides.length]);

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
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4 sm:px-6 safe-top safe-bottom">
        <h1
          className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-wide text-white text-shadow-hero mb-3 sm:mb-4 transition-all duration-700 ${textVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
            }`}
        >
          {slides[current].title}
        </h1>
        <p
          className={`text-base sm:text-lg md:text-xl text-white/90 font-light mb-6 sm:mb-8 max-w-xl mx-auto transition-all duration-700 delay-150 ${textVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
            }`}
        >
          {slides[current].subtitle}
        </p>
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
