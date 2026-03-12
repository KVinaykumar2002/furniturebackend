/** Business WhatsApp number (with country code, no + or spaces) for orders and chat */
export const WHATSAPP_NUMBER = "918121806688";

export function getWhatsAppOrderUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
