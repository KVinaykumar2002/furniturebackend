import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Phone, Mail } from "lucide-react";
import { useStores } from "@/hooks/useApi";

const CONTACT_PHONE = "8121806688";
const CONTACT_EMAIL = "info@designerzhub.co.in";

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

export default function Footer() {
  const { stores } = useStores();
  return (
    <footer className="bg-[#eae8e3] text-[#2c2c2c]">
      <div className="container py-14 md:py-16 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* DesignerZhub - brand column */}
          <div>
            <h3 className="font-display text-xl font-semibold text-[#2c2c2c] mb-3 tracking-tight">
              DesignerZhub
            </h3>
            <p className="text-sm text-[#5a5a5a] leading-relaxed mb-4 max-w-xs">
              Premium furniture for inspired living. Quality craftsmanship and timeless design.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#5a5a5a] mb-6">
              <a href={`tel:${CONTACT_PHONE}`} className="inline-flex items-center gap-2 hover:text-[#2c2c2c] transition-colors">
                <Phone className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span>{CONTACT_PHONE}</span>
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 hover:text-[#2c2c2c] transition-colors break-all">
                <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </div>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-[#c9c7c2] bg-white/60 flex items-center justify-center text-[#4a4a4a] hover:text-[#2c2c2c] hover:bg-white/80 transition-colors"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
              <a
                href="#"
                aria-label="Pinterest"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-[#c9c7c2] bg-white/60 flex items-center justify-center text-[#4a4a4a] hover:text-[#2c2c2c] hover:bg-white/80 transition-colors font-semibold text-sm"
              >
                P
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium text-[#2c2c2c] text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-[#5a5a5a]">
              <li><Link to="/about" className="hover:text-[#2c2c2c] transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-[#2c2c2c] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#2c2c2c] transition-colors">Blogs</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-medium text-[#2c2c2c] text-sm mb-4">Customer Support</h4>
            <ul className="space-y-2.5 text-sm text-[#5a5a5a]">
              <li><a href="/#contact" className="hover:text-[#2c2c2c] transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#2c2c2c] transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-[#2c2c2c] transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-[#2c2c2c] transition-colors">Return Policy</a></li>
            </ul>
          </div>

          {/* Stores */}
          <div>
            <h4 className="font-medium text-[#2c2c2c] text-sm mb-4">Stores</h4>
            <ul className="space-y-2.5 text-sm text-[#5a5a5a]">
              {stores.map((store) => (
                <li key={store.id}>
                  <Link to={`/stores/${store.id}`} className="hover:text-[#2c2c2c] transition-colors">
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
