/** Normalize faqs from MongoDB (array, JSON string, or single object). */
export function coerceFaqsToArray(faqs) {
  if (faqs == null) return [];
  if (Array.isArray(faqs)) return faqs;
  if (typeof faqs === "string") {
    const t = faqs.trim();
    if (!t) return [];
    try {
      const p = JSON.parse(t);
      if (Array.isArray(p)) return p;
      if (p && typeof p === "object" && ("question" in p || "answer" in p)) return [p];
      return [];
    } catch {
      return [];
    }
  }
  if (typeof faqs === "object" && faqs !== null && !Array.isArray(faqs)) {
    const o = faqs;
    if ("question" in o || "answer" in o) return [o];
  }
  return [];
}

/** Same rules as storefront: at least one of question/answer non-empty after trim. */
export function validFaqCount(faqs) {
  const arr = coerceFaqsToArray(faqs);
  return arr.filter((f) => {
    if (!f || typeof f !== "object") return false;
    const q = String(f.question ?? "").trim();
    const a = String(f.answer ?? "").trim();
    return Boolean(q || a);
  }).length;
}
