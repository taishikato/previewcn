// Direct DOM theme application (no postMessage needed)

import { getColorPreset } from "./presets/colors";
import { getFontPreset } from "./presets/fonts";

const THEME_COLOR_STYLE_ID = "previewcn-devtools-theme-colors";

export type ThemeConfig = {
  colorPreset: string | null;
  radius: string | null;
  darkMode: boolean | null;
  font: string | null;
};

function getOrCreateThemeColorStyleElement(): HTMLStyleElement {
  const existing = document.getElementById(THEME_COLOR_STYLE_ID);
  if (existing instanceof HTMLStyleElement) {
    return existing;
  }

  if (existing) {
    existing.remove();
  }

  const styleEl = document.createElement("style");
  styleEl.id = THEME_COLOR_STYLE_ID;
  document.head.appendChild(styleEl);
  return styleEl;
}

function serializeCssVars(cssVars: Record<string, string>): string {
  return Object.entries(cssVars)
    .map(([key, value]) => `--${key}: ${value};`)
    .join(" ");
}

// Apply dark mode class to document
export function applyDarkMode(darkMode: boolean) {
  const root = document.documentElement;

  if (darkMode) {
    root.classList.remove("light");
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }

  root.style.colorScheme = darkMode ? "dark" : "light";
}

// Apply radius to document
export function applyRadius(radius: string) {
  const root = document.documentElement;
  root.style.setProperty("--radius", radius);
}

// Apply color preset to document
export function applyColors(colorPresetName: string) {
  const preset = getColorPreset(colorPresetName);
  if (!preset) return;

  const styleEl = getOrCreateThemeColorStyleElement();

  const lightCss = serializeCssVars(preset.colors.light);
  const darkCss = serializeCssVars(preset.colors.dark);

  styleEl.textContent = `:root { ${lightCss} } .dark { ${darkCss} }`;
}

// Apply font to document
export function applyFont(fontId: string) {
  const fontPreset = getFontPreset(fontId);
  if (!fontPreset) return;

  const { fontFamily, googleFontsUrl } = fontPreset;

  // Validate Google Fonts URL to prevent XSS attacks
  if (!googleFontsUrl.startsWith("https://fonts.googleapis.com/")) {
    console.warn("[PreviewCN] Invalid font URL");
    return;
  }

  // Inject Google Fonts link if not already present
  const linkId = `previewcn-font-${fontId}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = googleFontsUrl;
    document.head.appendChild(link);
  }

  // Update CSS variables
  const root = document.documentElement;
  root.style.setProperty("--font-sans-override", fontFamily);
  root.style.setProperty("--font-sans", fontFamily);
}

// Apply full theme config
export function applyTheme(config: ThemeConfig) {
  if (config.colorPreset !== null) {
    applyColors(config.colorPreset);
  }

  if (config.radius !== null) {
    applyRadius(config.radius);
  }

  if (config.darkMode !== null) {
    applyDarkMode(config.darkMode);
  }

  if (config.font !== null) {
    applyFont(config.font);
  }
}

export function clearTheme() {
  const styleEl = document.getElementById(THEME_COLOR_STYLE_ID);
  if (styleEl) styleEl.remove();

  const root = document.documentElement;
  root.style.removeProperty("--radius");
  root.style.removeProperty("--font-sans-override");
  root.style.removeProperty("--font-sans");
  root.style.removeProperty("color-scheme");
  root.classList.remove("light", "dark");
}
