import { useState, useEffect, useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

import hero2 from "@/assets/hero-2.jpg";
import heroNewFirst from "@/assets/hero-new-first.jpg";
import heroSaleBanner from "@/assets/hero-sale-banner.png";

const DEFAULT_SLIDES = [
  { image: heroNewFirst, title: "Modern Furniture for Inspired Living", subtitle: "Curate your space with elegance. Premium pieces for every room." },
  { image: hero2, title: "Timeless Design, Lasting Comfort", subtitle: "Discover collections that transform your home into a sanctuary." },
  { image: heroSaleBanner, title: "Best Deal Today — 20% Off", subtitle: "Premium furniture for every room. Limited time offer." },
];

const SLIDE_DURATION = 6000;

/** Avoid browser showing an old image for the same URL after CMS updates */
function cacheBustImageUrl(url: string, version: number) {
  if (!version || !url.trim()) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${version}`;
}

export default function HeroSection() {
  const { settings, isFetching, dataUpdatedAt } = useSiteSettings();

  /** Wait for the network round-trip so we never flash stale React Query cache or default slides before fresh API data */
  const heroReady = !isFetching;

  const slides = useMemo(() => {
    if (!heroReady) return [];
    const fromApi = settings?.heroSlides?.filter((s) => s?.image?.trim()) ?? [];
    if (fromApi.length > 0) {
      const v = dataUpdatedAt ?? 0;
      return fromApi.map((s) => ({
        image: cacheBustImageUrl(s.image, v),
        title: s.title || "",
        subtitle: s.subtitle || "",
      }));
    }
    return DEFAULT_SLIDES;
  }, [heroReady, settings?.heroSlides, dataUpdatedAt]);

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
    if (slides.length === 0) return;
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
      if (slides.length === 0) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (slides.length === 0) {
    return (
      <section
        className="relative w-full overflow-hidden min-h-[200px] aspect-[16/9] max-h-[70svh] sm:aspect-auto sm:max-h-none sm:h-[calc(100svh-64px)] sm:min-h-[calc(100svh-64px)]"
        aria-label="Hero carousel"
        aria-busy="true"
      >
        <div className="absolute inset-0 bg-hero" aria-hidden />
        <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-primary/15 animate-pulse" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-hero/95 via-hero/45 to-hero/88"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 px-4 safe-top safe-bottom">
          <Skeleton className="h-9 sm:h-11 md:h-12 w-full max-w-[18rem] sm:max-w-[28rem] rounded-md border border-primary/15 bg-nav/30 shadow-sm shadow-primary/10" />
          <Skeleton className="h-4 sm:h-5 w-full max-w-[14rem] sm:max-w-[22rem] rounded-md border border-primary/10 bg-nav/22" />
          <Loader2 className="h-7 w-7 text-primary-foreground/55 animate-spin mt-2" aria-hidden />
        </div>
        <span className="sr-only">Loading hero carousel…</span>
      </section>
    );
  }

  return (
    <section
      className="relative w-full overflow-hidden sm:h-[calc(100svh-64px)] sm:min-h-[calc(100svh-64px)]"
      aria-label="Hero carousel"
      aria-live="polite"
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`transition-opacity duration-1000 ease-in-out w-full sm:absolute sm:inset-0 sm:h-full ${
            i === current ? "relative z-[1] sm:absolute sm:inset-0" : "absolute inset-0 pointer-events-none"
          }`}
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <img
            src={slide.image}
            alt=""
            fetchPriority={i === current ? "high" : "low"}
            decoding="async"
            className={`w-full bg-hero object-center sm:absolute sm:inset-0 sm:h-full sm:w-full sm:object-cover ${
              i === current ? "relative block h-auto" : "absolute inset-0 h-full object-cover"
            }`}
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
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 safe-bottom">
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
