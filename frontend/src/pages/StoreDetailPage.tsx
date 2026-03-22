import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin } from "lucide-react";
import { getStoreById } from "@/data/stores";
import { storeAddressLine, storeMapEmbedSrc, storeOpenInMapsUrl } from "@/lib/storeMap";

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const store = id ? getStoreById(id) : undefined;

  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-32 text-center">
          <p className="text-muted-foreground mb-4">Store not found.</p>
          <Link to="/stores" className="text-primary font-medium">Back to Store Locator</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 md:py-12 px-4 pt-24">
        <Link to="/stores" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">← Store Locator</Link>
        <div className="flex gap-4 mb-8">
          <div className="w-14 h-14 bg-primary/10 flex items-center justify-center shrink-0">
            <MapPin className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-light text-foreground">{store.name}</h1>
            <p className="text-muted-foreground">{storeAddressLine(store)}</p>
          </div>
        </div>
        <div className="overflow-hidden border border-border bg-muted">
          <iframe
            title={`Map for ${store.name}`}
            src={storeMapEmbedSrc(store)}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href={storeOpenInMapsUrl(store)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-12 px-8 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors uppercase tracking-wide text-sm mt-6"
        >
          Open in Google Maps
        </a>
      </div>
      <Footer />
    </div>
  );
}
