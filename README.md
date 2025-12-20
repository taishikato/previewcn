<img width="1200" alt="Image" src="https://github.com/user-attachments/assets/b2d7b49e-82ef-4b1b-8fe4-9cca5c30c226" />

# PreviewCN 🎨

> A real-time shadcn/ui theme editor that lets you preview theme changes on your actual application, not just demo components.

> 🧪 Note: PreviewCN is early-stage and moving fast. Expect rough edges, breaking changes, and rapid improvements. Buckle up!

## ✨ What's this?

Tired of tweaking CSS variables, refreshing your browser, and hoping your app looks right? PreviewCN embeds your app in an iframe and applies theme changes **instantly** as you edit. See exactly how your buttons, cards, and forms will look before you commit to a theme.

## 🛠 Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **OKLCH** color space for beautiful, perceptually uniform colors

---

## 🚀 Getting Started

### ⚠️ Important: You need TWO apps running!

PreviewCN works by embedding **your app** inside it. This means you need to run both:

```
┌─────────────────────────────────────────────────────────────┐
│  Terminal 1: Your App                                       │
│  $ cd your-nextjs-app                                       │
│  $ pnpm dev                                                 │
│  → Running at http://localhost:3000                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Terminal 2: PreviewCN (this project)                       │
│  $ cd previewcn                                             │
│  $ pnpm dev --port 3001                                     │
│  → Running at http://localhost:3001                         │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step Setup

#### 1️⃣ Add ThemeReceiver to YOUR app first

Before anything else, add this component to your app so it can receive theme updates:

```tsx
// your-app/components/theme-receiver.tsx
"use client";

import { useEffect } from "react";

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
    .map(([key, value]) => `--${key}: ${value};`)
    .join(" ");
}

// Shared postMessage payload types (kept local here for copy/paste).
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

// Handshake messages for connection status visibility (does not trigger theme application).
type ReadyMessage = { type: "PREVIEWCN_READY" };
type PingMessage = { type: "PREVIEWCN_PING" };
type PongMessage = { type: "PREVIEWCN_PONG" };

type PreviewCNMessage =
  | ApplyThemeMessage
  | ToggleDarkModeMessage
  | UpdateRadiusMessage
  | UpdateColorsMessage
  | UpdateFontMessage
  | ReadyMessage
  | PingMessage
  | PongMessage;

function sendToParent(message: ReadyMessage | PongMessage) {
  // Send to parent window (iframe scenario)
  if (window.parent !== window) {
    window.parent.postMessage(message, "*");
  }
}

export function ThemeReceiver() {
  useEffect(() => {
    // Send READY message on mount to signal the receiver is active
    // This enables connection status detection in PreviewCN
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
      // Dynamically loads Google Font and injects CSS to override fonts universally
      if (event.data?.type === "UPDATE_FONT") {
        const { fontId, fontFamily, googleFontsUrl } = event.data;

        // Validate Google Fonts URL to prevent XSS attacks
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

        // Use multiple strategies to ensure font override works universally
        // This covers various Tailwind v4 and next/font configurations
        const styleEl = getOrCreateThemeFontStyleElement();
        styleEl.textContent = `
          :root {
            --font-sans: ${fontFamily} !important;
            --font-sans-override: ${fontFamily} !important;
            --font-geist-sans: ${fontFamily} !important;
          }
          html, body, .font-sans {
            font-family: ${fontFamily} !important;
          }
        `;
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return null;
}
```

Then include it in your root layout (dev only):

```tsx
// your-app/app/layout.tsx
import { ThemeReceiver } from "@/components/theme-receiver";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <ThemeReceiver />}
      </body>
    </html>
  );
}
```

#### 2️⃣ Start YOUR app

```bash
cd your-nextjs-app
pnpm dev
```

#### 3️⃣ Start PreviewCN

Open a **new terminal** and run:

```bash
cd previewcn
pnpm install
pnpm dev --port 3001
```

#### 4️⃣ Open PreviewCN and enter your app's URL

1. Open [http://localhost:3001](http://localhost:3001) in your browser
2. **Enter your app's URL** (e.g., `http://localhost:3000`) in the URL input field
3. Your app will appear in the preview panel!

```
┌──────────────────────────────────────────────────────────────────────┐
│  PreviewCN (localhost:3001)                                          │
├─────────────────────┬────────────────────────────────────────────────┤
│                     │                                                │
│  📍 URL Input       │   ┌────────────────────────────────────────┐  │
│  ┌───────────────┐  │   │                                        │  │
│  │localhost:3000 │  │   │   👀 YOUR APP APPEARS HERE!            │  │
│  └───────────────┘  │   │                                        │  │
│                     │   │   (embedded via iframe)                │  │
│  🎨 Color Presets   │   │                                        │  │
│  🔘 Radius          │   │   Theme changes apply instantly!       │  │
│  🌙 Dark Mode       │   │                                        │  │
│  📋 Export CSS      │   └────────────────────────────────────────┘  │
│                     │                                                │
└─────────────────────┴────────────────────────────────────────────────┘
```

<img width="600" alt="Image" src="https://github.com/user-attachments/assets/9caa7542-35ac-46c9-bbfd-292cc42668fd" />

---

## 💡 How to Use

1. **Pick a color**: Choose from 18 beautiful color presets (Neutral, Blue, Rose, Violet, and more!)
2. **Adjust the radius**: From sharp corners to fully rounded, find your vibe
3. **Toggle dark mode**: See how your theme looks in both light and dark
4. **Copy the CSS**: Export your theme and paste it into your app's `globals.css`

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production server |
| `pnpm lint` | Run ESLint |

## 🔧 Troubleshooting

### Connection status shows "Not Connected"?

Make sure you've added the `ThemeReceiver` component to your app and it's rendering in development mode.

### Theme changes not applying?

1. Check browser DevTools for console errors
2. Verify the `ThemeReceiver` component is mounted (look for `PREVIEWCN_READY` in network/console)
3. Check if `<style id="previewcn-theme-colors">` or `<style id="previewcn-theme-font">` elements are being created in `<head>`

For detailed implementation information, see [Font Override Setup](./docs/font-override-setup.md).

---

## 🤝 Contributing

PRs are welcome! Please run `pnpm lint` before submitting.

## 📄 License

MIT
