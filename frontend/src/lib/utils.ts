import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

/** Read an image file as a base64 data URL (e.g. data:image/jpeg;base64,...). Rejects if not image or > 5MB. */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File must be an image"));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      reject(new Error("Image must be 5MB or less"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/** Strip tags from saved HTML for one-time migration in admin (browser only). */
export function htmlToPlainText(html: string): string {
  if (typeof document === "undefined") {
    return html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body?.textContent || "")
    .replace(/\u00a0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
