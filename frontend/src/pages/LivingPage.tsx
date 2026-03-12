import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import ProductCard from "@/components/ProductCard";
import { useShopCategories, useProducts } from "@/hooks/useApi";
import { getSubcategoryInfo } from "@/data/subcategories";

export default function LivingPage() {
  const [searchParams] = useSearchParams();
  const sub = searchParams.get("sub") ?? undefined;
  const { shopCategories } = useShopCategories();
  const { products, isPending, isError } = useProducts({ mainCategory: "living", subcategory: sub });
  const cat = shopCategories?.living;
  const subInfo = sub ? getSubcategoryInfo(sub, "living") : undefined;

  const pageTitle = subInfo ? subInfo.label : cat?.title ?? "Living";
  const pageDescription = subInfo ? subInfo.description : cat?.description ?? "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={cat?.image ?? ""} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <div className="container relative z-10 px-4">
          <Link
            to="/#categories"
            className="inline-flex items-center gap-2 text-white/95 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            Back to Categories
          </Link>
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-6xl font-light text-white mb-4">{pageTitle}</h1>
            <p className="text-white/90 max-w-xl mx-auto">{pageDescription}</p>
          </div>
        </div>
      </section>
      <SectionWrapper className="bg-white">
        {isPending ? (
          <p className="text-center text-muted-foreground py-12">Loading...</p>
        ) : isError ? (
          <p className="text-center text-destructive py-12">Failed to load products.</p>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        )}
      </SectionWrapper>
      <Footer />
    </div>
  );
}
