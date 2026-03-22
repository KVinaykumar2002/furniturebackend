import { Link } from "react-router-dom";
import { Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import { useSiteSettings } from "@/hooks/useApi";
import { stores } from "@/data/stores";
import { useEnquiryModal } from "@/context/EnquiryModalContext";

const DEFAULT_TAGLINE = "Premium furniture for inspired living. Quality craftsmanship and timeless design.";

const SOCIAL_LINKS = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { label: "Pinterest", href: "https://pinterest.com", letter: "P" },
] as const;

export default function Footer() {
  const { openEnquiry } = useEnquiryModal();
  const { settings } = useSiteSettings();
  const contactPhone = settings?.contactPhone ?? "";
  const contactEmail = settings?.contactEmail ?? "";
  const address = settings?.address ?? "";
  const brandTagline = (settings?.brandTagline ?? "").trim() || DEFAULT_TAGLINE;

  return (
    <footer className="bg-[#eae8e3] text-[#2c2c2c] safe-bottom">
      <div className="container py-10 sm:py-14 md:py-16 px-4 sm:px-5 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8">
          {/* DesignerZhub - brand column (contact + address from admin) */}
          <div>
            <h3 className="font-display text-xl font-semibold text-[#2c2c2c] mb-3 tracking-tight">
              DesignerZhub
            </h3>
            <p className="text-sm text-[#5a5a5a] leading-relaxed mb-4 max-w-xs">
              {brandTagline}
            </p>
            {(contactPhone || contactEmail) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#5a5a5a] mb-4">
                {contactPhone && (
                  <a href={`tel:${contactPhone}`} className="inline-flex items-center gap-2 hover:text-[#2c2c2c] transition-colors">
                    <Phone className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <span>{contactPhone}</span>
                  </a>
                )}
                {contactEmail && (
                  <a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 hover:text-[#2c2c2c] transition-colors break-all">
                    <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <span>{contactEmail}</span>
                  </a>
                )}
              </div>
            )}
            {address && (
              <p className="text-sm text-[#5a5a5a] leading-relaxed mb-4 max-w-xs whitespace-pre-line">
                {address}
              </p>
            )}
            <div className="flex gap-2">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-[#c9c7c2] bg-white/60 flex items-center justify-center text-[#4a4a4a] hover:text-[#2c2c2c] hover:bg-white/80 transition-colors"
                >
                  {"icon" in item && item.icon ? (
                    <item.icon className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <span className="font-semibold text-sm">{item.letter}</span>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium text-[#2c2c2c] text-sm mb-4">Company</h4>
            <ul className="space-y-1 text-sm text-[#5a5a5a]">
              <li><Link to="/about" className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center">About Us</Link></li>
              <li><a href="#" className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center">Careers</a></li>
              <li><a href="#" className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center">Blogs</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-medium text-[#2c2c2c] text-sm mb-4">Customer Support</h4>
            <ul className="space-y-1 text-sm text-[#5a5a5a]">
              <li>
                <button
                  type="button"
                  onClick={openEnquiry}
                  className="block w-full text-left py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center"
                >
                  Contact Us
                </button>
              </li>
              <li><a href="#" className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center">FAQs</a></li>
              <li><a href="#" className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center">Shipping Policy</a></li>
              <li><a href="#" className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center">Return Policy</a></li>
            </ul>
          </div>

          {/* Stores — static list (same as Store Locator) */}
          <div>
            <h4 className="font-medium text-[#2c2c2c] text-sm mb-4">Stores</h4>
            <ul className="space-y-1 text-sm text-[#5a5a5a]">
              {stores.map((store) => (
                <li key={store.id}>
                  <Link to={`/stores/${store.id}`} className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center">
                    {store.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#d4d2cd] text-center text-sm text-[#5a5a5a]">
          © {new Date().getFullYear()} DesignerZhub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
