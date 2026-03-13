import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, FolderTree, Search } from "lucide-react";
import { useCategories } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function AdminCategoriesPage() {
  const { list: allCategories, isPending, isError, refetch } = useCategories();
  const [search, setSearch] = useState("");
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const categories = useMemo(() => {
    if (!search.trim()) return allCategories;
    const q = search.trim().toLowerCase();
    return allCategories.filter(
      (c: { slug: string; title: string }) =>
        c.slug.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
    );
  }, [allCategories, search]);

  const handleDelete = async () => {
    if (!deleteSlug) return;
    setDeleting(true);
    try {
      await api.categories.delete(deleteSlug);
      toast.success("Category deleted");
      refetch();
      setDeleteSlug(null);
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
          <h1 className="font-display text-2xl font-light text-foreground">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage main categories shown in the store (e.g. Rugs, Furniture, Curtains).
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Add category
          </Link>
        </Button>
      </div>

      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {search && (
          <p className="text-sm text-muted-foreground mt-1.5">
            Showing {categories.length} of {allCategories.length} categories
          </p>
        )}
      </div>

      {isPending && <p className="text-muted-foreground py-8">Loading categories...</p>}
      {isError && (
        <p className="text-destructive py-8">Failed to load categories. Is the API running?</p>
      )}

      {!isPending && !isError && categories.length === 0 && (
        <div className="rounded-lg border border-dashed bg-muted/30 p-12 text-center">
          <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No categories yet.</p>
          <Button asChild>
            <Link to="/admin/categories/new">Add your first category</Link>
          </Button>
        </div>
      )}

      {!isPending && !isError && categories.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c: { slug: string; title: string; image?: string }) => (
                <TableRow key={c.slug}>
                  <TableCell>
                    {c.image ? (
                      <img
                        src={c.image}
                        alt=""
                        className="h-10 w-10 rounded object-cover bg-muted"
                      />
                    ) : (
                      <span className="h-10 w-10 rounded bg-muted block" />
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{c.title}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">{c.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/categories/${encodeURIComponent(c.slug)}/edit`} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteSlug(c.slug)}
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

      <AlertDialog open={!!deleteSlug} onOpenChange={(open) => !open && setDeleteSlug(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The category will be removed from the store navigation.
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
