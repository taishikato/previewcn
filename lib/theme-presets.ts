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
        "primary-foreground": spec.primaryForeground?.light ?? defaultPrimaryForeground.light,
        destructive: spec.destructive?.light ?? defaultDestructive.light,
      },
      dark: {
        ...neutralColors.dark,
        primary: spec.primary.dark,
        "primary-foreground": spec.primaryForeground?.dark ?? defaultPrimaryForeground.dark,
        destructive: spec.destructive?.dark ?? defaultDestructive.dark,
      },
    },
  };
}

const colorPresetSpecs: PresetSpec[] = [
  {
    name: "neutral",
    label: "Neutral",
    primary: { light: "oklch(0.205 0 0)", dark: "oklch(0.922 0 0)" },
    primaryForeground: { dark: "oklch(0.205 0 0)" },
  },
  {
    name: "red",
    label: "Red",
    primary: { light: "oklch(0.577 0.245 27.325)", dark: "oklch(0.637 0.237 25.331)" },
    destructive: { light: "oklch(0.505 0.213 27.518)" },
  },
  {
    name: "orange",
    label: "Orange",
    primary: { light: "oklch(0.646 0.222 41.116)", dark: "oklch(0.705 0.213 47.604)" },
    primaryForeground: { dark: "oklch(0.145 0 0)" },
  },
  {
    name: "amber",
    label: "Amber",
    primary: { light: "oklch(0.666 0.179 58.318)", dark: "oklch(0.769 0.188 70.08)" },
    primaryForeground: { light: "oklch(0.145 0 0)", dark: "oklch(0.145 0 0)" },
  },
  {
    name: "yellow",
    label: "Yellow",
    primary: { light: "oklch(0.681 0.162 75.834)", dark: "oklch(0.795 0.184 86.047)" },
    primaryForeground: { light: "oklch(0.145 0 0)", dark: "oklch(0.145 0 0)" },
  },
  {
    name: "lime",
    label: "Lime",
    primary: { light: "oklch(0.648 0.2 131.684)", dark: "oklch(0.768 0.233 130.85)" },
    primaryForeground: { light: "oklch(0.145 0 0)", dark: "oklch(0.145 0 0)" },
  },
  {
    name: "green",
    label: "Green",
    primary: { light: "oklch(0.627 0.194 149.214)", dark: "oklch(0.723 0.219 142.495)" },
    primaryForeground: { dark: "oklch(0.145 0 0)" },
  },
  {
    name: "emerald",
    label: "Emerald",
    primary: { light: "oklch(0.596 0.145 163.225)", dark: "oklch(0.696 0.17 162.48)" },
    primaryForeground: { dark: "oklch(0.145 0 0)" },
  },
  {
    name: "teal",
    label: "Teal",
    primary: { light: "oklch(0.6 0.118 184.704)", dark: "oklch(0.704 0.14 182.503)" },
    primaryForeground: { dark: "oklch(0.145 0 0)" },
  },
  {
    name: "cyan",
    label: "Cyan",
    primary: { light: "oklch(0.609 0.126 221.723)", dark: "oklch(0.715 0.143 215.221)" },
    primaryForeground: { dark: "oklch(0.145 0 0)" },
  },
  {
    name: "sky",
    label: "Sky",
    primary: { light: "oklch(0.588 0.158 241.966)", dark: "oklch(0.685 0.169 237.323)" },
    primaryForeground: { dark: "oklch(0.145 0 0)" },
  },
  {
    name: "blue",
    label: "Blue",
    primary: { light: "oklch(0.546 0.245 262.881)", dark: "oklch(0.623 0.214 259.815)" },
  },
  {
    name: "indigo",
    label: "Indigo",
    primary: { light: "oklch(0.511 0.262 276.966)", dark: "oklch(0.585 0.233 277.117)" },
  },
  {
    name: "violet",
    label: "Violet",
    primary: { light: "oklch(0.541 0.281 293.009)", dark: "oklch(0.606 0.25 292.717)" },
  },
  {
    name: "purple",
    label: "Purple",
    primary: { light: "oklch(0.558 0.288 302.321)", dark: "oklch(0.627 0.265 303.9)" },
  },
  {
    name: "fuchsia",
    label: "Fuchsia",
    primary: { light: "oklch(0.591 0.293 322.896)", dark: "oklch(0.667 0.295 322.15)" },
  },
  {
    name: "pink",
    label: "Pink",
    primary: { light: "oklch(0.592 0.249 0.584)", dark: "oklch(0.656 0.241 354.308)" },
  },
  {
    name: "rose",
    label: "Rose",
    primary: { light: "oklch(0.586 0.253 17.585)", dark: "oklch(0.645 0.246 16.439)" },
  },
];

export const colorPresets: ThemePreset[] = colorPresetSpecs.map(createColorPreset);

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
