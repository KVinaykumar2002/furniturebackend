import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, Package, Image, FolderTree, ArrowLeft, LogOut, Settings } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/images", label: "Images", icon: Image },
  { to: "/admin/site-settings", label: "Site Settings", icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const { isAdmin, logout } = useAdminAuth();

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: { pathname: location.pathname } }} replace />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b bg-background safe-top">
        <div className="container flex flex-wrap h-auto min-h-14 items-center gap-3 sm:gap-6 px-4 sm:px-5 py-3 sm:py-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground min-h-[44px] items-center"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to store</span>
          </Link>
          <span className="text-muted-foreground hidden sm:inline">|</span>
          <nav className="flex flex-wrap items-center gap-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-md px-3 py-2.5 min-h-[44px] text-sm font-medium transition-colors touch-manipulation ${
                  (location.pathname === to ||
                    (to === "/admin/products" && location.pathname.startsWith("/admin/products")) ||
                    (to === "/admin/categories" && location.pathname.startsWith("/admin/categories")) ||
                    (to === "/admin/site-settings" && location.pathname.startsWith("/admin/site-settings")))
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto min-h-[44px] text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-1.5 shrink-0" />
            Logout
          </Button>
        </div>
      </header>
      <main className="container py-6 sm:py-8 px-4 sm:px-5 max-w-[100vw] overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
