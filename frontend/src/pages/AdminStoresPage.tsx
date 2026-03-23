import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, MapPin, Search } from "lucide-react";
import { useStores } from "@/hooks/useApi";
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
import { LoadingSection } from "@/components/ui/loader";

export default function AdminStoresPage() {
  const { stores: allStores, isPending, isError, refetch } = useStores();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const stores = useMemo(() => {
    if (!search.trim()) return allStores;
    const q = search.trim().toLowerCase();
    return allStores.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
    );
  }, [allStores, search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.stores.delete(deleteId);
      toast.success("Store removed");
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
          <h1 className="font-display text-2xl font-light text-foreground">Stores</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Showrooms listed in the footer, Store Locator, and store detail pages.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/stores/new">
            <Plus className="h-4 w-4 mr-2" />
            Add store
          </Link>
        </Button>
      </div>

      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by id, name, or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {search && (
          <p className="text-sm text-muted-foreground mt-1.5">
            Showing {stores.length} of {allStores.length} stores
          </p>
        )}
      </div>

      {isPending && (
        <div className="flex min-h-[280px] items-center justify-center py-12">
          <LoadingSection label="Loading stores…" size="md" />
        </div>
      )}
      {isError && (
        <p className="text-destructive py-8">Failed to load stores. Is the API running?</p>
      )}

      {!isPending && !isError && stores.length === 0 && (
        <div className="rounded-lg border border-dashed bg-muted/30 p-12 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {allStores.length === 0 ? "No stores yet." : "No stores match your search."}
          </p>
          {allStores.length === 0 && (
            <Button asChild>
              <Link to="/admin/stores/new">Add your first store</Link>
            </Button>
          )}
        </div>
      )}

      {!isPending && !isError && stores.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-mono text-sm">{store.id}</TableCell>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell className="text-muted-foreground">{store.city}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                      <Link to={`/admin/stores/${encodeURIComponent(store.id)}/edit`} aria-label={`Edit ${store.name}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:text-destructive"
                      aria-label={`Delete ${store.name}`}
                      onClick={() => setDeleteId(store.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this store?</AlertDialogTitle>
            <AlertDialogDescription>
              It will disappear from the footer and Store Locator. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
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
