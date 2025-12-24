// Direct DOM theme application (no postMessage needed)

import { getColorPreset } from "./presets/colors";
import { getFontPreset } from "./presets/fonts";
import {
  getThemePreset,
  type ThemePreset,
  type ThemePresetFont,
} from "./presets/theme-presets";

const THEME_COLOR_STYLE_ID = "previewcn-devtools-theme-colors";
const THEME_FONT_STYLE_ID = "previewcn-devtools-theme-font";

export type ThemeConfig = {
  colorPreset: string | null;
  radius: string | null;
  darkMode: boolean | null;
  font: string | null;
  preset: string | null;
};

type ThemeColors = {
  light: Record<string, string>;
  dark: Record<string, string>;
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

function applyThemeColors(colors: ThemeColors) {
  const styleEl = getOrCreateThemeColorStyleElement();

  const lightCss = serializeCssVars(colors.light);
  const darkCss = serializeCssVars(colors.dark);

  styleEl.textContent = `:root { ${lightCss} } .dark { ${darkCss} }`;
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

  applyThemeColors(preset.colors);
}

// Apply theme preset colors directly (bypasses colorPreset lookup)
export function applyPresetColors(preset: ThemePreset) {
  applyThemeColors(preset.colors);
}

function getOrCreateFontStyleElement(): HTMLStyleElement {
  const existing = document.getElementById(THEME_FONT_STYLE_ID);
  if (existing instanceof HTMLStyleElement) {
    return existing;
  }

  if (existing) {
    existing.remove();
  }

  const styleEl = document.createElement("style");
  styleEl.id = THEME_FONT_STYLE_ID;
  document.head.appendChild(styleEl);
  return styleEl;
}

function applyFontConfig(font: ThemePresetFont) {
  const { fontFamily, googleFontsUrl, value: fontId } = font;

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

  // Use multiple strategies to ensure font override works universally
  // This covers various Tailwind v4 and next/font configurations
  const styleEl = getOrCreateFontStyleElement();
  styleEl.textContent = `
    :root {
      --font-sans: ${fontFamily} !important;
      --font-sans-override: ${fontFamily} !important;
      --font-geist-sans: ${fontFamily} !important;
    }
    html, body, .font-sans {
      font-family: ${fontFamily} !important;
    }
  `;
}

// Apply font to document
export function applyFont(fontId: string) {
  const fontPreset = getFontPreset(fontId);
  if (!fontPreset) return;

  applyFontConfig(fontPreset);
}

// Apply font from theme preset (using preset's font config directly)
export function applyPresetFont(font: ThemePresetFont) {
  applyFontConfig(font);
}

// Apply a complete theme preset (colors, radius, and optionally font)
export function applyPreset(presetName: string) {
  const preset = getThemePreset(presetName);
  if (!preset) return;

  applyPresetColors(preset);
  applyRadius(preset.radius);

  if (preset.font) {
    applyFontConfig(preset.font);
  }
}

// Apply full theme config
export function applyTheme(config: ThemeConfig) {
  const preset = config.preset ? getThemePreset(config.preset) : null;

  if (config.colorPreset !== null) {
    applyColors(config.colorPreset);
  } else if (preset) {
    applyPresetColors(preset);
  }

  const radius = config.radius ?? preset?.radius;
  if (radius !== null && radius !== undefined) {
    applyRadius(radius);
  }

  if (config.darkMode !== null) {
    applyDarkMode(config.darkMode);
  }

  if (config.font !== null) {
    applyFont(config.font);
  } else if (preset?.font) {
    applyFontConfig(preset.font);
  }
}

export function clearTheme() {
  const colorStyleEl = document.getElementById(THEME_COLOR_STYLE_ID);
  if (colorStyleEl) colorStyleEl.remove();

  const fontStyleEl = document.getElementById(THEME_FONT_STYLE_ID);
  if (fontStyleEl) fontStyleEl.remove();

  const root = document.documentElement;
  root.style.removeProperty("--radius");
  root.style.removeProperty("color-scheme");
  root.classList.remove("light", "dark");
}
