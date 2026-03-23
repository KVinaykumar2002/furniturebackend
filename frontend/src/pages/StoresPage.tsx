import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import { LoadingSection } from "@/components/ui/loader";
import { MapPin, ArrowLeft } from "lucide-react";
import { useStores } from "@/hooks/useApi";
import { storeAddressLine, storeMapEmbedSrc, storeOpenInMapsUrl } from "@/lib/storeMap";

export default function StoresPage() {
  const { stores, isPending, isError } = useStores();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-4 px-4 sm:px-5 md:px-6">
        <div className="container">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors min-h-[44px] items-center"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            Back to Home
          </Link>
        </div>
      </div>
      <SectionWrapper subtitle="Find us" title="Store Locator" className="pt-0">
        {isPending ? (
          <div className="flex min-h-[40vh] items-center justify-center py-16">
            <LoadingSection label="Loading stores…" size="md" />
          </div>
        ) : isError ? (
          <p className="text-center text-destructive py-12">Unable to load stores. Please try again later.</p>
        ) : stores.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No stores listed yet.</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <article
              key={store.id}
              className="border border-border bg-white hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
            >
              <div className="p-4 sm:p-6 pb-0">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link to={`/stores/${store.id}`} className="block text-left">
                      <h3 className="font-display text-xl font-light text-foreground mb-1">{store.name}</h3>
                      <p className="text-sm text-muted-foreground">{storeAddressLine(store)}</p>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-4 mx-4 sm:mx-6 overflow-hidden border border-border bg-muted sm:rounded-sm">
                <iframe
                  title={`Map for ${store.name}`}
                  src={storeMapEmbedSrc(store)}
                  width="100%"
                  height={260}
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block w-full"
                />
              </div>
              <div className="p-4 sm:p-6 pt-3">
                <a
                  href={storeOpenInMapsUrl(store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-medium text-primary hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            </article>
          ))}
        </div>
        )}
      </SectionWrapper>
      <Footer />
    </div>
  );
}
