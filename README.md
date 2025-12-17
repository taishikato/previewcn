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

function getOrCreateThemeColorStyleElement(): HTMLStyleElement {
  const existing = document.getElementById(THEME_COLOR_STYLE_ID);
  if (existing instanceof HTMLStyleElement) {
    return existing;
  }

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

export type ThemeMessage =
  | { type: "APPLY_THEME"; cssVars: Record<string, string>; darkMode?: boolean }
  | { type: "TOGGLE_DARK_MODE"; darkMode: boolean }
  | { type: "UPDATE_RADIUS"; radius: string }
  | {
      type: "UPDATE_COLORS";
      cssVars: { light: Record<string, string>; dark: Record<string, string> };
    };

export function ThemeReceiver() {
  useEffect(() => {
    const handler = (event: MessageEvent<ThemeMessage>) => {
      // Allow messages from any origin in development
      const root = document.documentElement;

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

## 🤝 Contributing

PRs are welcome! Please run `pnpm lint` before submitting.

## 📄 License

MIT
