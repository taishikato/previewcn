# Font Selection Feature Implementation

## Purpose

Add a real-time font preview feature to the theme editor, allowing users to select from the same fonts available in shadcn/ui's create app and see changes instantly in the iframe preview.

## Background

The previewcn theme editor already supported:
- Color preset selection
- Border radius customization
- Light/dark mode toggle

This implementation adds font selection as the fourth customization option, matching the functionality of [shadcn/ui create](https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(create)).

## Available Fonts

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

## Technical Approach

Fonts are loaded dynamically via Google Fonts API. When a user selects a font:

1. `FontSelector` component triggers `updateConfig({ font: "inter" })`
2. `useThemeEditor` hook detects the font change
3. `postMessage` sends `UPDATE_FONT` message to the iframe with font details
4. `ThemeReceiver` in the target app:
   - Injects a `<link>` tag to load the Google Font (if not already loaded)
   - Updates CSS variables (`--font-sans-override` and `--font-sans`)
5. The preview updates in real-time

### Tailwind v4 Compatibility

The `/preview` demo page uses Tailwind v4's `@theme inline` block which originally defined:
```css
--font-sans: var(--font-geist-sans);
```

This created a variable chain that couldn't be overridden at runtime. The fix was to use an override variable:
```css
--font-sans: var(--font-sans-override, var(--font-geist-sans));
```

`ThemeReceiver` now sets both variables to ensure compatibility:
- `--font-sans-override`: For the preview page (Tailwind v4 pattern)
- `--font-sans`: For external target sites

## Files Created

- `lib/font-presets.ts` - Font definitions with Google Fonts URLs
- `components/font-selector.tsx` - Grid-based font picker UI

## Files Modified

- `app/globals.css` - Added `--font-sans-override` fallback pattern for Tailwind v4
- `lib/theme-presets.ts` - Added `font` to `ThemeConfig` type
- `components/theme-receiver.tsx` - Added `UPDATE_FONT` message handler
- `components/theme-editor/use-theme-editor.ts` - Added font dispatch logic
- `components/theme-editor/theme-editor-sidebar.tsx` - Added Font card to sidebar

## Data Flow

```
User clicks font button
        ↓
FontSelector.onChange(fontValue)
        ↓
updateConfig({ font: fontValue })
        ↓
useThemeEditor detects font-only change
        ↓
sendFontToIframe(font)
        ↓
postMessage({ type: "UPDATE_FONT", fontId, fontFamily, googleFontsUrl })
        ↓
ThemeReceiver receives message
        ↓
1. Inject <link href="https://fonts.googleapis.com/...">
2. root.style.setProperty("--font-sans-override", fontFamily)
3. root.style.setProperty("--font-sans", fontFamily)
        ↓
Preview updates with new font
```

## CSS Export

When exporting CSS, the selected font is included:

```css
:root {
  --radius: 0.625rem;
  --font-sans: "Inter", sans-serif;
  /* color variables */
}

.dark {
  /* dark mode color variables */
}
```

## Date

2025-12-16
