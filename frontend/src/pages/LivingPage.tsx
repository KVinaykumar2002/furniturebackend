import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import ProductCard from "@/components/ProductCard";
import { useShopCategories, useProducts } from "@/hooks/useApi";
import { getSubcategoryInfo } from "@/data/subcategories";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

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
      <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={cat?.image ?? ""} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <div className="container relative z-10 px-4 sm:px-5">
          <Link
            to="/#categories"
            className="inline-flex items-center gap-2 text-white/95 hover:text-white text-sm font-medium mb-4 sm:mb-6 transition-colors min-h-[44px] items-center"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            Back to Categories
          </Link>
          <div className="text-center px-2">
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-light text-white mb-3 sm:mb-4">{pageTitle}</h1>
            <p className="text-white/90 max-w-xl mx-auto text-sm sm:text-base">{pageDescription}</p>
          </div>
        </div>
      </section>
      <SectionWrapper className="bg-white">
        {isPending ? (
          <div className="py-8 sm:py-12">
            <ProductGridSkeleton count={8} />
          </div>
        ) : isError ? (
          <p className="text-center text-destructive py-8 sm:py-12">Failed to load products.</p>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 sm:py-12">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
