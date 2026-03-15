import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import { MapPin, ArrowLeft } from "lucide-react";
import { useStores } from "@/hooks/useApi";
import { LoadingSection } from "@/components/ui/loader";

export default function StoresPage() {
  const { stores, isPending, isError } = useStores();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-4 px-4 md:px-6">
        <div className="container">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            Back to Home
          </Link>
        </div>
      </div>
      <SectionWrapper subtitle="Find us" title="Store Locator" className="pt-0">
        {isPending && <LoadingSection label="Loading stores…" />}
        {isError && <p className="text-center text-destructive py-8">Failed to load stores.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <Link
              key={store.id}
              to={`/stores/${store.id}`}
              className="block p-6 border border-border bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-light text-foreground mb-1">{store.name}</h3>
                  <p className="text-sm text-muted-foreground">{store.address}, {store.city}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SectionWrapper>
      <Footer />
    </div>
  );
}
