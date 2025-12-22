# PRD: shadcn Theme Editor

## Overview

A real-time theme editor for shadcn/ui that allows developers to preview theme changes directly on their own Next.js applications during development. Unlike [shadcn/ui create](https://ui.shadcn.com/create) which only previews on pre-built demo components, this tool enables developers to see exactly how their actual application will look with different theme configurations.

## Problem Statement

When customizing shadcn/ui themes, developers face these challenges:

1. **Disconnected Preview**: The official shadcn create tool shows themes on generic demo components, not on the developer's actual UI
2. **Trial and Error**: Developers must manually edit CSS variables, refresh, and check results repeatedly
3. **Context Switching**: No way to rapidly compare different color schemes or radius values on real application components
4. **Export Friction**: After deciding on a theme, manually copying the right CSS variables is error-prone

## Solution

A web-based theme editor that:
- Runs locally alongside the developer's Next.js app
- Embeds the developer's app in an iframe
- Sends theme changes in real-time via `postMessage`
- Provides instant visual feedback on actual application components

## Target Users

- **Primary**: Next.js developers using shadcn/ui who want to customize their theme
- **Secondary**: Design system maintainers evaluating color schemes for their applications

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Theme Editor (localhost:3000)                              │
│  ┌──────────────────┐  ┌─────────────────────────────────┐ │
│  │ Editor Panel     │  │ Preview Panel (iframe)          │ │
│  │                  │  │                                 │ │
│  │ • Color Presets  │  │  ┌─────────────────────────┐   │ │
│  │ • Radius         │  │  │ User's App              │   │ │
│  │ • Mode (L/D)     │──┼─▶│ (localhost:3001)        │   │ │
│  │ • Export         │  │  │                         │   │ │
│  │                  │  │  │ + ThemeReceiver         │   │ │
│  └──────────────────┘  │  └─────────────────────────┘   │ │
│                        └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ postMessage({ type: 'APPLY_THEME', cssVars })
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  User's Next.js App (localhost:3001)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <ThemeReceiver />                                    │   │
│  │ - Listens for postMessage events                     │   │
│  │ - Updates CSS variables on document.documentElement  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Phase 1: Core Theme Editing (MVP)

#### 1.1 Color Presets
- Pre-defined color palettes compatible with shadcn/ui
- Colors: Neutral, Blue, Green, Orange, Rose, Violet (expandable)
- Uses OKLCH color space for perceptual uniformity
- Visual color swatches with selection indicator

#### 1.2 Border Radius
- Preset options: None, Small, Medium, Large, Extra Large, Full
- Visual preview of each radius option
- Applies to all shadcn components via `--radius` CSS variable

#### 1.3 Light/Dark Mode
- Toggle between light and dark theme variants
- Sends appropriate CSS variables based on mode
- Independent of the target app's theme state

#### 1.4 Real-time Preview
- iframe embedding of target application
- postMessage communication for theme updates
- Instant visual feedback (<50ms latency)

#### 1.5 CSS Export
- One-click copy of generated CSS variables
- Output format compatible with shadcn/ui globals.css
- Includes both `:root` and `.dark` selectors

#### 1.6 ThemeReceiver Component
- Lightweight React component for target apps
- Development-only inclusion (tree-shaken in production)
- Simple installation: `npm install @shadcn-theme-editor/receiver`

### Phase 2: Enhanced Customization

#### 2.1 Custom Color Picker
- HSL/OKLCH color picker for primary color
- Auto-generate complementary colors
- Real-time preview of custom colors

#### 2.2 Individual Variable Editing
- Edit specific CSS variables (background, foreground, etc.)
- Advanced mode for power users
- Preserve custom overrides across preset changes

#### 2.3 Font Selection
- Font family picker (system fonts, Google Fonts)
- Font size scale adjustments
- Preview typography changes

#### 2.4 Component-Specific Theming
- Sidebar colors
- Chart colors
- Destructive/accent color overrides

### Phase 3: Workflow Integration

#### 3.1 URL Configuration
- Dynamic target URL input
- Support for different ports/paths
- URL persistence in localStorage

#### 3.2 Theme Presets Management
- Save custom themes locally
- Import/export theme configurations
- Share themes via URL parameters

#### 3.3 CLI Tool
```bash
npx shadcn-theme-editor --target http://localhost:3001
```
- Auto-detect Next.js projects
- Suggest ThemeReceiver installation
- Open browser automatically

#### 3.4 VS Code Extension
- Integrated theme editing in IDE
- Side-by-side preview
- Direct file modification option

### Phase 4: Advanced Features

#### 4.1 Theme Comparison
- Side-by-side view of two themes
- Diff visualization
- A/B testing support

#### 4.2 Accessibility Checks
- Contrast ratio validation
- WCAG compliance indicators
- Color blindness simulation

#### 4.3 Animation Previews
- Preview transition timing
- Animation curve adjustments
- Motion preference support

## Technical Specifications

### CSS Variables (shadcn/ui v4 compatible)

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: ...;
  --chart-2: ...;
  --chart-3: ...;
  --chart-4: ...;
  --chart-5: ...;
  --sidebar: ...;
  --sidebar-foreground: ...;
  --sidebar-primary: ...;
  --sidebar-primary-foreground: ...;
  --sidebar-accent: ...;
  --sidebar-accent-foreground: ...;
  --sidebar-border: ...;
  --sidebar-ring: ...;
}
```

### postMessage Protocol

**Note on initial load behavior**

- The editor **does not automatically send the current ThemeConfig on iframe initial load**.
- Theme updates are sent **only when the user changes a setting** (color preset, radius, mode, font, etc.).
- This keeps the embedded app's initial render and existing styling as-is, and avoids forcing a theme onto pages that haven't opted into receiving updates yet.

**Message Types**

The protocol uses granular message types for efficient updates. Each message type targets a specific aspect of the theme, allowing for optimized updates without sending unnecessary data.

```typescript
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

type ThemeMessage =
  | ApplyThemeMessage
  | ToggleDarkModeMessage
  | UpdateRadiusMessage
  | UpdateColorsMessage
  | UpdateFontMessage;
```

**Message Usage**

- **`APPLY_THEME`**: Used for initial theme application or when multiple properties change simultaneously. Includes all CSS variables and optional dark mode flag.
- **`TOGGLE_DARK_MODE`**: Sent when only the dark/light mode toggle changes. Updates the `.dark` class and `color-scheme` style property.
- **`UPDATE_RADIUS`**: Sent when only the border radius changes. Updates the `--radius` CSS variable.
- **`UPDATE_COLORS`**: Sent when only the color preset changes. Updates color variables for both light and dark modes using a dynamic `<style>` element.
- **`UPDATE_FONT`**: Sent when only the font selection changes. Dynamically loads the Google Font and updates `--font-sans-override` and `--font-sans` CSS variables.

**Example Payloads**

```typescript
// Full theme application
{
  type: "APPLY_THEME",
  cssVars: {
    "primary": "oklch(0.546 0.245 262.881)",
    "primary-foreground": "oklch(0.985 0 0)",
    "radius": "0.5rem",
    // ... other variables
  },
  darkMode: false
}

// Dark mode toggle only
{
  type: "TOGGLE_DARK_MODE",
  darkMode: true
}

// Radius update only
{
  type: "UPDATE_RADIUS",
  radius: "0.625rem"
}

// Color preset change only
{
  type: "UPDATE_COLORS",
  cssVars: {
    light: {
      "primary": "oklch(0.488 0.243 264.376)",
      "primary-foreground": "oklch(0.97 0.014 254.604)",
      // ... other color variables
    },
    dark: {
      "primary": "oklch(0.42 0.18 266)",
      "primary-foreground": "oklch(0.97 0.014 254.604)",
      // ... other color variables
    }
  }
}

// Font change only
{
  type: "UPDATE_FONT",
  fontId: "inter",
  fontFamily: '"Inter", sans-serif',
  googleFontsUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
}
```

### ThemeReceiver Component

The ThemeReceiver component handles all message types and applies updates efficiently:

```tsx
"use client";

import { useEffect } from "react";

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

type ThemeMessage =
  | ApplyThemeMessage
  | ToggleDarkModeMessage
  | UpdateRadiusMessage
  | UpdateColorsMessage
  | UpdateFontMessage;

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

export function ThemeReceiver() {
  useEffect(() => {
    const handler = (event: MessageEvent<ThemeMessage>) => {
      const root = document.documentElement;

      if (event.data?.type === "APPLY_THEME") {
        // Apply CSS variables
        Object.entries(event.data.cssVars).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value);
        });

        // Apply dark mode class based on the message
        if (event.data.darkMode !== undefined) {
          if (event.data.darkMode) {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }
      }

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

      if (event.data?.type === "UPDATE_RADIUS") {
        root.style.setProperty("--radius", event.data.radius);
      }

      if (event.data?.type === "UPDATE_COLORS") {
        const { light, dark } = event.data.cssVars;
        const styleEl = getOrCreateThemeColorStyleElement();

        // Generate CSS for both modes
        const lightCss = serializeCssVars(light);
        const darkCss = serializeCssVars(dark);

        styleEl.textContent = `:root { ${lightCss} } .dark { ${darkCss} }`;
      }

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
```

## User Experience

### Installation Flow

1. User installs theme editor: `npm install -D shadcn-theme-editor`
2. Add ThemeReceiver to app layout (dev only)
3. Run theme editor: `npx shadcn-theme-editor`
4. Editor opens at localhost:4000, shows user's app in iframe
5. User customizes theme, sees changes in real-time
6. User exports CSS and updates globals.css

### Editor Interface

```
┌─────────────────────────────────────────────────────────────────────┐
│ shadcn Theme Editor                                    [localhost]  │
├──────────────────────┬──────────────────────────────────────────────┤
│                      │ ┌──────────────────────────────────────────┐ │
│  Color               │ │ ● ● ●                      Preview       │ │
│  ┌──┐ ┌──┐ ┌──┐     │ ├──────────────────────────────────────────┤ │
│  │  │ │  │ │  │ ... │ │                                          │ │
│  └──┘ └──┘ └──┘     │ │                                          │ │
│                      │ │         [ User's Application ]           │ │
│  Radius              │ │                                          │ │
│  ┌────┐ ┌────┐ ...  │ │                                          │ │
│  │None│ │ SM │      │ │                                          │ │
│  └────┘ └────┘      │ │                                          │ │
│                      │ │                                          │ │
│  Mode                │ │                                          │ │
│  ┌─────┐ ┌─────┐    │ │                                          │ │
│  │Light│ │Dark │    │ │                                          │ │
│  └─────┘ └─────┘    │ │                                          │ │
│                      │ │                                          │ │
│  Export              │ └──────────────────────────────────────────┘ │
│  ┌─────────────────┐ │                                              │
│  │ Copy CSS Vars   │ │                                              │
│  └─────────────────┘ │                                              │
│                      │                                              │
└──────────────────────┴──────────────────────────────────────────────┘
```

## Success Metrics

1. **Adoption**: Number of npm downloads per month
2. **Engagement**: Average session duration in editor
3. **Completion**: % of users who export CSS after editing
4. **Satisfaction**: GitHub stars, user feedback

## Constraints & Considerations

### Security
- postMessage origin validation in production receiver
- No sensitive data transmitted
- iframe sandbox attributes where appropriate
- Font URL validation: Google Fonts URLs are validated to ensure they originate from `https://fonts.googleapis.com/` before being injected into the page, preventing XSS attacks from malicious font URLs

### Browser Compatibility
- Modern browsers only (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript features
- CSS OKLCH color space support (fallback for older browsers)

### Performance
- Theme updates should be <50ms
- Minimal bundle size for ThemeReceiver (<2KB)
- No runtime dependencies in receiver component

## Timeline

| Phase | Features | Duration |
|-------|----------|----------|
| Phase 1 | Core Theme Editing (MVP) | 2-3 weeks |
| Phase 2 | Enhanced Customization | 3-4 weeks |
| Phase 3 | Workflow Integration | 4-5 weeks |
| Phase 4 | Advanced Features | 6+ weeks |

## References

- [shadcn/ui Create](https://ui.shadcn.com/create) - Official theme creator
- [shadcn/ui Create Source](https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(create)) - Source code
- [OKLCH Color Space](https://oklch.com/) - Color space documentation
- [Tailwind CSS v4](https://tailwindcss.com/) - CSS framework

## Open Questions

1. Should we support frameworks other than Next.js (Remix, Astro, etc.)?
2. How to handle apps with existing theme provider wrappers?
3. Should the receiver component auto-detect editor presence?
4. Cloud-hosted version vs local-only?
