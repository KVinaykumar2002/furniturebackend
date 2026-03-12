import { Link } from "react-router-dom";
import { Image, LayoutDashboard } from "lucide-react";

export default function AdminPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-light text-foreground mb-2">Admin</h1>
      <p className="text-muted-foreground mb-8">Manage your store content.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/images"
          className="flex items-center gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Image className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Image manager</h2>
            <p className="text-sm text-muted-foreground">Upload and reorder images with drag & drop.</p>
          </div>
        </Link>
        <div className="flex items-center gap-4 rounded-lg border bg-card p-6 text-muted-foreground opacity-70">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">More coming soon</h2>
            <p className="text-sm">Products, orders, and settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
