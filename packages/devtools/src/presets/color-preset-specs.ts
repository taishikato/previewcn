// Color preset data used by the devtools color picker.
// Kept in a separate file to keep logic files small.

export type PresetSpec = {
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

export const colorPresetSpecs: PresetSpec[] = [
  {
    name: "neutral",
    label: "Neutral",
    primary: { light: "oklch(0.556 0 0)", dark: "oklch(0.708 0 0)" },
    primaryForeground: {
      light: "oklch(0.985 0 0)",
      dark: "oklch(0.205 0 0)",
    },
  },
  {
    name: "red",
    label: "Red",
    primary: {
      light: "oklch(0.577 0.245 27.325)",
      dark: "oklch(0.637 0.237 25.331)",
    },
    primaryForeground: {
      light: "oklch(0.971 0.013 17.38)",
      dark: "oklch(0.971 0.013 17.38)",
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
    primaryForeground: {
      light: "oklch(0.98 0.016 73.684)",
      dark: "oklch(0.98 0.016 73.684)",
    },
  },
  {
    name: "amber",
    label: "Amber",
    primary: { light: "oklch(0.67 0.16 58)", dark: "oklch(0.77 0.16 70)" },
    primaryForeground: {
      light: "oklch(0.99 0.02 95)",
      dark: "oklch(0.28 0.07 46)",
    },
  },
  {
    name: "yellow",
    label: "Yellow",
    primary: {
      light: "oklch(0.852 0.199 91.936)",
      dark: "oklch(0.795 0.184 86.047)",
    },
    primaryForeground: {
      light: "oklch(0.421 0.095 57.708)",
      dark: "oklch(0.421 0.095 57.708)",
    },
  },
  {
    name: "lime",
    label: "Lime",
    primary: {
      light: "oklch(0.65 0.18 132)",
      dark: "oklch(0.77 0.20 131)",
    },
    primaryForeground: {
      light: "oklch(0.99 0.03 121)",
      dark: "oklch(0.27 0.07 132)",
    },
  },
  {
    name: "green",
    label: "Green",
    primary: {
      light: "oklch(0.648 0.2 131.684)",
      dark: "oklch(0.648 0.2 131.684)",
    },
    primaryForeground: {
      light: "oklch(0.986 0.031 120.757)",
      dark: "oklch(0.986 0.031 120.757)",
    },
  },
  {
    name: "emerald",
    label: "Emerald",
    primary: {
      light: "oklch(0.60 0.13 163)",
      dark: "oklch(0.70 0.15 162)",
    },
    primaryForeground: {
      light: "oklch(0.98 0.02 166)",
      dark: "oklch(0.26 0.05 173)",
    },
  },
  {
    name: "teal",
    label: "Teal",
    primary: { light: "oklch(0.60 0.10 185)", dark: "oklch(0.70 0.12 183)" },
    primaryForeground: {
      light: "oklch(0.98 0.01 181)",
      dark: "oklch(0.28 0.04 193)",
    },
  },
  {
    name: "cyan",
    label: "Cyan",
    primary: { light: "oklch(0.61 0.11 222)", dark: "oklch(0.71 0.13 215)" },
    primaryForeground: {
      light: "oklch(0.98 0.02 201)",
      dark: "oklch(0.30 0.05 230)",
    },
  },
  {
    name: "sky",
    label: "Sky",
    primary: { light: "oklch(0.59 0.14 242)", dark: "oklch(0.68 0.15 237)" },
    primaryForeground: {
      light: "oklch(0.98 0.01 237)",
      dark: "oklch(0.29 0.06 243)",
    },
  },
  {
    name: "blue",
    label: "Blue",
    primary: {
      light: "oklch(0.488 0.243 264.376)",
      dark: "oklch(0.42 0.18 266)",
    },
    primaryForeground: {
      light: "oklch(0.97 0.014 254.604)",
      dark: "oklch(0.97 0.014 254.604)",
    },
  },
  {
    name: "indigo",
    label: "Indigo",
    primary: { light: "oklch(0.51 0.23 277)", dark: "oklch(0.59 0.20 277)" },
    primaryForeground: {
      light: "oklch(0.96 0.02 272)",
      dark: "oklch(0.96 0.02 272)",
    },
  },
  {
    name: "violet",
    label: "Violet",
    primary: {
      light: "oklch(0.541 0.281 293.009)",
      dark: "oklch(0.606 0.25 292.717)",
    },
    primaryForeground: {
      light: "oklch(0.969 0.016 293.756)",
      dark: "oklch(0.969 0.016 293.756)",
    },
  },
  {
    name: "purple",
    label: "Purple",
    primary: { light: "oklch(0.56 0.25 302)", dark: "oklch(0.63 0.23 304)" },
    primaryForeground: {
      light: "oklch(0.98 0.01 308)",
      dark: "oklch(0.98 0.01 308)",
    },
  },
  {
    name: "fuchsia",
    label: "Fuchsia",
    primary: { light: "oklch(0.59 0.26 323)", dark: "oklch(0.67 0.26 322)" },
    primaryForeground: {
      light: "oklch(0.98 0.02 320)",
      dark: "oklch(0.98 0.02 320)",
    },
  },
  {
    name: "pink",
    label: "Pink",
    primary: { light: "oklch(0.59 0.22 1)", dark: "oklch(0.66 0.21 354)" },
    primaryForeground: {
      light: "oklch(0.97 0.01 343)",
      dark: "oklch(0.97 0.01 343)",
    },
  },
  {
    name: "rose",
    label: "Rose",
    primary: {
      light: "oklch(0.586 0.253 17.585)",
      dark: "oklch(0.645 0.246 16.439)",
    },
    primaryForeground: {
      light: "oklch(0.969 0.015 12.422)",
      dark: "oklch(0.969 0.015 12.422)",
    },
  },
];
