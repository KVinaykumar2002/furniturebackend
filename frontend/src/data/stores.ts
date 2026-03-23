/** Store row shape — matches API / MongoDB (see `mapStore` in useApi). */
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
