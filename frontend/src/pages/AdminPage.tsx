import { Link } from "react-router-dom";
import { Package, FolderTree } from "lucide-react";
import { useMemo } from "react";
import { useProducts, useCategories, useStores } from "@/hooks/useApi";
import { LoadingSection } from "@/components/ui/loader";

export default function AdminPage() {
  const { products, isPending: productsPending, isError: productsError } = useProducts();
  const { list: categories, isPending: categoriesPending } = useCategories();
  const { stores, isPending: storesPending } = useStores();

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const outOfStock = products.filter((p) => p.inStock === false).length;
    const inStock = totalProducts - outOfStock;
    const featured = products.filter((p) => Boolean(p.featured)).length;
    const newArrivals = products.filter((p) => Boolean(p.isNew)).length;
    const threeDEnabled = products.filter((p) => Boolean(p.has3d)).length;
    return [
      { label: "Total products", value: totalProducts },
      { label: "In stock", value: inStock },
      { label: "Out of stock", value: outOfStock },
      { label: "Featured products", value: featured },
      { label: "New arrivals", value: newArrivals },
      { label: "3D enabled", value: threeDEnabled },
      { label: "Categories", value: categories.length },
      { label: "Stores", value: stores.length },
    ];
  }, [products, categories.length, stores.length]);

  if (productsPending || categoriesPending || storesPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSection label="Loading dashboard stats..." size="md" />
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h1 className="font-display text-2xl font-light text-foreground mb-2">Dashboard</h1>
        <p className="text-sm text-destructive">Unable to load dashboard stats. Please refresh and try again.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-light text-foreground mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage your store content with live inventory insights.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/products"
          className="flex items-center gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Products</h2>
            <p className="text-sm text-muted-foreground">Add, edit, delete products. Set price, description, image & more.</p>
          </div>
        </Link>
        <Link
          to="/admin/categories"
          className="flex items-center gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <FolderTree className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Categories</h2>
            <p className="text-sm text-muted-foreground">Add, edit, delete main categories (Rugs, Furniture, Curtains, etc.).</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
