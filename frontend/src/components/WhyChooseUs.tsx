import { Truck, RotateCcw, CreditCard, Award } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above ₹5,000. Fast and reliable delivery across India.",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "Not satisfied? Return within 30 days for a full refund, no questions asked.",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Your data is protected with industry-standard encryption and secure checkout.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Handpicked materials and craftsmanship for furniture that lasts generations.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 px-6">
      <div className="container">
        <p className="text-xs tracking-[0.3em] text-muted-foreground/60 uppercase mb-2 text-center">
          The DesignerZhub difference
        </p>
        <h2 className="font-display text-2xl md:text-4xl font-light tracking-wider text-foreground mb-14 text-center">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="text-center p-6 rounded-sm border border-border/50 bg-card hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-7 h-7 text-primary" aria-hidden />
              </div>
              <h3 className="font-display text-xl font-light tracking-wide text-foreground mb-2">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
