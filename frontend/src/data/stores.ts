import {
  STORE_GOOGLE_SHARE_LINKS,
  STORE_KONDAPUR,
  STORE_KOTHAPET,
} from "./storeLocations";

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  /** Legacy field; iframe uses {@link storeMapEmbedSrc} with mapLat/mapLng or address. */
  mapEmbedUrl: string;
  mapLink: string;
  /** Optional WGS84 latitude for the embedded map pin */
  mapLat?: number;
  /** Optional WGS84 longitude for the embedded map pin */
  mapLng?: number;
  /** Google Maps search text for the same place as mapLink (share URL) */
  mapSearchQuery?: string;
  phone?: string;
  hours?: string;
}

export const stores: Store[] = [
  {
    id: "kondapur",
    name: "Kondapur",
    address: "F963+88F, Kondapur Main Road, Block - B, Sri Ram Nagar, Laxmi Nagar, Gachibowli",
    city: "Hyderabad",
    mapEmbedUrl: `https://www.google.com/maps?q=${STORE_KONDAPUR.lat},${STORE_KONDAPUR.lng}&z=17&output=embed&hl=en`,
    mapLink: STORE_GOOGLE_SHARE_LINKS.kondapur,
    mapLat: STORE_KONDAPUR.lat,
    mapLng: STORE_KONDAPUR.lng,
  },
  {
    id: "kothapet",
    name: "Kothapet",
    address: "Kothapet",
    city: "Hyderabad",
    mapEmbedUrl: `https://www.google.com/maps?q=${STORE_KOTHAPET.lat},${STORE_KOTHAPET.lng}&z=17&output=embed&hl=en`,
    mapLink: STORE_GOOGLE_SHARE_LINKS.kothapet,
    mapLat: STORE_KOTHAPET.lat,
    mapLng: STORE_KOTHAPET.lng,
  },
];

export function getStoreById(id: string): Store | undefined {
  return stores.find((s) => s.id === id);
}
