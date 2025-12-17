"use client";

import { useEffect } from "react";
import type { PreviewCNMessage } from "@/lib/theme-messages";

const THEME_COLOR_STYLE_ID = "previewcn-theme-colors";

function getOrCreateThemeColorStyleElement(): HTMLStyleElement {
  const existing = document.getElementById(THEME_COLOR_STYLE_ID);
  if (existing instanceof HTMLStyleElement) {
    return existing;
  }

  // If something else is using the same id, replace it with a <style> element.
  if (existing) {
    existing.remove();
  }

  const styleEl = document.createElement("style");
  styleEl.id = THEME_COLOR_STYLE_ID;
  document.head.appendChild(styleEl);
  return styleEl;
}

function serializeCssVars(cssVars: Record<string, string>): string {
  return Object.entries(cssVars)
    .map(([key, value]) => `--${key}: ${value};`)
    .join(" ");
}

function sendToParent(message: PreviewCNMessage) {
  // Send to parent window (iframe scenario)
  if (window.parent !== window) {
    window.parent.postMessage(message, "*");
  }
}

export function ThemeReceiver() {
  useEffect(() => {
    // Send READY message on mount to signal the receiver is active
    sendToParent({ type: "PREVIEWCN_READY" });

    const handler = (event: MessageEvent<PreviewCNMessage>) => {
      // Allow messages from any origin in development
      const root = document.documentElement;

      // Handle handshake ping - respond with pong (does not trigger theme application)
      if (event.data?.type === "PREVIEWCN_PING") {
        sendToParent({ type: "PREVIEWCN_PONG" });
        return;
      }

      if (event.data?.type === "APPLY_THEME") {
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
        root.style.setProperty("--radius", event.data.radius);
      }

      // Handle color update only (no radius variable)
      // Uses dynamic <style> element to properly apply :root and .dark selectors
      if (event.data?.type === "UPDATE_COLORS") {
        const { light, dark } = event.data.cssVars;

        const styleEl = getOrCreateThemeColorStyleElement();

        // Generate CSS for both modes
        const lightCss = serializeCssVars(light);
        const darkCss = serializeCssVars(dark);

        styleEl.textContent = `:root { ${lightCss} } .dark { ${darkCss} }`;
      }

      // Handle font update
      // Dynamically loads Google Font and updates CSS variable
      if (event.data?.type === "UPDATE_FONT") {
        const { fontId, fontFamily, googleFontsUrl } = event.data;

        if (!googleFontsUrl.startsWith("https://fonts.googleapis.com/")) {
          console.warn("Invalid font URL");
          return;
        }

        // Inject Google Fonts link if not already present
        const linkId = `previewcn-font-${fontId}`;
        if (!document.getElementById(linkId)) {
          const link = document.createElement("link");
          link.id = linkId;
          link.rel = "stylesheet";
          link.href = googleFontsUrl;
          document.head.appendChild(link);
        }

        // Update CSS variable (use override variable for Tailwind v4 compatibility)
        root.style.setProperty("--font-sans-override", fontFamily);
        // Also set --font-sans for external sites that don't use the override pattern
        root.style.setProperty("--font-sans", fontFamily);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return null;
}
