import { useEffect, useRef } from "react";

/**
 * Lightweight scroll-reveal hook using IntersectionObserver.
 * Adds "is-visible" class when the element enters the viewport.
 * Respects prefers-reduced-motion.
 *
 * Uses threshold 0 + rootMargin so sections don't stay stuck at opacity:0
 * (parent opacity hides all children until is-visible — strict thresholds caused blank blocks).
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.1) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const markVisible = () => {
      el.classList.add("is-visible");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markVisible();
      return;
    }

    let observer: IntersectionObserver | null = null;
    let raf = 0;

    raf = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const alreadyVisible =
        rect.top < vh && rect.bottom > 0 && rect.left < vw && rect.right > 0;
      if (alreadyVisible) {
        markVisible();
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            markVisible();
            observer?.unobserve(el);
          }
        },
        {
          /* Fire as soon as any pixel crosses; also honor requested ratio when reached */
          threshold: [0, Math.max(0.01, threshold)],
          rootMargin: "0px 0px 120px 0px",
        }
      );
      observer.observe(el);
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [threshold]);

  return ref;
}
