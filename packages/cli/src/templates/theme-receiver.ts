// Template for generating previewcn-theme-receiver.tsx in target project
// This combines types and component into a single file

export const THEME_RECEIVER_TEMPLATE = `"use client";

import { useEffect } from "react";

// ============================================================================
// PostMessage Types
// ============================================================================

type ApplyThemeMessage = {
  type: "APPLY_THEME";
  cssVars: Record<string, string>;
  darkMode?: boolean;
};

type ToggleDarkModeMessage = {
  type: "TOGGLE_DARK_MODE";
  darkMode: boolean;
};

type UpdateRadiusMessage = {
  type: "UPDATE_RADIUS";
  radius: string;
};

type UpdateColorsMessage = {
  type: "UPDATE_COLORS";
  cssVars: { light: Record<string, string>; dark: Record<string, string> };
};

type UpdateFontMessage = {
  type: "UPDATE_FONT";
  fontId: string;
  fontFamily: string;
  googleFontsUrl: string;
};

type ReadyMessage = {
  type: "PREVIEWCN_READY";
};

type PingMessage = {
  type: "PREVIEWCN_PING";
};

type PongMessage = {
  type: "PREVIEWCN_PONG";
};

type ThemeMessage =
  | ApplyThemeMessage
  | ToggleDarkModeMessage
  | UpdateRadiusMessage
  | UpdateColorsMessage
  | UpdateFontMessage;

type HandshakeMessage = ReadyMessage | PingMessage | PongMessage;

type PreviewCNMessage = ThemeMessage | HandshakeMessage;

// ============================================================================
// ThemeReceiver Component
// ============================================================================

const THEME_COLOR_STYLE_ID = "previewcn-theme-colors";
const THEME_FONT_STYLE_ID = "previewcn-theme-font";

function getOrCreateStyleElement(id: string): HTMLStyleElement {
  const existing = document.getElementById(id);
  if (existing instanceof HTMLStyleElement) {
    return existing;
  }

  if (existing) {
    existing.remove();
  }

  const styleEl = document.createElement("style");
  styleEl.id = id;
  document.head.appendChild(styleEl);
  return styleEl;
}

function getOrCreateThemeColorStyleElement(): HTMLStyleElement {
  return getOrCreateStyleElement(THEME_COLOR_STYLE_ID);
}

function getOrCreateThemeFontStyleElement(): HTMLStyleElement {
  return getOrCreateStyleElement(THEME_FONT_STYLE_ID);
}

function serializeCssVars(cssVars: Record<string, string>): string {
  return Object.entries(cssVars)
    .map(([key, value]) => \`--\${key}: \${value};\`)
    .join(" ");
}

function sendToParent(message: PreviewCNMessage) {
  if (window.parent !== window) {
    window.parent.postMessage(message, "*");
  }
}

/**
 * ThemeReceiver component for PreviewCN theme preview.
 * This component is dev-only and enables real-time theme preview from the PreviewCN editor.
 */
export function PreviewCNThemeReceiver() {
  useEffect(() => {
    sendToParent({ type: "PREVIEWCN_READY" });

    const handler = (event: MessageEvent<PreviewCNMessage>) => {
      const root = document.documentElement;

      if (event.data?.type === "PREVIEWCN_PING") {
        sendToParent({ type: "PREVIEWCN_PONG" });
        return;
      }

      if (event.data?.type === "APPLY_THEME") {
        Object.entries(event.data.cssVars).forEach(([key, value]) => {
          root.style.setProperty(\`--\${key}\`, value);
        });

        if (event.data.darkMode !== undefined) {
          if (event.data.darkMode) {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }
      }

      if (event.data?.type === "TOGGLE_DARK_MODE") {
        if (event.data.darkMode) {
          root.classList.remove("light");
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
          root.classList.add("light");
        }
        root.style.colorScheme = event.data.darkMode ? "dark" : "light";
      }

      if (event.data?.type === "UPDATE_RADIUS") {
        root.style.setProperty("--radius", event.data.radius);
      }

      if (event.data?.type === "UPDATE_COLORS") {
        const { light, dark } = event.data.cssVars;
        const styleEl = getOrCreateThemeColorStyleElement();
        const lightCss = serializeCssVars(light);
        const darkCss = serializeCssVars(dark);
        styleEl.textContent = \`:root { \${lightCss} } .dark { \${darkCss} }\`;
      }

      if (event.data?.type === "UPDATE_FONT") {
        const { fontId, fontFamily, googleFontsUrl } = event.data;

        if (!googleFontsUrl.startsWith("https://fonts.googleapis.com/")) {
          return;
        }

        const linkId = \`previewcn-font-\${fontId}\`;
        if (!document.getElementById(linkId)) {
          const link = document.createElement("link");
          link.id = linkId;
          link.rel = "stylesheet";
          link.href = googleFontsUrl;
          document.head.appendChild(link);
        }

        const styleEl = getOrCreateThemeFontStyleElement();
        styleEl.textContent = \`
          :root {
            --font-sans: \${fontFamily} !important;
            --font-sans-override: \${fontFamily} !important;
            --font-geist-sans: \${fontFamily} !important;
          }
          html, body, .font-sans {
            font-family: \${fontFamily} !important;
          }
        \`;
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return null;
}
`;

export const THEME_RECEIVER_FILENAME = "previewcn-theme-receiver.tsx";
