/**
 * Google Maps links for each showroom (Store Locator + detail page).
 * - Kondapur: DESIGNER HUB FURNITURE HOME INTERIOR (Gachibowli / Kondapur area)
 * - Kothapet: Google Maps place (Designerz Hub) @ 17.3709094, 78.5412697
 *
 * Keep in sync with `backend/src/data/storeLocations.js`.
 */
export const STORE_KONDAPUR = {
  mapLink:
    "https://www.google.com/maps/place/DESIGNER+HUB+FURNITURE+HOME+INTERIOR/@17.4693852,78.2063027,11.69z/data=!4m10!1m2!2m1!1sDESIGNER+HUB+FURNITURE+HOME+INTERIOR,+F963%2B88F,+Kondapur+Main+Road,+Block+-+B,+Sri+Ram+Nagar,+Laxmi+Nagar,+Gachibowli,+Hyderabad,+Telangana+500084!3m6!1s0x3bcb930078acc20b:0x4e717763ad225601!8m2!3d17.4607968!4d78.3534032!15sCpIBREVTSUdORVIgSFVCIEZVUk5JVFVSRSBIT01FIElOVEVSSU9SLCBGOTYzKzg4RiwgS29uZGFwdXIgTWFpbiBSb2FkLCBCbG9jayAtIEIsIFNyaSBSYW0gTmFnYXIsIExheG1pIE5hZ2FyLCBHYWNoaWJvd2xpLCBIeWRlcmFiYWQsIFRlbGFuZ2FuYSA1MDAwODSSARhmdXJuaXR1cmVfcmVudGFsX3NlcnZpY2XgAQA!16s%2Fg%2F11yzt92t20",
  lat: 17.4607968,
  lng: 78.3534032,
} as const;

export const STORE_KOTHAPET = {
  mapLink:
    "https://www.google.com/maps/place/Designerz+Hub/@17.3709094,78.5412697,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb98e85a97726b:0xd60d6a7908ca3c74!8m2!3d17.3709094!4d78.5412697!16s%2Fg%2F1hm5wpy4m",
  lat: 17.3709094,
  lng: 78.5412697,
} as const;

export const STORE_GOOGLE_SHARE_LINKS = {
  kondapur: STORE_KONDAPUR.mapLink,
  kothapet: STORE_KOTHAPET.mapLink,
} as const;
