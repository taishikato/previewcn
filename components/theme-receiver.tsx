"use client";

import { useEffect } from "react";

export type ThemeMessage =
  | { type: "APPLY_THEME"; cssVars: Record<string, string>; darkMode?: boolean }
  | { type: "TOGGLE_DARK_MODE"; darkMode: boolean }
  | { type: "UPDATE_RADIUS"; radius: string }
  | { type: "UPDATE_COLORS"; cssVars: Record<string, string> };

export function ThemeReceiver() {
  useEffect(() => {
    const handler = (event: MessageEvent<ThemeMessage>) => {
      // Allow messages from any origin in development
      if (event.data?.type === "APPLY_THEME") {
        const root = document.documentElement;

        // Apply CSS variables
        Object.entries(event.data.cssVars).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value);
        });

        // Apply dark mode class based on the message
        // This keeps preview's dark mode independent from parent app's dark mode
        if (event.data.darkMode !== undefined) {
          if (event.data.darkMode) {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }
      }

      // Handle dark mode toggle only (no CSS variables)
      // This is used when the target site already has its own dark/light CSS variables
      if (event.data?.type === "TOGGLE_DARK_MODE") {
        const root = document.documentElement;

        // Toggle class names
        if (event.data.darkMode) {
          root.classList.remove("light");
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
          root.classList.add("light");
        }

        // Set color-scheme style
        root.style.colorScheme = event.data.darkMode ? "dark" : "light";
      }

      // Handle radius update only (no color variables)
      if (event.data?.type === "UPDATE_RADIUS") {
        const root = document.documentElement;
        root.style.setProperty("--radius", event.data.radius);
      }

      // Handle color update only (no radius variable)
      if (event.data?.type === "UPDATE_COLORS") {
        const root = document.documentElement;
        Object.entries(event.data.cssVars).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value);
        });
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return null;
}
