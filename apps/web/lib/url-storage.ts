const STORAGE_KEY = "theme-editor-target-url";
// Default to /preview so the editor still works standalone (built-in preview page)
export const DEFAULT_URL = "/preview";

export function getStoredUrl(): string {
  if (typeof window === "undefined") return DEFAULT_URL;
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_URL;
  } catch {
    return DEFAULT_URL;
  }
}

export function setStoredUrl(url: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, url);
  } catch {
    // localStorage not available, fail silently
  }
}

export function isValidUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === "") {
    return { valid: false, error: "URL is required" };
  }

  // Allow relative paths
  if (url.startsWith("/")) {
    return { valid: true };
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, error: "URL must use http:// or https://" };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}
