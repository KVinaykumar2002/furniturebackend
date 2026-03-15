import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useApi";
import { LoadingSection } from "@/components/ui/loader";

const CategoriesGrid = () => {
  const { categories, categorySlugs, isPending, isError } = useCategories();
  return (
    <section id="categories" className="py-16 px-6">
      <div className="container">
        <p className="text-xs tracking-[0.3em] text-muted-foreground/60 uppercase mb-2 text-center md:text-left">
          Shop by category
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-light tracking-wider text-foreground mb-10 text-center md:text-left">
          Product Categories
        </h2>
        {isPending && (
          <div className="py-8 flex justify-center">
            <LoadingSection label="Loading categories…" size="md" />
          </div>
        )}
        {isError && <p className="text-destructive py-8">Failed to load categories.</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categorySlugs.map((slug) => {
            const cat = categories[slug];
            return (
              <Link
                key={slug}
                to={`/${slug}`}
                className="group relative aspect-square overflow-hidden rounded-sm"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
                <span className="absolute bottom-4 left-4 right-4 text-primary-foreground font-display text-lg md:text-xl font-light">
                  {cat.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
