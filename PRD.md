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

An embedded devtools panel that:
- Installs as a dev dependency in the developer's Next.js app
- Renders a floating theme editor panel directly in the app
- Applies theme changes in real-time via direct DOM manipulation
- Provides instant visual feedback on actual application components
- Only renders in development mode (tree-shaken in production)

## Target Users

- **Primary**: Next.js developers using shadcn/ui who want to customize their theme
- **Secondary**: Design system maintainers evaluating color schemes for their applications

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  User's Next.js App (localhost:3000)                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Application Content                                  │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ User's Components                           │   │   │
│  │  │ (with shadcn/ui)                            │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PreviewcnDevtools (dev only)                        │   │
│  │ ┌─────┐  ┌─────────────────────────────────────┐   │   │
│  │ │ 🎨  │  │ Theme Editor Panel                  │   │   │
│  │ │     │  │ • Color Presets                     │   │   │
│  │ │ FAB │  │ • Radius                            │   │   │
│  │ │     │  │ • Mode (Light/Dark)                 │   │   │
│  │ └─────┘  │ • Font                              │   │   │
│  │          │ • Export                            │   │   │
│  │          └─────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

- **Trigger**: Floating action button (FAB) in the corner of the screen
- **Panel**: Slide-out panel with theme editing controls
- **Theme Applier**: Direct DOM manipulation to apply CSS variables

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
- Applies appropriate CSS variables based on mode
- Syncs with the app's existing theme state

#### 1.4 Real-time Preview
- Direct DOM manipulation for instant updates
- No iframe or postMessage overhead
- Instant visual feedback (<16ms latency)

#### 1.5 CSS Export
- One-click copy of generated CSS variables
- Output format compatible with shadcn/ui globals.css
- Includes both `:root` and `.dark` selectors

#### 1.6 PreviewcnDevtools Component
- Lightweight React component for target apps
- Development-only inclusion (tree-shaken in production)
- Simple installation: `npx previewcn init`

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

#### 3.1 Theme Presets Management
- Save custom themes locally
- Import/export theme configurations
- Share themes via URL parameters

#### 3.2 VS Code Extension
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

### Theme Applier

The theme applier directly manipulates the DOM to apply theme changes:

```typescript
function applyTheme(cssVars: Record<string, string>, darkMode: boolean) {
  const root = document.documentElement;

  // Apply CSS variables
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Apply dark mode class
  if (darkMode) {
    root.classList.remove("light");
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }

  root.style.colorScheme = darkMode ? "dark" : "light";
}
```

### PreviewcnDevtools Component

```tsx
"use client";

import { lazy, Suspense } from "react";

const DevtoolsPanel = lazy(() => import("./panel"));

export function PreviewcnDevtools() {
  // Only render in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <DevtoolsPanel />
    </Suspense>
  );
}
```

## User Experience

### Installation Flow

```bash
# 1. Initialize PreviewCN in your Next.js project
npx previewcn init

# This will:
# - Install @previewcn/devtools as a dev dependency
# - Add PreviewcnDevtools to your app layout

# 2. Start your dev server
pnpm dev

# 3. Click the theme palette icon in the bottom-right corner
# 4. Customize theme, see changes in real-time
# 5. Export CSS and update globals.css
```

### CLI Commands

```bash
# Initialize devtools (default command)
npx previewcn

# Or explicitly
npx previewcn init

# Check setup status
npx previewcn doctor
```

### Editor Interface

```
┌─────────────────────────────────────────────────────────────────────┐
│ Your Application                                                     │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                                                                │ │
│  │                    [ Application Content ]                     │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│                                              ┌────────────────────┐ │
│                                              │  Color             │ │
│                                              │  ┌──┐ ┌──┐ ┌──┐   │ │
│                                              │  │  │ │  │ │  │   │ │
│                                              │  └──┘ └──┘ └──┘   │ │
│                                              │                    │ │
│                                              │  Radius            │ │
│                                              │  ○ None  ○ SM     │ │
│                                              │  ○ MD    ○ LG     │ │
│                                              │                    │ │
│                                              │  Mode              │ │
│                                              │  ☀️ Light  🌙 Dark │ │
│                                              │                    │ │
│                                              │  Font              │ │
│                                              │  [Inter      ▼]   │ │
│                                              │                    │ │
│                                       ┌──┐   │  [Copy CSS]        │ │
│                                       │🎨│   └────────────────────┘ │
│                                       └──┘                          │
└─────────────────────────────────────────────────────────────────────┘
```

## Success Metrics

1. **Adoption**: Number of npm downloads per month
2. **Engagement**: Average session duration in editor
3. **Completion**: % of users who export CSS after editing
4. **Satisfaction**: GitHub stars, user feedback

## Constraints & Considerations

### Security
- Development-only component (not included in production builds)
- No external network requests for core functionality
- Font URL validation: Google Fonts URLs are validated to ensure they originate from `https://fonts.googleapis.com/` before being injected

### Browser Compatibility
- Modern browsers only (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript features
- CSS OKLCH color space support (fallback for older browsers)

### Performance
- Theme updates should be <16ms (single frame)
- Minimal bundle size for devtools (<20KB gzipped)
- Lazy-loaded panel component
- No runtime overhead in production

## Package Structure

```
packages/
├── cli/                    # CLI tool (previewcn)
│   └── src/
│       ├── commands/
│       │   ├── init.ts     # Initialize devtools
│       │   └── doctor.ts   # Check setup status
│       └── utils/
│
└── devtools/               # Devtools component (@previewcn/devtools)
    └── src/
        ├── devtools.tsx    # Main component
        ├── trigger.tsx     # FAB trigger button
        ├── panel/          # Editor panel
        │   ├── index.tsx
        │   ├── color-picker.tsx
        │   ├── radius-selector.tsx
        │   ├── font-selector.tsx
        │   └── mode-toggle.tsx
        ├── theme-applier.ts
        └── presets/
            ├── colors.ts
            ├── fonts.ts
            └── radius.ts
```

## References

- [shadcn/ui Create](https://ui.shadcn.com/create) - Official theme creator
- [shadcn/ui Create Source](https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(create)) - Source code
- [OKLCH Color Space](https://oklch.com/) - Color space documentation
- [Tailwind CSS v4](https://tailwindcss.com/) - CSS framework

## Open Questions

1. Should we support frameworks other than Next.js (Remix, Astro, etc.)?
2. How to handle apps with existing theme provider wrappers?
3. Cloud-hosted version for sharing themes?
