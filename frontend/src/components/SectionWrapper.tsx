import type { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  subtitleClassName?: string;
}

export default function SectionWrapper({ children, className = "", id, title, subtitle, subtitleClassName }: SectionWrapperProps) {
  return (
    <section id={id} className={`py-16 md:py-20 px-4 md:px-6 ${className}`}>
      <div className="container">
        {(title || subtitle) && (
          <div
            className={`text-center ${title ? "mb-10 md:mb-12" : "mb-6 md:mb-8"}`}
          >
            {subtitle && (
              <p className={`tracking-[0.2em] text-muted-foreground uppercase font-sans ${subtitleClassName ?? "text-xs"}`}>
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-display text-2xl md:text-4xl font-light tracking-wide text-foreground mt-2">
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
