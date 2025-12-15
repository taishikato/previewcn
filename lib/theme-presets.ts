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
// Based on Tailwind CSS color palette: https://tailwindcss.com/docs/colors
type PresetSpec = {
  name: string;
  label: string;
  primary: {
    light: string;
    dark: string;
  };
  primaryForeground?: {
    light?: string;
    dark?: string;
  };
  destructive?: {
    light?: string;
    dark?: string;
  };
};

const defaultDestructive = {
  light: "oklch(0.577 0.245 27.325)",
  dark: "oklch(0.704 0.191 22.216)",
};

const defaultPrimaryForeground = {
  light: "oklch(0.985 0 0)",
  dark: "oklch(0.985 0 0)",
};

function createColorPreset(spec: PresetSpec): ThemePreset {
  return {
    name: spec.name,
    label: spec.label,
    colors: {
      light: {
        ...neutralColors.light,
        primary: spec.primary.light,
        "primary-foreground":
          spec.primaryForeground?.light ?? defaultPrimaryForeground.light,
        destructive: spec.destructive?.light ?? defaultDestructive.light,
      },
      dark: {
        ...neutralColors.dark,
        primary: spec.primary.dark,
        "primary-foreground":
          spec.primaryForeground?.dark ?? defaultPrimaryForeground.dark,
        destructive: spec.destructive?.dark ?? defaultDestructive.dark,
      },
    },
  };
}

// Color values from shadcn/ui create (color-theme.json)
const colorPresetSpecs: PresetSpec[] = [
  {
    name: "neutral",
    label: "Neutral",
    primary: { light: "oklch(0.556 0 0)", dark: "oklch(0.708 0 0)" },
    primaryForeground: { dark: "oklch(0.205 0 0)" },
  },
  {
    name: "red",
    label: "Red",
    primary: {
      light: "oklch(0.577 0.245 27.325)",
      dark: "oklch(0.637 0.237 25.331)",
    },
    destructive: { light: "oklch(0.505 0.213 27.518)" },
  },
  {
    name: "orange",
    label: "Orange",
    primary: {
      light: "oklch(0.646 0.222 41.116)",
      dark: "oklch(0.705 0.213 47.604)",
    },
    primaryForeground: { dark: "oklch(0.145 0 0)" },
  },
  {
    name: "amber",
    label: "Amber",
    primary: { light: "oklch(0.67 0.16 58)", dark: "oklch(0.77 0.16 70)" },
    primaryForeground: { light: "oklch(0.145 0 0)", dark: "oklch(0.145 0 0)" },
  },
  {
    name: "yellow",
    label: "Yellow",
    primary: {
      light: "oklch(0.541 0.281 293.009)",
      dark: "oklch(0.795 0.184 86.047)",
    },
    primaryForeground: { light: "oklch(0.145 0 0)", dark: "oklch(0.145 0 0)" },
  },
  {
    name: "lime",
    label: "Lime",
    primary: { light: "oklch(0.65 0.18 132)", dark: "oklch(0.77 0.20 131)" },
    primaryForeground: { light: "oklch(0.145 0 0)", dark: "oklch(0.145 0 0)" },
  },
  {
    name: "green",
    label: "Green",
    primary: {
      light: "oklch(0.648 0.2 131.684)",
      dark: "oklch(0.648 0.2 131.684)",
    },
    primaryForeground: { dark: "oklch(0.145 0 0)" },
  },
  {
    name: "emerald",
    label: "Emerald",
    primary: { light: "oklch(0.60 0.13 163)", dark: "oklch(0.70 0.15 162)" },
    primaryForeground: { dark: "oklch(0.145 0 0)" },
  },
  {
    name: "teal",
    label: "Teal",
    primary: { light: "oklch(0.60 0.10 185)", dark: "oklch(0.70 0.12 183)" },
    primaryForeground: { dark: "oklch(0.145 0 0)" },
  },
  {
    name: "cyan",
    label: "Cyan",
    primary: { light: "oklch(0.61 0.11 222)", dark: "oklch(0.71 0.13 215)" },
    primaryForeground: { dark: "oklch(0.145 0 0)" },
  },
  {
    name: "sky",
    label: "Sky",
    primary: { light: "oklch(0.59 0.14 242)", dark: "oklch(0.68 0.15 237)" },
    primaryForeground: { dark: "oklch(0.145 0 0)" },
  },
  {
    name: "blue",
    label: "Blue",
    primary: {
      light: "oklch(0.488 0.243 264.376)",
      dark: "oklch(0.42 0.18 266)",
    },
  },
  {
    name: "indigo",
    label: "Indigo",
    primary: { light: "oklch(0.51 0.23 277)", dark: "oklch(0.59 0.20 277)" },
  },
  {
    name: "violet",
    label: "Violet",
    primary: {
      light: "oklch(0.541 0.281 293.009)",
      dark: "oklch(0.70 0.12 183)",
    },
  },
  {
    name: "purple",
    label: "Purple",
    primary: { light: "oklch(0.56 0.25 302)", dark: "oklch(0.63 0.23 304)" },
  },
  {
    name: "fuchsia",
    label: "Fuchsia",
    primary: { light: "oklch(0.59 0.26 323)", dark: "oklch(0.67 0.26 322)" },
  },
  {
    name: "pink",
    label: "Pink",
    primary: { light: "oklch(0.59 0.22 1)", dark: "oklch(0.66 0.21 354)" },
  },
  {
    name: "rose",
    label: "Rose",
    primary: {
      light: "oklch(0.586 0.253 17.585)",
      dark: "oklch(0.645 0.246 16.439)",
    },
  },
];

export const colorPresets: ThemePreset[] =
  colorPresetSpecs.map(createColorPreset);

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
