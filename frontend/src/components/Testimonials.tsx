import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Hyderabad",
    rating: 5,
    text: "DesignerZhub transformed our living room. The quality is exceptional and the team helped us choose the perfect pieces. Highly recommend!",
    avatar: "PS",
  },
  {
    name: "Rahul Mehta",
    role: "Mumbai",
    rating: 5,
    text: "From ordering to delivery, everything was smooth. The furniture looks even better in person. Will definitely order again.",
    avatar: "RM",
  },
  {
    name: "Anita Krishnan",
    role: "Chennai",
    rating: 4,
    text: "Beautiful designs and sturdy construction. The bedroom set we bought has become the highlight of our home.",
    avatar: "AK",
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-20 px-6 bg-muted">
      <div className="container">
        <p className="text-xs tracking-[0.3em] text-muted-foreground/60 uppercase mb-2 text-center">
          What our customers say
        </p>
        <h2 className="font-display text-2xl md:text-4xl font-light tracking-wider text-foreground mb-14 text-center">
          Testimonials
        </h2>
        <div className="max-w-2xl mx-auto relative">
          <div className="bg-card border border-border/50 rounded-sm p-8 md:p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/15 flex items-center justify-center font-display text-xl font-light text-primary">
              {testimonials[current].avatar}
            </div>
            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <blockquote className="text-foreground leading-relaxed mb-6">
              &ldquo;{testimonials[current].text}&rdquo;
            </blockquote>
            <p className="font-display text-lg font-light text-foreground">
              {testimonials[current].name}
            </p>
            <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
