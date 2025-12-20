# Font Selection Feature - Complete Implementation Guide

This document provides a complete guide for implementing font customization in previewcn. Another AI agent can use this guide to implement the feature from scratch.

## Overview

Add a real-time font preview feature that allows users to select from various fonts and see changes instantly in the iframe preview. This feature requires **no modifications** to the target app's CSS configuration.

### Available Fonts

| Font Name | Type |
|-----------|------|
| Inter | Sans-serif |
| Noto Sans | Sans-serif |
| Nunito Sans | Sans-serif |
| Figtree | Sans-serif |
| Roboto | Sans-serif |
| Raleway | Sans-serif |
| DM Sans | Sans-serif |
| Public Sans | Sans-serif |
| Outfit | Sans-serif |
| JetBrains Mono | Monospace |

## Architecture

### Data Flow

```
User clicks font button
        ↓
FontSelector.onChange(fontValue)
        ↓
updateConfig({ font: fontValue })
        ↓
useThemeEditor detects font change
        ↓
sendFontToIframe(font)
        ↓
postMessage({ type: "UPDATE_FONT", fontId, fontFamily, googleFontsUrl })
        ↓
ThemeReceiver receives message in iframe
        ↓
1. Inject <link href="https://fonts.googleapis.com/...">
2. Inject <style> element with font override rules
        ↓
Preview updates with new font
```

### Files to Create

| File | Purpose |
|------|---------|
| `lib/font-presets.ts` | Font definitions with Google Fonts URLs |
| `components/font-selector.tsx` | Grid-based font picker UI component |

### Files to Modify

| File | Changes |
|------|---------|
| `lib/theme-messages.ts` | Add `UpdateFontMessage` type |
| `lib/theme-presets.ts` | Add `font` to `ThemeConfig` type |
| `components/theme-receiver.tsx` | Add `UPDATE_FONT` message handler with style injection |
| `components/theme-editor/use-theme-editor.ts` | Add font dispatch logic |
| `components/theme-editor/theme-editor-sidebar.tsx` | Add Font card to sidebar |

---

## Step 1: Define Font Presets

Create `lib/font-presets.ts`:

```typescript
export type FontPreset = {
  name: string;
  label: string;
  value: string;
  fontFamily: string;
  googleFontsUrl: string;
};

export const fontPresets: FontPreset[] = [
  {
    name: "inter",
    label: "Inter",
    value: "inter",
    fontFamily: '"Inter", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
  {
    name: "noto-sans",
    label: "Noto Sans",
    value: "noto-sans",
    fontFamily: '"Noto Sans", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap",
  },
  {
    name: "nunito-sans",
    label: "Nunito Sans",
    value: "nunito-sans",
    fontFamily: '"Nunito Sans", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700&display=swap",
  },
  {
    name: "figtree",
    label: "Figtree",
    value: "figtree",
    fontFamily: '"Figtree", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap",
  },
  {
    name: "roboto",
    label: "Roboto",
    value: "roboto",
    fontFamily: '"Roboto", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
  },
  {
    name: "raleway",
    label: "Raleway",
    value: "raleway",
    fontFamily: '"Raleway", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap",
  },
  {
    name: "dm-sans",
    label: "DM Sans",
    value: "dm-sans",
    fontFamily: '"DM Sans", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap",
  },
  {
    name: "public-sans",
    label: "Public Sans",
    value: "public-sans",
    fontFamily: '"Public Sans", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap",
  },
  {
    name: "outfit",
    label: "Outfit",
    value: "outfit",
    fontFamily: '"Outfit", sans-serif',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap",
  },
  {
    name: "jetbrains-mono",
    label: "JetBrains Mono",
    value: "jetbrains-mono",
    fontFamily: '"JetBrains Mono", monospace',
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap",
  },
];

export const defaultFont = "inter";

export function getFontPreset(value: string): FontPreset | undefined {
  return fontPresets.find((f) => f.value === value);
}
```

---

## Step 2: Add Message Type

Add to `lib/theme-messages.ts`:

```typescript
export type UpdateFontMessage = {
  type: "UPDATE_FONT";
  fontId: string;
  fontFamily: string;
  googleFontsUrl: string;
};

// Add to ThemeMessage union type:
export type ThemeMessage =
  | ApplyThemeMessage
  | ToggleDarkModeMessage
  | UpdateRadiusMessage
  | UpdateColorsMessage
  | UpdateFontMessage;  // Add this
```

---

## Step 3: Update ThemeConfig Type

Add to `lib/theme-presets.ts`:

```typescript
export type ThemeConfig = {
  color: string | null;
  radius: string | null;
  mode: "light" | "dark" | null;
  font: string | null;  // Add this
};
```

---

## Step 4: Create FontSelector Component

Create `components/font-selector.tsx`:

```typescript
"use client";

import { fontPresets } from "@/lib/font-presets";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FontSelectorProps = {
  value: string | null;
  onChange: (value: string) => void;
};

export function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {fontPresets.map((preset) => {
        const isSelected = value === preset.value;

        return (
          <Button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            aria-label={preset.label}
            aria-pressed={isSelected}
            className={cn("justify-start gap-x-2", isSelected && "bg-accent")}
            variant="ghost"
            title={preset.label}
            size="lg"
          >
            <span
              className="truncate font-medium"
              style={{ fontFamily: preset.fontFamily }}
            >
              {preset.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
```

---

## Step 5: Update ThemeReceiver (Critical)

This is the most important part. The ThemeReceiver must use **style injection** to override fonts universally.

### The Challenge

Different shadcn/ui + Next.js apps configure fonts in different ways:

| Configuration | Example | Challenge |
|---------------|---------|-----------|
| Default shadcn setup | `--font-sans: var(--font-geist-sans)` | CSS variable indirection |
| shadcn/ui website pattern | `--font-sans: var(--font-sans)` | Self-referencing variable |
| Tailwind v4 `@theme inline` | Generates `.font-sans` class | Class-based, not variable-based |

In Tailwind CSS v4, `@theme inline { --font-sans: var(--font-geist-sans); }` generates:

```css
.font-sans {
  font-family: var(--font-geist-sans);
}
```

Simply setting `--font-sans` on `:root` doesn't work because the generated class directly references `--font-geist-sans`.

### The Solution: Multi-Target Style Injection

Add to `components/theme-receiver.tsx`:

```typescript
const THEME_COLOR_STYLE_ID = "previewcn-theme-colors";
const THEME_FONT_STYLE_ID = "previewcn-theme-font";  // Add this

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

// In the message handler, add:
if (event.data?.type === "UPDATE_FONT") {
  const { fontId, fontFamily, googleFontsUrl } = event.data;

  // Validate URL to prevent XSS
  if (!googleFontsUrl.startsWith("https://fonts.googleapis.com/")) {
    console.warn("Invalid font URL");
    return;
  }

  // 1. Inject Google Fonts link if not already present
  const linkId = `previewcn-font-${fontId}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = googleFontsUrl;
    document.head.appendChild(link);
  }

  // 2. Inject CSS rules that override fonts at multiple levels
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
```

### Why Each Rule is Needed

| CSS Rule | What It Overrides |
|----------|-------------------|
| `--font-sans: ... !important` | Apps using `var(--font-sans)` directly |
| `--font-sans-override: ... !important` | Apps using fallback pattern |
| `--font-geist-sans: ... !important` | Default Next.js/shadcn apps |
| `html, body { font-family: ... }` | Direct font-family on root elements |
| `.font-sans { font-family: ... }` | Tailwind's `.font-sans` utility class |

### Why `!important` is Necessary

Without `!important`, the injected styles would lose to:
1. Tailwind's generated utility classes (same specificity, but earlier in document order)
2. Inline styles set by `next/font`
3. Existing rules in the target app

Since this is a development-only preview tool, using `!important` is acceptable.

---

## Step 6: Update useThemeEditor Hook

Add font dispatch logic to `components/theme-editor/use-theme-editor.ts`:

```typescript
import { getFontPreset } from "@/lib/font-presets";

// In the hook, add a function to send font updates:
const sendFontToIframe = useCallback((fontValue: string) => {
  const preset = getFontPreset(fontValue);
  if (!preset || !iframeRef.current?.contentWindow) return;

  iframeRef.current.contentWindow.postMessage(
    {
      type: "UPDATE_FONT",
      fontId: preset.value,
      fontFamily: preset.fontFamily,
      googleFontsUrl: preset.googleFontsUrl,
    },
    "*"
  );
}, []);

// Call this when font changes in the config:
useEffect(() => {
  if (config.font) {
    sendFontToIframe(config.font);
  }
}, [config.font, sendFontToIframe]);
```

---

## Step 7: Add Font Card to Sidebar

Add to `components/theme-editor/theme-editor-sidebar.tsx`:

```typescript
import { FontSelector } from "@/components/font-selector";

// In the sidebar component, add a card for fonts:
<Card>
  <CardHeader>
    <CardTitle>Font</CardTitle>
    <CardDescription>Select a font to apply</CardDescription>
  </CardHeader>
  <CardContent>
    <FontSelector
      value={config.font}
      onChange={(font) => updateConfig({ font })}
    />
  </CardContent>
</Card>
```

---

## Testing

1. Start the target app (e.g., `localhost:3000`)
2. Start previewcn (e.g., `localhost:3001`)
3. Enter the target URL in previewcn
4. Select different fonts and verify they apply
5. Check browser DevTools:
   - Look for `<style id="previewcn-theme-font">` in `<head>`
   - Verify the CSS rules are correct
   - Check computed styles on text elements

---

## Troubleshooting

### Font not changing

1. **Check the `<style>` element**: Open DevTools and look for `previewcn-theme-font` in `<head>`
2. **Check computed styles**: Select a text element and check what `font-family` is being applied
3. **Check network tab**: Verify the Google Font is being loaded

### Font loads but doesn't apply

1. **CSS specificity issue**: Another rule with higher specificity may be overriding
2. **Missing `!important`**: Ensure all rules have `!important`
3. **Wrong selector**: Some elements may have inline styles or specific classes

---

## Security Considerations

1. **URL Validation**: Only allow URLs starting with `https://fonts.googleapis.com/`
2. **CSS Injection**: The `fontFamily` value is inserted into CSS - ensure it comes from trusted presets
3. **Development Only**: The ThemeReceiver should only be rendered in development mode

```tsx
{process.env.NODE_ENV === "development" && <ThemeReceiver />}
```

---

## CSS Export (Optional)

If implementing CSS export, include the selected font:

```css
:root {
  --radius: 0.625rem;
  --font-sans: "Inter", sans-serif;
  /* color variables */
}
```
