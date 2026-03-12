import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  mainNavWithDropdowns,
  mainNavLinks,
} from "@/data/nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { itemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => location.pathname === href;
  const isDropdownActive = (items: { href: string }[]) =>
    items.some((item) => location.pathname === item.href);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/95 shadow-md backdrop-blur" : "bg-white"
        }`}
    >
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" className="font-display text-2xl font-light tracking-wide text-foreground shrink-0">
          DesignerZhub
        </Link>

        {/* Desktop: search bar when expanded */}
        {searchOpen && (
          <div className="hidden md:flex flex-1 max-w-md mx-4 animate-in fade-in duration-200">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-none h-10 border-neutral-300"
              autoFocus
            />
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setSearchOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Desktop: main nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainNavWithDropdowns.map((item) => (
            <div key={item.label} className="relative group">
              <span
                className={`flex items-center gap-0.5 px-4 py-2 text-sm font-medium cursor-default hover:bg-muted/50 transition-colors ${isDropdownActive(item.items)
                    ? "text-foreground border-b-2 border-neutral-900"
                    : "text-foreground/90 hover:text-foreground"
                  }`}
              >
                {item.label}
                <ChevronDown className="h-4 w-4 opacity-70" />
              </span>
              <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="border bg-white shadow-lg py-2 min-w-[180px]">
                  {item.items.map((sub) => (
                    <Link
                      key={sub.href}
                      to={sub.href}
                      className={`block px-4 py-2.5 text-sm hover:bg-muted/50 ${isActive(sub.href)
                          ? "text-foreground font-medium"
                          : "text-foreground/80"
                        }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors ${isActive(link.href)
                  ? "text-foreground border-b-2 border-neutral-900"
                  : "text-foreground/90 hover:text-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: icons */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none"
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="rounded-none relative" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-neutral-900 text-white text-[10px] font-medium flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none relative"
            onClick={openCart}
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-neutral-900 text-white text-[10px] font-medium flex items-center justify-center">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-none" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-none">
              <DropdownMenuItem asChild>
                <Link to="/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/register">Register</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-none"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu — slide-in overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />

        {/* Menu panel — slides from right */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <span className="font-display text-lg font-light">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-foreground hover:bg-muted/50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile search */}
          <div className="p-4 border-b border-neutral-200">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-none h-10 border-neutral-300"
            />
          </div>

          <nav className="px-4 py-4 space-y-2 overflow-y-auto max-h-[calc(100vh-140px)]">
            {mainNavWithDropdowns.map((item) => (
              <div key={item.label}>
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
                {item.items.map((sub) => (
                  <Link
                    key={sub.href}
                    to={sub.href}
                    className={`block py-2.5 px-4 text-foreground hover:bg-muted/50 transition-colors ${isActive(sub.href) ? "font-medium bg-muted/30" : ""
                      }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            ))}
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block py-3 px-4 text-foreground font-medium hover:bg-muted/50 transition-colors ${isActive(link.href) ? "bg-muted/30" : ""
                  }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
