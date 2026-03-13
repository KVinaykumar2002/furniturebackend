import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
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
  return {
    slug: c.slug as ShopCategory["slug"],
    title: String(c.title),
    description: String(c.description),
    image: String(c.image),
  };
}

export function useProducts(params?: { search?: string; mainCategory?: string; subcategory?: string; category?: string; featured?: boolean; bestSellers?: boolean; sort?: string; limit?: number }) {
  const q = useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const list = await api.products.list(params);
      return list.map(mapProduct);
    },
  });
  return { ...q, products: q.data ?? [] };
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
    shopCategorySlugs: q.data?.shopCategorySlugs ?? ["living", "dining", "bedroom"],
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
