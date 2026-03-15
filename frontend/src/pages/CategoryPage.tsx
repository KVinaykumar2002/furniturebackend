import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { useCategories, useProducts } from "@/hooks/useApi";
import type { CategorySlug } from "@/data/categories";
import { LoadingSection } from "@/components/ui/loader";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

interface CategoryPageProps {
  slug: CategorySlug;
}

const CategoryPage = ({ slug }: CategoryPageProps) => {
  const { categories, isPending: catPending, isError: catError } = useCategories();
  const categoryData = categories[slug];
  const { products, isPending: productsPending, isError: productsError } = useProducts({ category: slug });

  if (catPending || !categoryData) {
    if (catError || (!catPending && !categoryData)) {
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-32 pb-20 px-6 text-center">
            <p className="text-muted-foreground mb-6">Category not found.</p>
            <Link to="/" className="text-primary underline hover:no-underline">Return to Home</Link>
          </div>
          <Footer />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 px-6">
          <LoadingSection label="Loading…" size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-24 pb-20 md:pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={categoryData.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <div className="container relative z-10 text-center">
          <p className="text-xs tracking-[0.3em] text-primary-foreground/80 uppercase mb-2">
            Category
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-light tracking-wider text-primary-foreground mb-6">
            {categoryData.title}
          </h1>
          <p className="text-primary-foreground/90 max-w-xl mx-auto mb-10 text-sm md:text-base">
            {categoryData.description}
          </p>
          <Link
            to="/#featured"
            className="inline-block bg-primary-foreground text-foreground text-sm px-8 py-3.5 hover:bg-primary-foreground/90 transition-colors min-h-[44px] flex items-center justify-center"
          >
            Shop All {categoryData.title}
          </Link>
        </div>
      </section>
      {productsPending && (
        <div className="py-12">
          <ProductGridSkeleton count={8} />
        </div>
      )}
      {productsError && <p className="text-center text-destructive py-8">Failed to load products.</p>}
      {!productsPending && (
      <ProductGrid
        products={products}
        title={`${categoryData.title} Collection`}
        sectionId="category-products"
      />
      )}
      <Footer />
    </div>
  );
};

export default CategoryPage;
