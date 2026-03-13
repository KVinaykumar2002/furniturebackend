import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Package, Search } from "lucide-react";
import { useProducts } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useCategories, useShopCategories } from "@/hooks/useApi";

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "new", label: "New first" },
] as const;

export default function AdminProductsPage() {
  const { list: categoryList } = useCategories();
  const { list: shopCategoryList } = useShopCategories();
  const categoryFilterOptions = categoryList.filter((c) => String(c.slug) !== "all").map((c) => ({ value: c.slug, label: c.title }));
  const mainCategoryFilterOptions = shopCategoryList.map((c) => ({ value: c.slug, label: c.title }));

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [mainCategory, setMainCategory] = useState<string>("all");
  const [subcategory, setSubcategory] = useState("");
  const [sort, setSort] = useState<string>("popularity");

  const filterParams = useMemo(() => {
    const params: { limit: number; search?: string; category?: string; mainCategory?: string; subcategory?: string; sort?: string } = { limit: 500 };
    if (search.trim()) params.search = search.trim();
    if (category && category !== "all") params.category = category;
    if (mainCategory && mainCategory !== "all") params.mainCategory = mainCategory;
    if (subcategory.trim()) params.subcategory = subcategory.trim();
    if (sort && sort !== "popularity") params.sort = sort;
    return params;
  }, [search, category, mainCategory, subcategory, sort]);

  const { products, isPending, isError, refetch } = useProducts(filterParams);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.products.delete(deleteId);
      toast.success("Product deleted");
      refetch();
      setDeleteId(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-light text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View, add, edit and delete products.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 mb-6 p-4 rounded-lg border bg-card">
        <p className="text-sm font-medium text-foreground">Filters</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categoryFilterOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={mainCategory} onValueChange={setMainCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Main category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All main</SelectItem>
              {mainCategoryFilterOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Subcategory filter"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="max-w-[140px]"
          />
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Showing {products.length} product{products.length !== 1 ? "s" : ""}
          {(search || category !== "all" || mainCategory !== "all" || subcategory) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setMainCategory("all");
                setSubcategory("");
                setSort("popularity");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {isPending && <p className="text-muted-foreground py-8">Loading products...</p>}
      {isError && (
        <p className="text-destructive py-8">Failed to load products. Is the API running?</p>
      )}

      {!isPending && !isError && products.length === 0 && (
        <div className="rounded-lg border border-dashed bg-muted/30 p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No products yet.</p>
          <Button asChild>
            <Link to="/admin/products/new">Add your first product</Link>
          </Button>
        </div>
      )}

      {!isPending && !isError && products.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[100px]">Main</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <img
                      src={p.image}
                      alt=""
                      className="h-10 w-10 rounded object-cover bg-muted"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{p.name}</span>
                    {p.isNew && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        New
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{p.price.toLocaleString()}
                    {p.oldPrice != null && (
                      <span className="text-muted-foreground text-sm line-through ml-1">
                        ₹{p.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.mainCategory}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/products/${p.id}/edit`} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(p.id)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The product will be removed from the store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
