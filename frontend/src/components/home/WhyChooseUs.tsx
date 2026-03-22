import SectionWrapper from "@/components/SectionWrapper";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Truck, CreditCard, Award } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", description: "Fast and reliable delivery across Hyderabad." },
  { icon: CreditCard, title: "Secure Payment", description: "Industry-standard encryption & secure checkout.", showPaymentIcons: true },
  { icon: Award, title: "Premium Quality", description: "Handpicked materials & craftsmanship that lasts." },
];

const paymentIcons = [
  { name: "Visa", svg: <svg viewBox="0 0 48 16" className="h-6 w-auto" aria-hidden><rect width="48" height="16" rx="2" fill="#1A1F71"/><text x="24" y="11" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="Arial">VISA</text></svg> },
  { name: "Mastercard", svg: <svg viewBox="0 0 24 16" className="h-6 w-auto" aria-hidden><rect width="24" height="16" rx="2" fill="#fff" stroke="#ddd" strokeWidth="0.5"/><circle cx="9" cy="8" r="5" fill="#EB001B"/><circle cx="15" cy="8" r="5" fill="#F79E1B"/><path fill="#FF5F00" d="M12 5.2a5 5 0 0 0-2.5 4.3 5 5 0 0 0 5 5 5 5 0 0 0 2.5-4.3 5 5 0 0 0-5-5z"/></svg> },
  { name: "RuPay", svg: <svg viewBox="0 0 40 16" className="h-6 w-auto" aria-hidden><rect width="40" height="16" rx="2" fill="#004C8F"/><text x="20" y="11" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold" fontFamily="Arial">RuPay</text></svg> },
  { name: "UPI", svg: <svg viewBox="0 0 32 16" className="h-6 w-auto" aria-hidden><rect width="32" height="16" rx="2" fill="#fff" stroke="#ddd" strokeWidth="0.5"/><text x="16" y="11" textAnchor="middle" fill="#333" fontSize="8" fontWeight="bold" fontFamily="Arial">UPI</text></svg> },
];

export default function WhyChooseUs() {
  const ref = useScrollReveal<HTMLDivElement>(0.08);
  return (
    <div ref={ref} className="animate-on-scroll">
    <SectionWrapper subtitle="Why us" title="Why Choose Us" className="bg-muted/30">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {features.map(({ icon: Icon, title, description, showPaymentIcons }, i) => (
          <div
            key={title}
            className={`animate-on-scroll-child stagger-${i + 1} text-center p-6 transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="w-14 h-14 mx-auto mb-5 bg-primary/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-light text-foreground mb-3">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            {showPaymentIcons && (
              <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap items-center justify-center gap-3" aria-label="Accepted payment methods">
                {paymentIcons.map(({ name, svg }) => (
                  <span key={name} className="inline-flex items-center opacity-90" title={name}>
                    {svg}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
    </div>
  );
}
