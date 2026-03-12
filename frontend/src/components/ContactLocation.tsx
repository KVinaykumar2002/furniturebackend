import { MapPin, Phone, Globe } from "lucide-react";

const MAP_LINK = "https://maps.app.goo.gl/nuu48w3k8SECmGEdA";
const ADDRESS =
  "F963+6C, Shop No 101 & 102, TVRR Majestic Botanical Garden Lane, Opp Chirec Public School, Kobdpur, Hyderabad, Telangana 500084";

const ContactLocation = () => {
  return (
    <section id="contact" className="bg-footer text-footer-foreground py-14 md:py-16">
      <div className="container px-6 space-y-12">
        <h2 className="text-lg font-semibold tracking-wide text-footer-foreground text-center md:text-left">
          Get in touch
        </h2>

        <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-10">
          <a
            href="tel:8121806688"
            className="flex items-center gap-4 py-4 px-4 min-h-[52px] rounded-lg border border-footer-foreground/15 bg-footer-foreground/[0.03] hover:bg-footer-foreground/[0.06] transition-colors focus-ring-footer"
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-full border border-footer-foreground/20 shrink-0">
              <Phone className="w-5 h-5 text-primary" aria-hidden />
            </span>
            <span className="text-base font-medium text-footer-foreground">81218 06688</span>
          </a>
          <a
            href="https://designerzhub.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 py-4 px-4 min-h-[52px] rounded-lg border border-footer-foreground/15 bg-footer-foreground/[0.03] hover:bg-footer-foreground/[0.06] transition-colors focus-ring-footer"
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-full border border-footer-foreground/20 shrink-0">
              <Globe className="w-5 h-5 text-primary" aria-hidden />
            </span>
            <span className="text-base font-medium text-footer-foreground break-all">designerzhub.co.in</span>
          </a>
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 py-4 px-4 min-h-[52px] rounded-lg border border-footer-foreground/15 bg-footer-foreground/[0.03] hover:bg-footer-foreground/[0.06] transition-colors focus-ring-footer"
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-full border border-footer-foreground/20 shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-primary" aria-hidden />
            </span>
            <span className="text-base text-footer-foreground leading-relaxed text-left">{ADDRESS}</span>
          </a>
        </div>

        <div className="w-full space-y-4">
          <p className="text-sm font-semibold text-footer-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" aria-hidden />
            Find us on the map
          </p>
          <div className="rounded-lg overflow-hidden border border-footer-foreground/20 shadow-md">
            <iframe
              title="Designerz Hub location on Google Maps"
              src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
              width="100%"
              height="360"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full block"
            />
          </div>
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2.5 text-base text-footer-foreground font-medium hover:text-primary transition-colors underline focus-ring-footer rounded"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactLocation;
