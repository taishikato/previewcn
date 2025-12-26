export function generateFontsTemplate(): string {
  return `// Font presets using Google Fonts

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
  {
    label: "Plus Jakarta Sans",
    value: "plus-jakarta-sans",
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
  },
  {
    label: "Poppins",
    value: "poppins",
    fontFamily: '"Poppins", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
  },
  {
    label: "Open Sans",
    value: "open-sans",
    fontFamily: '"Open Sans", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap",
  },
  {
    label: "Montserrat",
    value: "montserrat",
    fontFamily: '"Montserrat", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap",
  },
  {
    label: "Oxanium",
    value: "oxanium",
    fontFamily: '"Oxanium", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;600;700&display=swap",
  },
  {
    label: "Libre Baskerville",
    value: "libre-baskerville",
    fontFamily: '"Libre Baskerville", serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap",
  },
  {
    label: "Merriweather",
    value: "merriweather",
    fontFamily: '"Merriweather", serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
  },
  {
    label: "Architects Daughter",
    value: "architects-daughter",
    fontFamily: '"Architects Daughter", cursive',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap",
  },
  {
    label: "Antic",
    value: "antic",
    fontFamily: '"Antic", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Antic&display=swap",
  },
];

export function getFontPreset(value: string): FontPreset | undefined {
  return fontPresets.find((f) => f.value === value);
}
`;
}
