import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Link2,
} from "lucide-react";
import { useSiteSettings, useStores } from "@/hooks/useApi";
import { useEnquiryModal } from "@/context/EnquiryModalContext";

const DEFAULT_TAGLINE = "Premium furniture for inspired living. Quality craftsmanship and timeless design.";

function normalizeSocialHref(href: string): string {
  const t = href.trim();
  if (!t || t === "#") return "#";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

type Glyph =
  | { kind: "lucide"; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }
  | { kind: "letter"; letter: string };

function socialGlyph(name: string, href: string): Glyph {
  const blob = `${name} ${href}`.toLowerCase();
  if (blob.includes("instagram")) return { kind: "lucide", Icon: Instagram };
  if (blob.includes("facebook")) return { kind: "lucide", Icon: Facebook };
  if (blob.includes("twitter") || blob.includes("x.com") || /\bx\b/.test(name.toLowerCase().trim()))
    return { kind: "lucide", Icon: Twitter };
  if (blob.includes("pinterest")) return { kind: "letter", letter: "P" };
  if (blob.includes("youtube")) return { kind: "lucide", Icon: Youtube };
  if (blob.includes("linkedin")) return { kind: "lucide", Icon: Linkedin };
  return { kind: "lucide", Icon: Link2 };
}

export default function Footer() {
  const { openEnquiry } = useEnquiryModal();
  const { settings } = useSiteSettings();
  const { stores, isPending: storesPending } = useStores();
  const contactPhone = settings?.contactPhone ?? "";
  const contactEmail = settings?.contactEmail ?? "";
  const address = settings?.address ?? "";
  const brandTagline = (settings?.brandTagline ?? "").trim() || DEFAULT_TAGLINE;
  const blogsLabel = (settings?.blogsFooterLabel ?? "").trim() || "Blogs";
  const blogsHref = (settings?.blogsFooterHref ?? "").trim() || "/blogs";
  const blogsExternal = /^https?:\/\//i.test(blogsHref);
  const footerSocialLinks = (settings?.socialLinks ?? []).filter(
    (l) => l.name.trim() && l.href.trim() && l.href.trim() !== "#"
  );

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
            {footerSocialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {footerSocialLinks.map((item, index) => {
                  const href = normalizeSocialHref(item.href);
                  const glyph = socialGlyph(item.name, item.href);
                  const label = item.name.trim() || "Social link";
                  return (
                    <a
                      key={`${label}-${href}-${index}`}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 border border-[#c9c7c2] bg-white/60 flex items-center justify-center text-[#4a4a4a] hover:text-[#2c2c2c] hover:bg-white/80 transition-colors"
                    >
                      {glyph.kind === "lucide" ? (
                        <glyph.Icon className="h-4 w-4" strokeWidth={1.5} />
                      ) : (
                        <span className="font-semibold text-sm">{glyph.letter}</span>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium text-[#2c2c2c] text-sm mb-4">Company</h4>
            <ul className="space-y-1 text-sm text-[#5a5a5a]">
              <li><Link to="/about" className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center">About Us</Link></li>
              <li>
                {blogsExternal ? (
                  <a
                    href={blogsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center"
                  >
                    {blogsLabel}
                  </a>
                ) : (
                  <Link
                    to={blogsHref}
                    className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center"
                  >
                    {blogsLabel}
                  </Link>
                )}
              </li>
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
              <li><Link to="/faq" className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center">FAQs</Link></li>
              {/* <li><Link to="/shipping-policy" className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center">Shipping Policy</Link></li> */}
              {/* <li><Link to="/return-policy" className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center">Return Policy</Link></li> */}
            </ul>
          </div>

          {/* Stores — from API (same list as Store Locator) */}
          <div>
            <h4 className="font-medium text-[#2c2c2c] text-sm mb-4">Stores</h4>
            <ul className="space-y-1 text-sm text-[#5a5a5a]">
              {storesPending ? (
                <li className="py-2.5 text-[#5a5a5a]/70">Loading stores…</li>
              ) : (
                stores.map((store) => (
                  <li key={store.id}>
                    <Link to={`/stores/${store.id}`} className="block py-2.5 hover:text-[#2c2c2c] transition-colors min-h-[44px] flex items-center">
                      {store.name}
                    </Link>
                  </li>
                ))
              )}
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
