export function generateCssExportTemplate(): string {
  return `// CSS Export utilities for generating shadcn/ui compatible CSS

import { getColorPreset } from "./presets/colors";
import { getThemePreset } from "./presets/theme-presets";
import type { ThemeConfig } from "./theme-applier";

type ThemeColors = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

type ResolvedTheme = {
  colors: ThemeColors;
  radius: string;
};

/**
 * Resolve export-ready theme data based on config priority:
 * 1. colorPreset (if set and found)
 * 2. preset (full theme preset)
 * 3. null (no theme selected)
 */
function resolveExportTheme(config: ThemeConfig): ResolvedTheme | null {
  const preset = config.preset !== null ? getThemePreset(config.preset) : null;
  const colorPreset =
    config.colorPreset !== null ? getColorPreset(config.colorPreset) : null;

  const colors = colorPreset?.colors ?? preset?.colors ?? null;
  if (!colors) return null;

  const radius = config.radius ?? preset?.radius ?? "0.5rem";
  return { colors, radius };
}

/**
 * Format CSS variables with proper indentation
 */
function formatCssVars(
  cssVars: Record<string, string>,
  indent: string = "  "
): string {
  return Object.entries(cssVars)
    .map(([key, value]) => \`\${indent}--\${key}: \${value};\`)
    .join("\\n");
}

function formatCssBlock(selector: string, cssVars: Record<string, string>) {
  return \`\${selector} {\\n\${formatCssVars(cssVars)}\\n}\`;
}

/**
 * Generate CSS export string from current theme config
 * Output format is compatible with shadcn/ui globals.css
 */
export function generateExportCss(config: ThemeConfig): string | null {
  const theme = resolveExportTheme(config);
  if (!theme) return null;

  const lightVars = { radius: theme.radius, ...theme.colors.light };

  return \`\${formatCssBlock(":root", lightVars)}\\n\\n\${formatCssBlock(
    ".dark",
    theme.colors.dark
  )}\`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers or non-HTTPS contexts
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      document.body.removeChild(textArea);
      return result;
    } catch {
      return false;
    }
  }
}
`;
}
