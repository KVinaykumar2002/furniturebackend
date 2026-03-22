import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getRecentlyViewedIds } from "@/lib/recentlyViewed";
import type { Product } from "@/data/products";
import type { Category } from "@/data/categories";
import type { Store } from "@/data/stores";
import type { ShopCategory } from "@/data/shopCategories";

function mapProduct(p: Record<string, unknown>): Product {
  return {
    id: String(p.id),
    name: String(p.name),
    description: p.description != null ? String(p.description) : undefined,
    price: Number(p.price),
    oldPrice: p.oldPrice != null ? Number(p.oldPrice) : undefined,
    save: p.save != null ? Number(p.save) : undefined,
    rating: Number(p.rating ?? 0),
    reviews: Number(p.reviews ?? 0),
    image: String(p.image),
    category: p.category as Product["category"],
    mainCategory: p.mainCategory as Product["mainCategory"],
    subcategory: p.subcategory as Product["subcategory"],
    isNew: Boolean(p.isNew),
    featured: Boolean(p.featured),
    color: p.color != null && String(p.color).trim() !== "" ? String(p.color).trim() : undefined,
    size: p.size != null && String(p.size).trim() !== "" ? String(p.size).trim() : undefined,
    inStock: p.inStock != null ? Boolean(p.inStock) : undefined,
    productLocation: p.productLocation != null && String(p.productLocation).trim() !== "" ? String(p.productLocation).trim() : undefined,
    has3d: p.has3d != null ? Boolean(p.has3d) : undefined,
  };
}

function mapCategory(c: Record<string, unknown>): Category {
  return {
    slug: c.slug as Category["slug"],
    title: String(c.title),
    description: String(c.description),
    image: String(c.image),
  };
}

function mapStore(s: Record<string, unknown>): Store {
  return {
    id: String(s.id),
    name: String(s.name),
    address: String(s.address),
    city: String(s.city),
    mapEmbedUrl: String(s.mapEmbedUrl),
    mapLink: String(s.mapLink),
    phone: s.phone != null ? String(s.phone) : undefined,
    hours: s.hours != null ? String(s.hours) : undefined,
  };
}

function mapShopCategory(c: Record<string, unknown>): ShopCategory {
  const rawSubs = c.subcategories as Array<{ slug?: string; label?: string }> | undefined;
  const subcategories = Array.isArray(rawSubs)
    ? rawSubs
        .filter((s) => s && (s.slug != null || s.label != null))
        .map((s) => ({ slug: String(s.slug ?? ""), label: String(s.label ?? slugToLabel(s.slug ?? "")) }))
    : undefined;
  return {
    slug: c.slug as ShopCategory["slug"],
    title: String(c.title),
    description: String(c.description),
    image: String(c.image),
    subcategories: subcategories?.length ? subcategories : undefined,
  };
}

function slugToLabel(slug: string): string {
  if (!slug.trim()) return "";
  return slug
    .trim()
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function useProducts(params?: {
  search?: string;
  mainCategory?: string;
  subcategory?: string;
  category?: string;
  featured?: boolean;
  bestSellers?: boolean;
  highlights?: boolean;
  ids?: string[];
  sort?: string;
  limit?: number;
}) {
  const q = useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const list = await api.products.list(params);
      const mapped = list.map(mapProduct);
      // Remove duplicates by id so the same product (and image) never appears twice
      const seen = new Set<string>();
      return mapped.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
    },
    /** Highlights grid is stable; avoid refetch on every navigation */
    staleTime: params?.highlights ? 2 * 60 * 1000 : undefined,
  });
  return { ...q, products: q.data ?? [] };
}

/** Homepage “Recently viewed” — ids from localStorage (newest first); product rows from API in that same order */
export function useRecentlyViewedProducts() {
  const location = useLocation();
  const [ids, setIds] = useState<string[]>(() => getRecentlyViewedIds());

  const syncIdsFromStorage = () => setIds(getRecentlyViewedIds());

  useEffect(() => {
    window.addEventListener("recentlyViewedChanged", syncIdsFromStorage);
    window.addEventListener("storage", syncIdsFromStorage);
    const onPageShow = () => syncIdsFromStorage();
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("recentlyViewedChanged", syncIdsFromStorage);
      window.removeEventListener("storage", syncIdsFromStorage);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  /** Coming back to home (or bfcache) — re-read so the list matches what the user just opened */
  useEffect(() => {
    if (location.pathname === "/") {
      syncIdsFromStorage();
    }
  }, [location.pathname]);

  const q = useQuery({
    queryKey: ["products", "recentlyViewed", ids.join("|")],
    queryFn: async () => {
      const list = await api.products.list({ ids });
      const mapped = list.map(mapProduct);
      const byId = new Map(mapped.map((p) => [p.id, p]));
      /** Enforce same order as open history (newest first), not API return order */
      return ids.map((id) => byId.get(id)).filter((p): p is Product => p !== undefined);
    },
    enabled: ids.length > 0,
    staleTime: 30 * 1000,
  });

  return {
    ...q,
    ids,
    products: q.data ?? [],
  };
}

export function useProduct(id: string | undefined) {
  const q = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const p = await api.products.byId(id);
      return mapProduct(p);
    },
    enabled: !!id,
  });
  return { ...q, product: q.data ?? null };
}

export function useCategories() {
  const q = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { list, bySlug } = await api.categories.list();
      return {
        list: list.map(mapCategory),
        bySlug: Object.fromEntries(Object.entries(bySlug).map(([k, v]) => [k, mapCategory(v)])),
        categorySlugs: list.map((c) => c.slug as string),
      };
    },
  });
  return {
    ...q,
    categories: q.data?.bySlug ?? {},
    categorySlugs: q.data?.categorySlugs ?? [],
    list: q.data?.list ?? [],
  };
}

export function useShopCategories() {
  const q = useQuery({
    queryKey: ["shopCategories"],
    queryFn: async () => {
      const { list, bySlug } = await api.shopCategories();
      return {
        list: list.map(mapShopCategory),
        bySlug: Object.fromEntries(Object.entries(bySlug).map(([k, v]) => [k, mapShopCategory(v)])),
        shopCategorySlugs: list.map((c) => c.slug as string),
      };
    },
  });
  return {
    ...q,
    shopCategories: q.data?.bySlug ?? {},
    shopCategorySlugs: q.data?.shopCategorySlugs ?? [],
    list: q.data?.list ?? [],
  };
}

export function useStores() {
  const q = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const list = await api.stores.list();
      return list.map(mapStore);
    },
  });
  return { ...q, stores: q.data ?? [] };
}

export function useStore(id: string | undefined) {
  const q = useQuery({
    queryKey: ["store", id],
    queryFn: async () => {
      if (!id) return null;
      const s = await api.stores.byId(id);
      return mapStore(s);
    },
    enabled: !!id,
  });
  return { ...q, store: q.data ?? null };
}

export type CompletedProjectStat = { label: string; value: string };

export const DEFAULT_COMPLETED_PROJECT_STATS: CompletedProjectStat[] = [
  { label: "Fit-out", value: "553" },
  { label: "Furnishing", value: "10,154" },
  { label: "Consultation", value: "756" },
];

function normalizeCompletedProjectStats(raw: unknown): CompletedProjectStat[] {
  const rows = Array.isArray(raw)
    ? (raw as Array<Record<string, unknown>>).map((row) => ({
        label: row && typeof row.label === "string" ? row.label : "",
        value: row && typeof row.value === "string" ? row.value : "",
      }))
    : [];
  return DEFAULT_COMPLETED_PROJECT_STATS.map((d, i) => {
    const row = rows[i];
    if (row === undefined) return { ...d };
    return {
      label: row.label,
      value: row.value,
    };
  });
}

export type Testimonial = {
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
  imageUrl: string;
  videoUrl: string;
};

/** Matches seeded backend defaults / former static homepage copy */
export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya S.",
    role: "Hyderabad",
    rating: 5,
    text: "DesignerZhub transformed our living room. Exceptional quality and great team.",
    avatar: "PS",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop",
    videoUrl: "",
  },
  {
    name: "Rahul M.",
    role: "Mumbai",
    rating: 5,
    text: "Smooth ordering and delivery. Furniture looks even better in person.",
    avatar: "RM",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    name: "Anita K.",
    role: "Chennai",
    rating: 5,
    text: "Beautiful designs and sturdy construction. Highly recommend.",
    avatar: "AK",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    videoUrl: "",
  },
  {
    name: "Sara M.",
    role: "",
    rating: 5,
    text: "My client and I loved the product very much! It adds a luxurious and comfy feel to the room.",
    avatar: "SM",
    imageUrl: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=400&h=300&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    name: "Ahmed M.",
    role: "",
    rating: 5,
    text: "No sofa in the world can beat this sofa beauty. My whole house furniture from DesignerZhub.",
    avatar: "AM",
    imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=300&fit=crop",
    videoUrl: "",
  },
  {
    name: "Asya M.",
    role: "",
    rating: 5,
    text: "We love it so much. Classic sofa, retro style, amazing material, comfortable!",
    avatar: "AM",
    imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=300&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

function parseTestimonialRow(row: Record<string, unknown>): Testimonial {
  const rating = Number(row?.rating);
  return {
    name: row && typeof row.name === "string" ? row.name : "",
    role: row && typeof row.role === "string" ? row.role : "",
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5,
    text: row && typeof row.text === "string" ? row.text : "",
    avatar: row && typeof row.avatar === "string" ? row.avatar : "",
    imageUrl: row && typeof row.imageUrl === "string" ? row.imageUrl : "",
    videoUrl: row && typeof row.videoUrl === "string" ? row.videoUrl : "",
  };
}

function normalizeTestimonials(r: Record<string, unknown>): Testimonial[] {
  if (!("testimonials" in r) || r.testimonials === undefined || r.testimonials === null) {
    return DEFAULT_TESTIMONIALS.map((t) => ({ ...t }));
  }
  if (!Array.isArray(r.testimonials)) {
    return DEFAULT_TESTIMONIALS.map((t) => ({ ...t }));
  }
  const mapped = (r.testimonials as Array<Record<string, unknown>>)
    .map(parseTestimonialRow)
    .filter((t) => t.name.trim() && t.text.trim());
  /** Empty [] from DB / Mongoose default — treat like “not configured yet” */
  if (mapped.length === 0) {
    return DEFAULT_TESTIMONIALS.map((t) => ({ ...t }));
  }
  return mapped;
}

export type SiteSettings = {
  contactPhone: string;
  contactEmail: string;
  address: string;
  brandTagline: string;
  ourStoresImage: string;
  heroSlides: { image: string; title: string; subtitle: string }[];
  socialLinks: { name: string; href: string }[];
  completedProjectStats: CompletedProjectStat[];
  testimonials: Testimonial[];
};

function mapSiteSettings(r: Record<string, unknown>): SiteSettings {
  const slides = Array.isArray(r.heroSlides)
    ? (r.heroSlides as Array<Record<string, unknown>>).map((s) => ({
        image: s && typeof s.image === "string" ? s.image : "",
        title: s && typeof s.title === "string" ? s.title : "",
        subtitle: s && typeof s.subtitle === "string" ? s.subtitle : "",
      }))
    : [];
  const links = Array.isArray(r.socialLinks)
    ? (r.socialLinks as Array<Record<string, unknown>>).map((l) => ({
        name: l && typeof l.name === "string" ? l.name : "",
        href: l && typeof l.href === "string" ? l.href : "#",
      }))
    : [];
  return {
    contactPhone: r.contactPhone != null ? String(r.contactPhone) : "",
    contactEmail: r.contactEmail != null ? String(r.contactEmail) : "",
    address: r.address != null ? String(r.address) : "",
    brandTagline: r.brandTagline != null ? String(r.brandTagline) : "",
    ourStoresImage: r.ourStoresImage != null ? String(r.ourStoresImage) : "",
    heroSlides: slides,
    socialLinks: links,
    completedProjectStats: normalizeCompletedProjectStats(r.completedProjectStats),
    testimonials: normalizeTestimonials(r),
  };
}

export function useSiteSettings() {
  const q = useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const r = await api.siteSettings.get();
      return mapSiteSettings(r);
    },
  });
  return { ...q, settings: q.data ?? null };
}
