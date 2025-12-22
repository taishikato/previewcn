"use client";

import { useCallback, useState } from "react";

import type { ThemeConfig } from "../theme-applier";
import {
  applyColors,
  applyDarkMode,
  applyFont,
  applyRadius,
  clearTheme,
} from "../theme-applier";

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
};

export function useThemeState() {
  const [config, setConfigState] = useState<ThemeConfig>(() => ({
    ...defaultConfig,
    ...loadFromStorage(),
  }));

  const setColorPreset = useCallback((colorPreset: string) => {
    setConfigState((prev) => {
      const next = { ...prev, colorPreset };
      saveToStorage(next);
      return next;
    });
    applyColors(colorPreset);
  }, []);

  const setRadius = useCallback((radius: string) => {
    setConfigState((prev) => {
      const next = { ...prev, radius };
      saveToStorage(next);
      return next;
    });
    applyRadius(radius);
  }, []);

  const setDarkMode = useCallback((darkMode: boolean) => {
    setConfigState((prev) => {
      const next = { ...prev, darkMode };
      saveToStorage(next);
      return next;
    });
    applyDarkMode(darkMode);
  }, []);

  const setFont = useCallback((font: string) => {
    setConfigState((prev) => {
      const next = { ...prev, font };
      saveToStorage(next);
      return next;
    });
    applyFont(font);
  }, []);

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
    resetTheme,
  };
}
