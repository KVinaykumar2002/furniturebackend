import SectionWrapper from "@/components/SectionWrapper";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Truck, RotateCcw, CreditCard, Award } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", description: "On orders above ₹5,000. Fast delivery across India." },
  { icon: RotateCcw, title: "30-Day Returns", description: "Not satisfied? Full refund, no questions asked." },
  { icon: CreditCard, title: "Secure Payment", description: "Industry-standard encryption & secure checkout." },
  { icon: Award, title: "Premium Quality", description: "Handpicked materials & craftsmanship that lasts." },
];

export default function WhyChooseUs() {
  const ref = useScrollReveal<HTMLDivElement>(0.08);
  return (
    <div ref={ref} className="animate-on-scroll">
    <SectionWrapper subtitle="Why us" title="Why Choose Us" className="bg-muted/30">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {features.map(({ icon: Icon, title, description }, i) => (
          <div
            key={title}
            className={`animate-on-scroll-child stagger-${i + 1} text-center p-6 transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="w-14 h-14 mx-auto mb-5 bg-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-light text-foreground mb-3">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
    </div>
  );
}
