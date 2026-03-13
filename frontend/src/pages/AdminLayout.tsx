import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, Package, Image, FolderTree, ArrowLeft, LogOut } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/images", label: "Images", icon: Image },
];

export default function AdminLayout() {
  const location = useLocation();
  const { isAdmin, logout } = useAdminAuth();

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: { pathname: location.pathname } }} replace />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-14 items-center gap-6 px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
          <span className="text-muted-foreground">|</span>
          <nav className="flex items-center gap-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  (location.pathname === to ||
                    (to === "/admin/products" && location.pathname.startsWith("/admin/products")) ||
                    (to === "/admin/categories" && location.pathname.startsWith("/admin/categories")))
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            Logout
          </Button>
        </div>
      </header>
      <main className="container py-8 px-4">
        <Outlet />
      </main>
    </div>
  );
}
