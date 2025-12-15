// Theme presets compatible with shadcn/ui create
// Uses OKLCH color space for better perceptual uniformity

export type ThemePreset = {
  name: string;
  label: string;
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
};

// Base neutral colors that all themes share
const neutralColors = {
  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.145 0 0)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.145 0 0)",
    secondary: "oklch(0.97 0 0)",
    "secondary-foreground": "oklch(0.205 0 0)",
    muted: "oklch(0.97 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    accent: "oklch(0.97 0 0)",
    "accent-foreground": "oklch(0.205 0 0)",
    border: "oklch(0.922 0 0)",
    input: "oklch(0.922 0 0)",
    ring: "oklch(0.708 0 0)",
  },
  dark: {
    background: "oklch(0.145 0 0)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.205 0 0)",
    "card-foreground": "oklch(0.985 0 0)",
    popover: "oklch(0.205 0 0)",
    "popover-foreground": "oklch(0.985 0 0)",
    secondary: "oklch(0.269 0 0)",
    "secondary-foreground": "oklch(0.985 0 0)",
    muted: "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    accent: "oklch(0.269 0 0)",
    "accent-foreground": "oklch(0.985 0 0)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.556 0 0)",
  },
};

// Color presets - primary color variations
export const colorPresets: ThemePreset[] = [
  {
    name: "neutral",
    label: "Neutral",
    colors: {
      light: {
        ...neutralColors.light,
        primary: "oklch(0.205 0 0)",
        "primary-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
      },
      dark: {
        ...neutralColors.dark,
        primary: "oklch(0.922 0 0)",
        "primary-foreground": "oklch(0.205 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
      },
    },
  },
  {
    name: "blue",
    label: "Blue",
    colors: {
      light: {
        ...neutralColors.light,
        primary: "oklch(0.546 0.245 262.881)",
        "primary-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
      },
      dark: {
        ...neutralColors.dark,
        primary: "oklch(0.623 0.214 259.815)",
        "primary-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
      },
    },
  },
  {
    name: "green",
    label: "Green",
    colors: {
      light: {
        ...neutralColors.light,
        primary: "oklch(0.527 0.154 150.069)",
        "primary-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
      },
      dark: {
        ...neutralColors.dark,
        primary: "oklch(0.627 0.194 149.214)",
        "primary-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
      },
    },
  },
  {
    name: "orange",
    label: "Orange",
    colors: {
      light: {
        ...neutralColors.light,
        primary: "oklch(0.646 0.222 41.116)",
        "primary-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
      },
      dark: {
        ...neutralColors.dark,
        primary: "oklch(0.702 0.209 41.348)",
        "primary-foreground": "oklch(0.145 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
      },
    },
  },
  {
    name: "rose",
    label: "Rose",
    colors: {
      light: {
        ...neutralColors.light,
        primary: "oklch(0.585 0.233 3.958)",
        "primary-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
      },
      dark: {
        ...neutralColors.dark,
        primary: "oklch(0.671 0.199 12.157)",
        "primary-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
      },
    },
  },
  {
    name: "violet",
    label: "Violet",
    colors: {
      light: {
        ...neutralColors.light,
        primary: "oklch(0.541 0.281 293.009)",
        "primary-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",
      },
      dark: {
        ...neutralColors.dark,
        primary: "oklch(0.627 0.265 303.9)",
        "primary-foreground": "oklch(0.985 0 0)",
        destructive: "oklch(0.704 0.191 22.216)",
      },
    },
  },
];

// Radius presets
export const radiusPresets = [
  { name: "none", label: "None", value: "0rem" },
  { name: "sm", label: "Small", value: "0.3rem" },
  { name: "md", label: "Medium", value: "0.5rem" },
  { name: "lg", label: "Large", value: "0.625rem" },
  { name: "xl", label: "Extra Large", value: "0.75rem" },
  { name: "full", label: "Full", value: "1rem" },
];

export type ThemeConfig = {
  colorPreset: string;
  radius: string;
  darkMode: boolean;
};

export const defaultThemeConfig: ThemeConfig = {
  colorPreset: "neutral",
  radius: "0.625rem",
  darkMode: false,
};

// Generate CSS variables from theme config
export function generateCssVars(config: ThemeConfig): Record<string, string> {
  const preset = colorPresets.find((p) => p.name === config.colorPreset);
  if (!preset) return {};

  const colors = config.darkMode ? preset.colors.dark : preset.colors.light;

  return {
    ...colors,
    radius: config.radius,
  };
}

// Generate full CSS for export
export function generateThemeCss(config: ThemeConfig): string {
  const lightPreset = colorPresets.find((p) => p.name === config.colorPreset);
  if (!lightPreset) return "";

  const lightVars = Object.entries(lightPreset.colors.light)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  const darkVars = Object.entries(lightPreset.colors.dark)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  return `:root {
  --radius: ${config.radius};
${lightVars}
}

.dark {
${darkVars}
}`;
}
