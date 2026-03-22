import type { Store } from "@/data/stores";

/** Single-line address for UI (avoids "Hyderabad, Hyderabad" when address already includes city). */
export function storeAddressLine(store: Store): string {
  const addr = store.address.trim();
  const city = store.city.trim();
  if (!addr) return city;
  if (!city) return addr;
  const addrL = addr.toLowerCase();
  const cityL = city.toLowerCase();
  if (addrL === cityL) return city;
  if (addrL.endsWith(cityL)) return addr;
  if (addrL.includes(`, ${cityL}`) || addrL.includes(`,${cityL}`)) return addr;
  return `${addr}, ${city}`;
}

/**
 * URL for "Open in Google Maps".
 * Uses `mapLink` when set (e.g. Google share links https://share.google/...) so each store opens the link you configured.
 */
export function storeOpenInMapsUrl(store: Store): string {
  const mapLink = store.mapLink?.trim() ?? "";
  if (mapLink.startsWith("http://") || mapLink.startsWith("https://")) {
    return mapLink;
  }
  const place = store.mapSearchQuery?.trim();
  if (place) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  }
  const lat = store.mapLat;
  const lng = store.mapLng;
  if (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
  }
  const q = encodeURIComponent(`${store.address.trim()}, ${store.city.trim()}, India`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/**
 * Google Maps iframe src. Priority:
 * 1. mapSearchQuery — same business/place as the Google share link (mapLink)
 * 2. mapLat + mapLng
 * 3. address + city
 */
export function storeMapEmbedSrc(store: Store): string {
  const place = store.mapSearchQuery?.trim();
  if (place) {
    return `https://www.google.com/maps?q=${encodeURIComponent(place)}&z=17&output=embed&hl=en`;
  }
  const lat = store.mapLat;
  const lng = store.mapLng;
  if (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  ) {
    return `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed&hl=en`;
  }
  const q = encodeURIComponent(`${store.address.trim()}, ${store.city.trim()}, India`);
  return `https://www.google.com/maps?q=${q}&z=16&output=embed&hl=en`;
}
