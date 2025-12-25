export function generateUseThemeStateTemplate(): string {
  return `"use client";

import { useCallback, useState } from "react";

import { getThemePreset } from "./presets/theme-presets";
import type { ThemeConfig } from "./theme-applier";
import {
  applyColors,
  applyDarkMode,
  applyFont,
  applyPreset,
  applyRadius,
  clearTheme,
} from "./theme-applier";

// LocalStorage key for persisting theme state
const STORAGE_KEY = "previewcn-devtools-theme";

function loadFromStorage(): Partial<ThemeConfig> {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return {};
}

function saveToStorage(config: ThemeConfig) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore storage errors
  }
}

const defaultConfig: ThemeConfig = {
  colorPreset: null,
  radius: null,
  darkMode: null,
  font: null,
  preset: null,
};

export function useThemeState() {
  const [config, setConfigState] = useState<ThemeConfig>(() => ({
    ...defaultConfig,
    ...loadFromStorage(),
  }));

  const updateConfig = useCallback(
    (updater: (prev: ThemeConfig) => ThemeConfig) => {
      setConfigState((prev) => {
        const next = updater(prev);
        saveToStorage(next);
        return next;
      });
    },
    []
  );

  const setColorPreset = useCallback(
    (colorPreset: string) => {
      updateConfig((prev) => ({ ...prev, colorPreset }));
      applyColors(colorPreset);
    },
    [updateConfig]
  );

  const setRadius = useCallback(
    (radius: string) => {
      updateConfig((prev) => ({ ...prev, radius }));
      applyRadius(radius);
    },
    [updateConfig]
  );

  const setDarkMode = useCallback(
    (darkMode: boolean) => {
      updateConfig((prev) => ({ ...prev, darkMode }));
      applyDarkMode(darkMode);
    },
    [updateConfig]
  );

  const setFont = useCallback(
    (font: string) => {
      updateConfig((prev) => ({ ...prev, font }));
      applyFont(font);
    },
    [updateConfig]
  );

  const setPresetTheme = useCallback(
    (preset: string) => {
      const themePreset = getThemePreset(preset);
      if (!themePreset) return;

      updateConfig((prev) => ({
        ...prev,
        preset,
        // Update individual settings to match preset
        radius: themePreset.radius,
        font: themePreset.font?.value ?? prev.font,
        // Clear colorPreset since we're using preset colors
        colorPreset: null,
      }));
      applyPreset(preset);
    },
    [updateConfig]
  );

  const resetTheme = useCallback(() => {
    // Remove stored config
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    clearTheme();

    setConfigState(defaultConfig);
  }, []);

  return {
    config,
    setColorPreset,
    setRadius,
    setDarkMode,
    setFont,
    setPresetTheme,
    resetTheme,
  };
}
`;
}
