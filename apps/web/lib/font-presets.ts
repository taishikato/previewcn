// Font presets matching shadcn/ui create app
// Uses Google Fonts for dynamic loading

export type FontPreset = {
  label: string;
  value: string;
  fontFamily: string;
  googleFontsUrl: string;
};

export const fontPresets: FontPreset[] = [
  {
    label: "Inter",
    value: "inter",
    fontFamily: '"Inter", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
  {
    label: "Noto Sans",
    value: "noto-sans",
    fontFamily: '"Noto Sans", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap",
  },
  {
    label: "Nunito Sans",
    value: "nunito-sans",
    fontFamily: '"Nunito Sans", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700&display=swap",
  },
  {
    label: "Figtree",
    value: "figtree",
    fontFamily: '"Figtree", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap",
  },
  {
    label: "Roboto",
    value: "roboto",
    fontFamily: '"Roboto", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
  },
  {
    label: "Raleway",
    value: "raleway",
    fontFamily: '"Raleway", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap",
  },
  {
    label: "DM Sans",
    value: "dm-sans",
    fontFamily: '"DM Sans", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap",
  },
  {
    label: "Public Sans",
    value: "public-sans",
    fontFamily: '"Public Sans", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap",
  },
  {
    label: "Outfit",
    value: "outfit",
    fontFamily: '"Outfit", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap",
  },
  {
    label: "JetBrains Mono",
    value: "jetbrains-mono",
    fontFamily: '"JetBrains Mono", monospace',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap",
  },
];

export const defaultFont = "inter";

export function getFontPreset(value: string): FontPreset | undefined {
  return fontPresets.find((f) => f.value === value);
}
