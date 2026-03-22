import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Play, CheckCircle2, X } from "lucide-react";
import { useSiteSettings, type Testimonial, DEFAULT_TESTIMONIALS } from "@/hooks/useApi";

function getEmbedUrl(url: string): string | null {
  try {
    if (url.includes("youtube.com/watch") || url.includes("youtu.be/")) {
      const id = url.match(/(?:v=|\/)([\w-]{11})(?:\?|$)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (url.includes("vimeo.com")) {
      const id = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const { settings, isPending, isError } = useSiteSettings();
  const testimonials: Testimonial[] =
    settings?.testimonials?.length ? settings.testimonials : DEFAULT_TESTIMONIALS;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const step = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  if (isPending) {
    return (
      <section className="relative bg-[#E7E0D8] py-12 md:py-16 border-t border-[#D5CDC3]">
        <div className="container px-4 md:px-6 text-center py-16 text-muted-foreground text-sm">
          Loading testimonials…
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="relative bg-[#E7E0D8] py-12 md:py-16 border-t border-[#D5CDC3]">
        <div className="container px-4 md:px-6 text-center py-12 text-muted-foreground text-sm">
          Testimonials could not be loaded. Please refresh the page.
        </div>
      </section>
    );
  }

  /* No animate-on-scroll on the section: opacity:0 hid the whole block until scroll (same issue as Best sellers) */
  return (
    <section className="relative bg-[#E7E0D8] py-12 md:py-16 border-t border-[#D5CDC3]">
      <div className="container px-4 md:px-6 text-center mb-10 md:mb-12">
        <p className="tracking-[0.2em] text-muted-foreground uppercase font-sans text-xs mb-2">
          Testimonials
        </p>
        <h2 className="font-display text-2xl md:text-4xl font-light tracking-wide text-foreground">
          What Our Customers Say
        </h2>
      </div>

      <div className="container pl-4 pr-4 md:px-6">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 border border-[#D5CDC3] shadow flex items-center justify-center text-foreground hover:bg-white transition-colors"
          aria-label="Previous reviews"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth scrollbar-thin"
          style={{ scrollSnapType: "x proximity", scrollbarWidth: "thin" }}
        >
          {testimonials.map((t, i) => (
            <article
              key={`${t.name}-${i}`}
              className="flex-shrink-0 w-[320px] md:w-[360px] bg-[#FBF9F6] shadow-md border border-[#E7E0D8] overflow-hidden flex flex-col"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="relative aspect-[4/3] bg-[#E7E0D8] overflow-hidden">
                {t.imageUrl && !playingId ? (
                  <img src={t.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : playingId === i && t.videoUrl ? (
                  <div className="absolute inset-0 bg-black flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingId(null);
                      }}
                      className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-foreground hover:bg-white"
                      aria-label="Close video"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {getEmbedUrl(t.videoUrl) ? (
                      <iframe
                        src={getEmbedUrl(t.videoUrl)!}
                        title={`Video review from ${t.name}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={t.videoUrl}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                        onEnded={() => setPlayingId(null)}
                      />
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-[#E7E0D8]" aria-hidden />
                )}
                {t.videoUrl && playingId !== i && (
                  <button
                    type="button"
                    onClick={() => setPlayingId(i)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                    aria-label="Play video review"
                  >
                    <span className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg border border-white/50">
                      <Play className="w-7 h-7 text-foreground fill-foreground ml-1" />
                    </span>
                  </button>
                )}
              </div>

              <div className="relative px-5 pb-5 pt-0 flex flex-col flex-1">
                <div
                  className="relative -mt-8 mx-auto w-14 h-14 rounded-full bg-[#D5CDC3] flex items-center justify-center font-display text-lg font-medium text-foreground border-2 border-[#FBF9F6] shadow flex-shrink-0"
                  style={{ zIndex: 1 }}
                >
                  {t.avatar || t.name.slice(0, 2).toUpperCase()}
                  <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 w-5 h-5 text-amber-500 bg-[#FBF9F6] rounded-full" />
                </div>
                <p className="font-display text-base font-medium text-foreground text-center mt-3">
                  {t.name}
                </p>
                {t.role ? (
                  <p className="text-xs text-muted-foreground text-center mt-0.5">{t.role}</p>
                ) : null}
                <p className="text-sm text-muted-foreground text-center line-clamp-3 mt-1 flex-1 min-h-[3.75rem]">
                  {t.text}
                </p>
                <div className="flex justify-center gap-0.5 mt-3">
                  {Array.from({ length: Math.min(5, Math.max(1, t.rating)) }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 border border-[#D5CDC3] shadow flex items-center justify-center text-foreground hover:bg-white transition-colors"
          aria-label="Next reviews"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-center mt-8">
        <button
          type="button"
          className="px-8 py-3 rounded-lg bg-[#7A6A5E] text-primary-foreground font-medium text-sm tracking-wide hover:bg-[#6A5A4E] transition-colors shadow"
        >
          Show more reviews
        </button>
      </div>
    </section>
  );
}
