const STORAGE_KEY = "furniture-recently-viewed-ids";
export const MAX_RECENTLY_VIEWED = 12;

/**
 * Ordered list of product ids the user opened most recently (newest first).
 */
export function getRecentlyViewedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string" && x.trim() !== "");
  } catch {
    return [];
  }
}

/** Record a product page visit (dedupes, caps length, notifies listeners). */
export function addRecentlyViewedId(productId: string): void {
  if (typeof window === "undefined" || !productId?.trim()) return;
  const id = productId.trim();
  const rest = getRecentlyViewedIds().filter((x) => x !== id);
  const next = [id, ...rest].slice(0, MAX_RECENTLY_VIEWED);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
  window.dispatchEvent(new Event("recentlyViewedChanged"));
}
