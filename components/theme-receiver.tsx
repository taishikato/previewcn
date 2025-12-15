"use client";

import { useEffect } from "react";

export type ThemeMessage = {
  type: "APPLY_THEME";
  cssVars: Record<string, string>;
};

export function ThemeReceiver() {
  useEffect(() => {
    const handler = (event: MessageEvent<ThemeMessage>) => {
      // Allow messages from any origin in development
      if (event.data?.type === "APPLY_THEME") {
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
