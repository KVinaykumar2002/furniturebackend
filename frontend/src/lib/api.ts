export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export const api = {
  products: {
    list: (params?: { mainCategory?: string; subcategory?: string; category?: string; featured?: boolean; bestSellers?: boolean; sort?: string; limit?: number }) => {
      const sp = new URLSearchParams();
      if (params?.mainCategory) sp.set("mainCategory", params.mainCategory);
      if (params?.subcategory) sp.set("subcategory", params.subcategory);
      if (params?.category) sp.set("category", params.category);
      if (params?.featured) sp.set("featured", "true");
      if (params?.bestSellers) sp.set("bestSellers", "true");
      if (params?.sort) sp.set("sort", params.sort);
      if (params?.limit != null) sp.set("limit", String(params.limit));
      const q = sp.toString();
      return fetchApi<Array<Record<string, unknown>>>(`/api/products${q ? `?${q}` : ""}`);
    },
    byId: (id: string) => fetchApi<Record<string, unknown>>(`/api/products/${id}`),
    create: (data: Record<string, unknown>) =>
      fetchApi<Record<string, unknown>>("/api/products", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      fetchApi<Record<string, unknown>>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<void>(`/api/products/${id}`, { method: "DELETE" }),
  },
  categories: {
    list: () => fetchApi<{ list: Array<Record<string, unknown>>; bySlug: Record<string, Record<string, unknown>> }>("/api/categories"),
    create: (data: { slug: string; title: string; description?: string; image: string }) =>
      fetchApi<Record<string, unknown>>("/api/categories", { method: "POST", body: JSON.stringify(data) }),
    update: (slug: string, data: { title?: string; description?: string; image?: string }) =>
      fetchApi<Record<string, unknown>>(`/api/categories/${encodeURIComponent(slug)}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (slug: string) => fetchApi<void>(`/api/categories/${encodeURIComponent(slug)}`, { method: "DELETE" }),
  },
  shopCategories: () => fetchApi<{ list: Array<Record<string, unknown>>; bySlug: Record<string, Record<string, unknown>> }>("/api/shop-categories"),
  stores: {
    list: () => fetchApi<Array<Record<string, unknown>>>("/api/stores"),
    byId: (id: string) => fetchApi<Record<string, unknown>>(`/api/stores/${id}`),
  },
  uploadImage,
};
