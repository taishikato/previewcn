// Shared postMessage payload types between ThemeEditor (sender) and ThemeReceiver (receiver).
// Keeping this in /lib avoids importing React components just for types.

export type ApplyThemeMessage = {
  type: "APPLY_THEME";
  cssVars: Record<string, string>;
  darkMode?: boolean;
};

export type ToggleDarkModeMessage = {
  type: "TOGGLE_DARK_MODE";
  darkMode: boolean;
};

export type UpdateRadiusMessage = {
  type: "UPDATE_RADIUS";
  radius: string;
};

export type UpdateColorsMessage = {
  type: "UPDATE_COLORS";
  cssVars: { light: Record<string, string>; dark: Record<string, string> };
};

export type UpdateFontMessage = {
  type: "UPDATE_FONT";
  fontId: string;
  fontFamily: string;
  googleFontsUrl: string;
};

export type ThemeMessage =
  | ApplyThemeMessage
  | ToggleDarkModeMessage
  | UpdateRadiusMessage
  | UpdateColorsMessage
  | UpdateFontMessage;
