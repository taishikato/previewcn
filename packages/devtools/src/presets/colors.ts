// Color presets compatible with shadcn/ui
// Uses OKLCH color space for better perceptual uniformity

import { colorPresetSpecs, type PresetSpec } from "./color-preset-specs";

export type ColorPreset = {
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

const defaultDestructive = {
  light: "oklch(0.577 0.245 27.325)",
  dark: "oklch(0.704 0.191 22.216)",
};

const defaultPrimaryForeground = {
  light: "oklch(0.985 0 0)",
  dark: "oklch(0.985 0 0)",
};

function createColorPreset(spec: PresetSpec): ColorPreset {
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

export const colorPresets: ColorPreset[] =
  colorPresetSpecs.map(createColorPreset);

export function getColorPreset(name: string): ColorPreset | undefined {
  return colorPresets.find((p) => p.name === name);
}
